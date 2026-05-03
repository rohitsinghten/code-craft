import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

const MAX_CODE_LENGTH = 20_000;
const FREE_LANGUAGES = new Set(["javascript", "python"]);
const SUPPORTED_LANGUAGES = new Set([
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "cpp",
  "csharp",
  "ruby",
  "swift",
]);

function validateExecutionInput(language: string, code: string) {
  if (!SUPPORTED_LANGUAGES.has(language)) {
    throw new ConvexError("Unsupported language");
  }

  if (!code.trim()) {
    throw new ConvexError("Code is required");
  }

  if (code.length > MAX_CODE_LENGTH) {
    throw new ConvexError(`Code must be ${MAX_CODE_LENGTH} characters or less`);
  }
}

export const saveExecution = mutation({
  args: {
    language: v.string(),
    code: v.string(),
    // we could have either one of them, or both at the same time
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    validateExecutionInput(args.language, args.code);

    // check pro status
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user?.isPro && !FREE_LANGUAGES.has(args.language)) {
      throw new ConvexError("Pro subscription required to use this language");
    }

    await ctx.db.insert("codeExecutions", {
      ...args,
      userId: identity.subject,
    });
  },
});

export const getUserExecutions = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    return await ctx.db
      .query("codeExecutions")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getUserStats = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    const executions = await ctx.db
      .query("codeExecutions")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    // Get starred snippets
    const starredSnippets = await ctx.db
      .query("stars")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    // Get all starred snippet details to analyze languages
    const snippetIds = starredSnippets.map((star) => star.snippetId);
    const snippetDetails = await Promise.all(snippetIds.map((id) => ctx.db.get(id)));

    // Calculate most starred language
    const starredLanguages = snippetDetails.filter(Boolean).reduce(
      (acc, curr) => {
        if (curr?.language) {
          acc[curr.language] = (acc[curr.language] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const mostStarredLanguage =
      Object.entries(starredLanguages).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "N/A";

    // Calculate execution stats
    const last24Hours = executions.filter(
      (e) => e._creationTime > Date.now() - 24 * 60 * 60 * 1000
    ).length;

    const languageStats = executions.reduce(
      (acc, curr) => {
        acc[curr.language] = (acc[curr.language] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const languages = Object.keys(languageStats);
    const favoriteLanguage = languages.length
      ? languages.reduce((a, b) => (languageStats[a] > languageStats[b] ? a : b))
      : "N/A";

    return {
      totalExecutions: executions.length,
      languagesCount: languages.length,
      languages: languages,
      last24Hours,
      favoriteLanguage,
      languageStats,
      mostStarredLanguage,
    };
  },
});

export const checkAndIncrementRateLimit = mutation({
  args: {
    key: v.string(),
    maxRequests: v.number(),
    windowMs: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const rateLimit = await ctx.db
      .query("executionRateLimits")
      .withIndex("by_key")
      .filter((q) => q.eq(q.field("key"), args.key))
      .first();

    if (!rateLimit || now - rateLimit.windowStart >= args.windowMs) {
      if (rateLimit) {
        await ctx.db.patch(rateLimit._id, { windowStart: now, count: 1 });
      } else {
        await ctx.db.insert("executionRateLimits", {
          key: args.key,
          windowStart: now,
          count: 1,
        });
      }

      return { allowed: true, remaining: args.maxRequests - 1 };
    }

    if (rateLimit.count >= args.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: args.windowMs - (now - rateLimit.windowStart),
      };
    }

    await ctx.db.patch(rateLimit._id, { count: rateLimit.count + 1 });

    return {
      allowed: true,
      remaining: args.maxRequests - rateLimit.count - 1,
    };
  },
});
