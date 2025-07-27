import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { includeCompleted: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let query = ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (!args.includeCompleted) {
      query = ctx.db
        .query("goals")
        .withIndex("by_user_active", (q) => q.eq("userId", userId).eq("isCompleted", false));
    }

    return await query.order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    targetAmount: v.number(),
    deadline: v.optional(v.number()),
    category: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");

    // Validate inputs
    if (args.targetAmount <= 0) {
      throw new Error("Target amount must be greater than zero");
    }
    if (args.targetAmount > 10000000) {
      throw new Error("Target amount cannot exceed $10,000,000");
    }

    const title = args.title.trim();
    if (!title) {
      throw new Error("Goal title cannot be empty");
    }

    if (args.deadline && args.deadline <= Date.now()) {
      throw new Error("Deadline must be in the future");
    }

    return await ctx.db.insert("goals", {
      userId,
      title,
      targetAmount: Math.round(args.targetAmount * 100) / 100,
      currentAmount: 0,
      deadline: args.deadline,
      category: args.category.trim(),
      priority: args.priority,
      isCompleted: false,
      description: args.description?.trim(),
    });
  },
});

export const updateProgress = mutation({
  args: {
    goalId: v.id("goals"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== userId) {
      throw new Error("Goal not found or access denied");
    }

    if (goal.isCompleted) {
      throw new Error("Cannot update progress on completed goal");
    }

    if (args.amount <= 0) {
      throw new Error("Progress amount must be greater than zero");
    }

    const newAmount = Math.round((goal.currentAmount + args.amount) * 100) / 100;
    const isCompleted = newAmount >= goal.targetAmount;

    await ctx.db.patch(args.goalId, {
      currentAmount: newAmount,
      isCompleted,
    });

    return { 
      success: true, 
      isCompleted,
      progress: (newAmount / goal.targetAmount) * 100,
      remaining: Math.max(0, goal.targetAmount - newAmount)
    };
  },
});

export const updateGoal = mutation({
  args: {
    goalId: v.id("goals"),
    title: v.optional(v.string()),
    targetAmount: v.optional(v.number()),
    deadline: v.optional(v.number()),
    category: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== userId) {
      throw new Error("Goal not found or access denied");
    }

    const updates: any = {};
    if (args.title !== undefined) {
      const title = args.title.trim();
      if (!title) throw new Error("Goal title cannot be empty");
      updates.title = title;
    }
    if (args.targetAmount !== undefined) {
      if (args.targetAmount <= 0) throw new Error("Target amount must be greater than zero");
      updates.targetAmount = Math.round(args.targetAmount * 100) / 100;
      // Recalculate completion status
      updates.isCompleted = goal.currentAmount >= updates.targetAmount;
    }
    if (args.deadline !== undefined) {
      if (args.deadline && args.deadline <= Date.now()) {
        throw new Error("Deadline must be in the future");
      }
      updates.deadline = args.deadline;
    }
    if (args.category !== undefined) updates.category = args.category.trim();
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.description !== undefined) updates.description = args.description?.trim();

    await ctx.db.patch(args.goalId, updates);
    return { success: true };
  },
});

export const deleteGoal = mutation({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== userId) {
      throw new Error("Goal not found or access denied");
    }

    await ctx.db.delete(args.goalId);
    return { success: true };
  },
});

export const getGoalStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const goals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const activeGoals = goals.filter(g => !g.isCompleted);
    const completedGoals = goals.filter(g => g.isCompleted);
    
    const totalTargetAmount = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalCurrentAmount = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    
    const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
    
    const upcomingDeadlines = activeGoals
      .filter(g => g.deadline)
      .sort((a, b) => (a.deadline || 0) - (b.deadline || 0))
      .slice(0, 3);

    return {
      totalGoals: goals.length,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      overallProgress,
      totalTargetAmount,
      totalCurrentAmount,
      upcomingDeadlines,
    };
  },
});
