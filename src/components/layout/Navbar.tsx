"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <nav className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-6 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary font-bold text-2xl">PetPals Dog Hub</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            <Link
              href="/features"
              className="text-base font-medium hover:underline underline-offset-4"
            >
              Features
            </Link>
            <Link
              href="/for-breeders"
              className="text-base font-medium hover:underline underline-offset-4"
            >
              For Breeders
            </Link>
            <Link
              href="/for-owners"
              className="text-base font-medium hover:underline underline-offset-4"
            >
              For Owners
            </Link>
            <Link
              href="/about"
              className="text-base font-medium hover:underline underline-offset-4"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-base font-medium hover:underline underline-offset-4"
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
                  <Button style={{ backgroundColor: "#FF8C00" }}>Start Your Free Trial</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
