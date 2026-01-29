import React from "react";
import { ModeToggle } from "../toggle/mode-toggle";
import { Button } from "../ui/button";
import Link from "next/link";
import { Bot } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-background/80">
      <div className="container mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-semibold tracking-tight text-sm">
            VIVA{" "}
            <span className="text-muted-foreground font-normal opacity-50 ml-1">
              v1.0
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <SignedOut>
          <Link href="/sign-in">
            <Button>Sign-in</Button>
          </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
