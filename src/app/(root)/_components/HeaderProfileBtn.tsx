"use client";
import LoginButton from "@/components/LoginButton";
import { useUser, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";

function HeaderProfileBtn() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) return <LoginButton />;

  return (
    <div>
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Link
            label="Profile"
            labelIcon={<User className="size-4" />}
            href="/profile"
          />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
}
export default HeaderProfileBtn;
