import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 md:items-start md:gap-2">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            Bully Hub
          </Link>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Bully Hub. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4 md:gap-6">
          <Link href="/terms" className="text-sm font-medium hover:underline underline-offset-4">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm font-medium hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
