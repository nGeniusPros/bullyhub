"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import "@/app/dashboard/dashboard.css";

export default function Navbar() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-6 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="gradient-text font-bold text-2xl">PetPals</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            <Link
              href="/features"
              className="text-base font-medium text-foreground hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="/for-breeders"
              className="text-base font-medium text-foreground hover:text-primary"
            >
              For Breeders
            </Link>
            <Link
              href="/for-owners"
              className="text-base font-medium text-foreground hover:text-primary"
            >
              For Owners
            </Link>
            <Link
              href="/about"
              className="text-base font-medium text-foreground hover:text-primary"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-base font-medium text-foreground hover:text-primary"
            >
              Contact
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
                  <Button className="btn-gradient-3color">Start Your Free Trial</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
