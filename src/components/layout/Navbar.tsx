"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          Bully Hub
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            <Link
              href="/features"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Features
            </Link>
            <Link
              href="/website-templates"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Website Templates
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              About
            </Link>
            <Link
              href="/database-test"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Database Test
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button onClick={() => signOut()} disabled={isLoading}>
                  {isLoading ? "Signing out..." : "Sign Out"}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
