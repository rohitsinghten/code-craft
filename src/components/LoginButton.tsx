"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { LogIn, User } from "lucide-react";
import Link from "next/link";

function LoginButton() {
  const clerk = useClerk();
  const { isLoaded, isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <Link
        href="/profile"
        className="flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 text-white shadow-lg shadow-blue-500/20
           transition-all duration-200 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
      >
        <User className="w-4 h-4 transition-transform" />
        <span className="text-sm font-medium leading-none">Profile</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={!isLoaded}
      onClick={() => clerk.openSignIn()}
      className="flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 text-white shadow-lg shadow-blue-500/20
           transition-all duration-200 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <LogIn className="w-4 h-4 transition-transform" />
      <span className="text-sm font-medium leading-none">Sign In</span>
    </button>
  );
}
export default LoginButton;
