import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Blocks, Code2, Sparkles } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import HeaderProfileBtn from "./HeaderProfileBtn";

async function Header() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const user = await currentUser();

  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });

  return (
    <div className="relative z-10">
      <div
        className="flex flex-col gap-3 bg-[#0a0a0f]/80 backdrop-blur-xl p-3 sm:p-4 lg:p-6 mb-4 rounded-lg"
      >
        <div className="flex w-full min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 lg:gap-8">
            <Link
              href="/"
              className="group relative flex min-w-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
            >
              {/* Logo hover effect */}

              <div
                className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0
                group-hover:opacity-100 transition-all duration-500 blur-xl"
              />

              {/* Logo */}
              <div
                className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1
              ring-white/10 group-hover:ring-white/20 transition-all"
              >
                <Blocks className="size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
              </div>

              <div className="flex flex-col">
                <span className="block text-lg font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                  CodeCraft
                </span>
                <span className="hidden text-xs text-blue-400/60 font-medium sm:block">
                  Interactive Code Editor
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              <Link
                href="/snippets"
                aria-label="Open snippets"
                className="relative group flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50
                hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10
                to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
                <span
                  className="hidden text-sm font-medium relative z-10 group-hover:text-white
                 transition-colors sm:inline"
                >
                  Snippets
                </span>
              </Link>
            </nav>
          </div>

          <div className="shrink-0 lg:hidden">
            <HeaderProfileBtn />
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
          <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            <ThemeSelector />
            <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
          </div>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {!convexUser?.isPro && (
              <Link
                href="/pricing"
                className="flex h-10 shrink-0 items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10
                to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20
                transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
              >
                <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
                <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                  Pro
                </span>
              </Link>
            )}

            <RunButton />

            <div className="hidden shrink-0 pl-3 border-l border-gray-800 lg:block">
              <HeaderProfileBtn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Header;
