import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  transactions: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    description: v.string(),
    category: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    date: v.number(),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "date"])
    .index("by_user_and_category", ["userId", "category"])
    .index("by_user_and_type", ["userId", "type"]),

  budgets: defineTable({
    userId: v.id("users"),
    category: v.string(),
    limit: v.number(),
    period: v.union(v.literal("weekly"), v.literal("monthly"), v.literal("yearly")),
    startDate: v.number(),
    isActive: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"])
    .index("by_user_category", ["userId", "category"]),

  goals: defineTable({
    userId: v.id("users"),
    title: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    deadline: v.optional(v.number()),
    category: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    isCompleted: v.boolean(),
    description: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isCompleted"])
    .index("by_user_priority", ["userId", "priority"]),

  accounts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    type: v.union(v.literal("checking"), v.literal("savings"), v.literal("credit"), v.literal("investment")),
    balance: v.number(),
    currency: v.string(),
    isActive: v.boolean(),
    institution: v.optional(v.string()),
    accountNumber: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"])
    .index("by_user_type", ["userId", "type"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
