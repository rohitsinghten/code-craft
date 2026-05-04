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
    <header className="relative z-10 mb-4">
      <div
        className="rounded-2xl border border-white/[0.07] bg-[#080b14]/90 px-4 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-5 lg:px-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center justify-between gap-3 lg:justify-start">
            <Link
              href="/"
              className="group relative flex min-w-0 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
            >
              {/* Logo hover effect */}

              <div
                className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0
                group-hover:opacity-100 transition-all duration-500 blur-xl"
              />

              {/* Logo */}
              <div
                className="relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-[#1d2136] to-[#0c101c] ring-1
              ring-white/10 group-hover:ring-white/20 transition-all"
              >
                <Blocks className="size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
              </div>

              <div className="flex flex-col">
                <span className="block text-xl font-semibold leading-6 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                  CodeCraft
                </span>
                <span className="hidden text-xs font-medium leading-5 text-blue-300/55 sm:block">
                  Interactive Code Editor
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden items-center sm:flex">
              <Link
                href="/snippets"
                aria-label="Open snippets"
                className="relative group flex h-11 items-center gap-2 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-gray-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
                transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10
                to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <Code2 className="relative z-10 size-4 group-hover:rotate-3 transition-transform" />
                <span
                  className="relative z-10 text-sm font-medium leading-none group-hover:text-white
                 transition-colors"
                >
                  Snippets
                </span>
              </Link>
            </nav>

            <div className="shrink-0 lg:hidden">
              <HeaderProfileBtn />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:shrink-0 lg:justify-end">
            <nav className="flex items-center sm:hidden">
              <Link
                href="/snippets"
                aria-label="Open snippets"
                className="relative group flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-gray-300
                transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
              >
                <Code2 className="relative z-10 size-4" />
                <span className="relative z-10 text-sm font-medium">Snippets</span>
              </Link>
            </nav>

            <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
              <ThemeSelector />
              <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
            </div>

            <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
              {!convexUser?.isPro && (
                <Link
                  href="/pricing"
                  className="flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-amber-400/20 px-3 sm:px-4 text-amber-300/90 bg-gradient-to-r from-amber-500/10
                to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20
                transition-all duration-300 hover:border-amber-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
                >
                  <Sparkles className="size-4" />
                  <span className="text-sm font-medium leading-none">Pro</span>
                </Link>
              )}

              <RunButton />

              <div className="hidden h-11 shrink-0 items-center border-l border-white/10 pl-3 lg:flex">
                <HeaderProfileBtn />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
