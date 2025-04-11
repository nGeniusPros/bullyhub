import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 bg-[#1A5276] text-white">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - Company */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-lg font-bold">
              PetPals Dog Hub
            </Link>
            <p className="text-sm">AI-Powered Platform for Breeders and Pet Owners</p>
            <p className="text-sm">1234 Tech Avenue, Riverside, CA 92501</p>
            <p className="text-sm">(951) 555-1234</p>
            <p className="text-sm">info@petpalsdoghub.com</p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Column 2 - Features */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold">Platform Features</h3>
            <Link href="#" className="text-sm hover:underline">Health Management</Link>
            <Link href="#" className="text-sm hover:underline">Breeding Tools</Link>
            <Link href="#" className="text-sm hover:underline">Community</Link>
            <Link href="#" className="text-sm hover:underline">AI Assistance</Link>
            <Link href="#" className="text-sm hover:underline">Dog Profiles</Link>
          </div>

          {/* Column 3 - About */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold">About Us</h3>
            <Link href="#" className="text-sm hover:underline">Our Story</Link>
            <Link href="#" className="text-sm hover:underline">Meet The Team</Link>
            <Link href="#" className="text-sm hover:underline">Careers</Link>
            <Link href="#" className="text-sm hover:underline">Blog</Link>
            <Link href="#" className="text-sm hover:underline">Press</Link>
          </div>

          {/* Column 4 - Legal */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold">Legal</h3>
            <Link href="/terms" className="text-sm hover:underline">Terms of Service</Link>
            <Link href="/privacy" className="text-sm hover:underline">Privacy Policy</Link>
            <Link href="#" className="text-sm hover:underline">Data Security</Link>
            <Link href="#" className="text-sm hover:underline">Cookie Policy</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm">
          &copy; {new Date().getFullYear()} PetPals Dog Hub. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
