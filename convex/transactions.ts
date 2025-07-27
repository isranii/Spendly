import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { 
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
    type: v.optional(v.union(v.literal("income"), v.literal("expense")))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let query = ctx.db
      .query("transactions")
      .withIndex("by_user_and_date", (q) => q.eq("userId", userId));

    if (args.category) {
      query = ctx.db
        .query("transactions")
        .withIndex("by_user_and_category", (q) => 
          q.eq("userId", userId).eq("category", args.category!)
        );
    }

    const transactions = await query
      .order("desc")
      .take(args.limit || 50);

    if (args.type) {
      return transactions.filter(t => t.type === args.type);
    }

    return transactions;
  },
});

export const create = mutation({
  args: {
    amount: v.number(),
    description: v.string(),
    category: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");

    // Validate amount is positive
    if (args.amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }
    if (args.amount > 1000000) {
      throw new Error("Amount cannot exceed $1,000,000");
    }

    // Sanitize description
    const description = args.description.trim();
    if (!description) {
      throw new Error("Description cannot be empty");
    }
    if (description.length > 100) {
      throw new Error("Description must be 100 characters or less");
    }

    return await ctx.db.insert("transactions", {
      userId,
      amount: Math.round(args.amount * 100) / 100, // Round to 2 decimal places
      description,
      category: args.category.trim(),
      type: args.type,
      date: Date.now(),
      tags: args.tags?.map(tag => tag.trim()).filter(Boolean),
      notes: args.notes?.trim(),
    });
  },
});

export const update = mutation({
  args: {
    transactionId: v.id("transactions"),
    amount: v.optional(v.number()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction || transaction.userId !== userId) {
      throw new Error("Transaction not found or access denied");
    }

    const updates: any = {};
    if (args.amount !== undefined) {
      if (args.amount <= 0) throw new Error("Amount must be greater than zero");
      updates.amount = Math.round(args.amount * 100) / 100;
    }
    if (args.description !== undefined) {
      const desc = args.description.trim();
      if (!desc) throw new Error("Description cannot be empty");
      updates.description = desc;
    }
    if (args.category !== undefined) updates.category = args.category.trim();
    if (args.tags !== undefined) updates.tags = args.tags.map(tag => tag.trim()).filter(Boolean);
    if (args.notes !== undefined) updates.notes = args.notes.trim();

    await ctx.db.patch(args.transactionId, updates);
    return { success: true };
  },
});

export const remove = mutation({
  args: { transactionId: v.id("transactions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction || transaction.userId !== userId) {
      throw new Error("Transaction not found or access denied");
    }

    await ctx.db.delete(args.transactionId);
    return { success: true };
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const monthlyTransactions = transactions.filter(t => t.date >= thisMonth.getTime());
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate trends
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    lastMonth.setHours(0, 0, 0, 0);
    
    const lastMonthTransactions = transactions.filter(t => 
      t.date >= lastMonth.getTime() && t.date < thisMonth.getTime()
    );
    
    const lastMonthIncome = lastMonthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netWorth: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      monthlyNet: monthlyIncome - monthlyExpenses,
      incomeGrowth: lastMonthIncome > 0 ? ((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0,
      expenseGrowth: lastMonthExpenses > 0 ? ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0,
    };
  },
});

export const getCategoryBreakdown = query({
  args: { period: v.optional(v.union(v.literal("month"), v.literal("year"), v.literal("all"))) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Filter by period
    if (args.period === "month") {
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      transactions = transactions.filter(t => t.date >= thisMonth.getTime());
    } else if (args.period === "year") {
      const thisYear = new Date();
      thisYear.setMonth(0, 1);
      thisYear.setHours(0, 0, 0, 0);
      transactions = transactions.filter(t => t.date >= thisYear.getTime());
    }

    const categoryMap = new Map();
    
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: transactions.length > 0 ? (amount / transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);
  },
});
