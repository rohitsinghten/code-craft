"use client";

import { useClerk } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

function LoginButton() {
  const clerk = useClerk();

  return (
    <button
      type="button"
      onClick={() => clerk.openSignIn()}
      className="flex h-11 shrink-0 items-center gap-2 whitespace-nowrap px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg
           transition-all duration-200 font-medium shadow-lg shadow-blue-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
    >
      <LogIn className="w-4 h-4 transition-transform" />
      <span>Sign In</span>
    </button>
  );
}
export default LoginButton;
