import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { includeInactive: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    if (args.includeInactive) {
      return await ctx.db
        .query("budgets")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("budgets")
      .withIndex("by_user_active", (q) => q.eq("userId", userId).eq("isActive", true))
      .collect();
  },
});

export const create = mutation({
  args: {
    category: v.string(),
    limit: v.number(),
    period: v.union(v.literal("weekly"), v.literal("monthly"), v.literal("yearly")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");

    // Validate inputs
    if (args.limit <= 0) {
      throw new Error("Budget limit must be greater than zero");
    }

    const category = args.category.trim();
    if (!category) {
      throw new Error("Category cannot be empty");
    }

    // Check for existing active budget in same category
    const existingBudget = await ctx.db
      .query("budgets")
      .withIndex("by_user_active", (q) => q.eq("userId", userId).eq("isActive", true))
      .filter((q) => q.eq(q.field("category"), category))
      .first();

    if (existingBudget) {
      throw new Error(`Active budget already exists for category: ${category}`);
    }

    return await ctx.db.insert("budgets", {
      userId,
      category,
      limit: Math.round(args.limit * 100) / 100,
      period: args.period,
      startDate: Date.now(),
      isActive: true,
    });
  },
});

export const updateBudget = mutation({
  args: {
    budgetId: v.id("budgets"),
    limit: v.optional(v.number()),
    period: v.optional(v.union(v.literal("weekly"), v.literal("monthly"), v.literal("yearly"))),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");

    const budget = await ctx.db.get(args.budgetId);
    if (!budget || budget.userId !== userId) {
      throw new Error("Budget not found or access denied");
    }

    const updates: any = {};
    if (args.limit !== undefined) {
      if (args.limit <= 0) throw new Error("Budget limit must be greater than zero");
      updates.limit = Math.round(args.limit * 100) / 100;
    }
    if (args.period !== undefined) updates.period = args.period;
    if (args.isActive !== undefined) updates.isActive = args.isActive;

    await ctx.db.patch(args.budgetId, updates);
    return { success: true };
  },
});

export const deleteBudget = mutation({
  args: { budgetId: v.id("budgets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");

    const budget = await ctx.db.get(args.budgetId);
    if (!budget || budget.userId !== userId) {
      throw new Error("Budget not found or access denied");
    }

    await ctx.db.delete(args.budgetId);
    return { success: true };
  },
});

export const getBudgetStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_user_active", (q) => q.eq("userId", userId).eq("isActive", true))
      .collect();

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return budgets.map(budget => {
      const now = Date.now();
      let periodStart = budget.startDate;
      
      // Calculate period start based on budget period
      if (budget.period === "monthly") {
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        periodStart = currentMonth.getTime();
      } else if (budget.period === "weekly") {
        const currentWeek = new Date();
        currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
        currentWeek.setHours(0, 0, 0, 0);
        periodStart = currentWeek.getTime();
      } else if (budget.period === "yearly") {
        const currentYear = new Date();
        currentYear.setMonth(0, 1);
        currentYear.setHours(0, 0, 0, 0);
        periodStart = currentYear.getTime();
      }

      const spent = transactions
        .filter(t => 
          t.type === "expense" && 
          t.category === budget.category && 
          t.date >= periodStart && 
          t.date <= now
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const remaining = budget.limit - spent;
      const percentage = (spent / budget.limit) * 100;
      
      // Calculate days remaining in period
      let daysRemaining = 0;
      if (budget.period === "weekly") {
        const endOfWeek = new Date();
        endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
        daysRemaining = Math.ceil((endOfWeek.getTime() - now) / (1000 * 60 * 60 * 24));
      } else if (budget.period === "monthly") {
        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
        daysRemaining = Math.ceil((endOfMonth.getTime() - now) / (1000 * 60 * 60 * 24));
      } else if (budget.period === "yearly") {
        const endOfYear = new Date();
        endOfYear.setFullYear(endOfYear.getFullYear() + 1, 0, 0);
        daysRemaining = Math.ceil((endOfYear.getTime() - now) / (1000 * 60 * 60 * 24));
      }

      return {
        ...budget,
        spent: Math.round(spent * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
        percentage: Math.round(percentage * 100) / 100,
        daysRemaining,
        status: percentage > 100 ? 'exceeded' : percentage > 90 ? 'warning' : percentage > 70 ? 'caution' : 'good'
      };
    });
  },
});

export const getBudgetAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const activeBudgets = budgets.filter(b => b.isActive);
    const totalBudgetLimit = activeBudgets.reduce((sum, b) => sum + b.limit, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const monthlyExpenses = transactions
      .filter(t => t.type === "expense" && t.date >= thisMonth.getTime())
      .reduce((sum, t) => sum + t.amount, 0);

    const budgetUtilization = totalBudgetLimit > 0 ? (monthlyExpenses / totalBudgetLimit) * 100 : 0;
    
    return {
      totalBudgets: budgets.length,
      activeBudgets: activeBudgets.length,
      totalBudgetLimit,
      monthlyExpenses,
      budgetUtilization,
      remainingBudget: Math.max(0, totalBudgetLimit - monthlyExpenses),
    };
  },
});
