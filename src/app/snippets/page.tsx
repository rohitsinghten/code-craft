"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import SnippetsPageSkeleton from "./_components/SnippetsPageSkeleton";
import NavigationHeader from "@/components/NavigationHeader";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, BookOpen, Code, Grid, Layers, Search, ShieldCheck, Tag, X } from "lucide-react";
import SnippetCard from "./_components/SnippetCard";
import { Snippet } from "@/types";

type SortOption = "newest" | "oldest" | "title" | "language";

const LOW_QUALITY_TITLES = new Set(["test", "demo", "sample", "untitled", "fds", "asdf", ";l"]);

function isQualitySnippet(snippet: Snippet) {
  const title = snippet.title.trim().toLowerCase();
  const hasReadableWord = /[a-z0-9]{3,}/i.test(title);
  const isMostlyPunctuation = /^[^a-z0-9]+$/i.test(title);

  return (
    snippet.code.trim().length >= 12 &&
    title.length >= 3 &&
    hasReadableWord &&
    !isMostlyPunctuation &&
    !LOW_QUALITY_TITLES.has(title)
  );
}

function sortSnippets(snippets: Snippet[], sortBy: SortOption) {
  return [...snippets].sort((a, b) => {
    if (sortBy === "oldest") return a._creationTime - b._creationTime;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "language") return a.language.localeCompare(b.language);

    return b._creationTime - a._creationTime;
  });
}

function SnippetsPage() {
  const snippets = useQuery(api.snippets.getSnippets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showUnreviewed, setShowUnreviewed] = useState(false);

  // loading state
  if (snippets === undefined) {
    return (
      <div className="min-h-screen">
        <NavigationHeader />
        <SnippetsPageSkeleton />
      </div>
    );
  }

  const reviewedSnippets = snippets.filter(isQualitySnippet);
  const visibleSnippetPool = showUnreviewed ? snippets : reviewedSnippets;
  const hiddenLowQualityCount = snippets.length - reviewedSnippets.length;
  const languageCounts = visibleSnippetPool.reduce(
    (counts, snippet) => {
      counts[snippet.language] = (counts[snippet.language] ?? 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );
  const languages = Object.entries(languageCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([language]) => language);
  const popularLanguages = languages.slice(0, 6);

  const filteredSnippets = visibleSnippetPool.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage = !selectedLanguage || snippet.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });
  const sortedSnippets = sortSnippets(filteredSnippets, sortBy);
  const hasActiveFilters = Boolean(searchQuery || selectedLanguage);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r
             from-blue-500/10 to-purple-500/10 text-sm text-gray-400 mb-6"
          >
            <BookOpen className="w-4 h-4" />
            Community Code Library
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-100 mb-6"
          >
            Discover & Share Code Snippets
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 mb-8"
          >
            Explore a curated collection of code snippets from the community
          </motion.p>
        </div>

        {/* Filters Section */}
        <div className="relative max-w-5xl mx-auto mb-12 space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#313244] bg-[#1e1e2e]/70 p-4">
              <p className="text-xs text-gray-500">Reviewed snippets</p>
              <p className="mt-1 text-2xl font-semibold text-white">{reviewedSnippets.length}</p>
            </div>
            <div className="rounded-xl border border-[#313244] bg-[#1e1e2e]/70 p-4">
              <p className="text-xs text-gray-500">Languages</p>
              <p className="mt-1 text-2xl font-semibold text-white">{languages.length}</p>
            </div>
            <div className="rounded-xl border border-[#313244] bg-[#1e1e2e]/70 p-4">
              <p className="text-xs text-gray-500">Needs review</p>
              <p className="mt-1 text-2xl font-semibold text-white">{hiddenLowQualityCount}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100/80 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <p>
                Showing reviewed snippets first: clear title, useful code, no placeholder test names.
              </p>
            </div>
            {hiddenLowQualityCount > 0 && (
              <button
                type="button"
                onClick={() => setShowUnreviewed((value) => !value)}
                className="shrink-0 rounded-lg border border-emerald-400/30 px-3 py-1.5 text-xs font-medium text-emerald-100 transition-colors hover:bg-emerald-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                {showUnreviewed ? "Hide unreviewed" : `Show ${hiddenLowQualityCount} unreviewed`}
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search snippets by title, language, or author..."
                className="w-full pl-12 pr-4 py-4 bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                  rounded-xl border border-[#313244] hover:border-[#414155] transition-all duration-200
                  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Languages:</span>
            </div>

            {popularLanguages.map((lang) => (
              <button
                key={lang}
                type="button"
                aria-pressed={selectedLanguage === lang}
                aria-label={`Filter by ${lang}, ${languageCounts[lang]} snippets`}
                onClick={() => setSelectedLanguage(lang === selectedLanguage ? null : lang)}
                className={`
                    group relative px-3 py-1.5 rounded-lg transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70
                    ${
                      selectedLanguage === lang
                        ? "text-blue-400 bg-blue-500/10 ring-2 ring-blue-500/50"
                        : "text-gray-400 hover:text-gray-300 bg-[#1e1e2e] hover:bg-[#262637] ring-1 ring-gray-800"
                    }
                  `}
              >
                <div className="flex items-center gap-2">
                  <img src={`/${lang}.png`} alt={lang} className="w-4 h-4 object-contain" />
                  <span className="text-sm">{lang}</span>
                  <span className="rounded-full bg-black/20 px-1.5 py-0.5 text-[10px] text-gray-400">
                    {languageCounts[lang]}
                  </span>
                </div>
              </button>
            ))}

            {selectedLanguage && (
              <button
                type="button"
                aria-label="Clear language filter"
                onClick={() => setSelectedLanguage(null)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 rounded"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}

            <div className="ml-auto flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-500">
                {sortedSnippets.length} snippets found
              </span>

              <label className="flex items-center gap-2 rounded-lg bg-[#1e1e2e] px-3 py-2 ring-1 ring-gray-800">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                <span className="sr-only">Sort snippets</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  className="bg-transparent text-sm text-gray-300 outline-none"
                  aria-label="Sort snippets"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="title">Title A-Z</option>
                  <option value="language">Language A-Z</option>
                </select>
              </label>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
                <button
                  type="button"
                  aria-label="Show snippets as grid"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-md transition-all ${
                    view === "grid"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-gray-300 hover:bg-[#262637]"
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Show snippets as list"
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                  className={`p-2 rounded-md transition-all ${
                    view === "list"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-gray-300 hover:bg-[#262637]"
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70`}
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {sortedSnippets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-md mx-auto p-8 rounded-2xl overflow-hidden border border-[#313244] bg-[#12121a]"
          >
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br 
                from-blue-500/10 to-purple-500/10 ring-1 ring-white/10 mb-6"
              >
                <Code className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">No snippets found</h3>
              <p className="text-gray-400 mb-6">
                {hasActiveFilters
                  ? "Try a different search, clear the language filter, or include unreviewed snippets."
                  : showUnreviewed
                    ? "Be the first to share a useful code snippet with the community."
                    : "No reviewed snippets are ready yet. Include unreviewed snippets to inspect drafts."}
              </p>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedLanguage(null);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#262637] text-gray-300 hover:text-white rounded-lg 
                    transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              ) : (
                hiddenLowQualityCount > 0 &&
                !showUnreviewed && (
                  <button
                    type="button"
                    onClick={() => setShowUnreviewed(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#262637] text-gray-300 hover:text-white rounded-lg
                    transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                  >
                    Show unreviewed snippets
                  </button>
                )
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className={`grid gap-6 ${
              view === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 max-w-3xl mx-auto"
            }`}
            layout
          >
            <AnimatePresence mode="popLayout">
              {sortedSnippets.map((snippet) => (
                <SnippetCard key={snippet._id} snippet={snippet} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
export default SnippetsPage;
