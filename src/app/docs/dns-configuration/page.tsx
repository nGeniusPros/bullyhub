"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function DnsConfigurationPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/dashboard/settings">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">DNS Configuration for Kennel Websites</h1>
        <p className="text-muted-foreground">
          Learn how to set up custom domains for your kennel website
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Using Your Custom Domain</CardTitle>
            <CardDescription>
              Configure your domain to point to your PetPals kennel website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-medium">Step 1: Purchase a Domain</h3>
            <p>
              If you don't already have a domain, you'll need to purchase one from a domain registrar like:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>GoDaddy</li>
              <li>Namecheap</li>
              <li>Google Domains</li>
              <li>Domain.com</li>
            </ul>

            <h3 className="text-lg font-medium mt-6">Step 2: Configure DNS Records</h3>
            <p>
              Once you have your domain, you'll need to configure DNS records to point to your PetPals kennel website.
              Log in to your domain registrar's control panel and add the following records:
            </p>

            <div className="bg-muted p-4 rounded-md my-4 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Record Type</th>
                    <th className="text-left py-2 px-4">Name/Host</th>
                    <th className="text-left py-2 px-4">Value/Target</th>
                    <th className="text-left py-2 px-4">TTL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">A</td>
                    <td className="py-2 px-4">@</td>
                    <td className="py-2 px-4">75.2.60.5</td>
                    <td className="py-2 px-4">3600</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">CNAME</td>
                    <td className="py-2 px-4">www</td>
                    <td className="py-2 px-4">[your-subdomain].petpals.com</td>
                    <td className="py-2 px-4">3600</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-muted-foreground">
              Note: Replace [your-subdomain] with your actual PetPals subdomain (e.g., yourkennel.petpals.com)
            </p>

            <h3 className="text-lg font-medium mt-6">Step 3: Enter Your Custom Domain in PetPals</h3>
            <p>
              In your PetPals dashboard, go to Settings &gt; Kennel Website &gt; Domain tab, enable "Use custom domain",
              and enter your domain name (e.g., yourkennel.com).
            </p>

            <h3 className="text-lg font-medium mt-6">Step 4: Wait for DNS Propagation</h3>
            <p>
              DNS changes can take up to 48 hours to propagate across the internet. In most cases, it will be much faster,
              but be patient if your domain doesn't work immediately.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
            <CardDescription>
              Common issues and how to resolve them
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-medium">Domain Not Working</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Verify that your DNS records are set up correctly</li>
              <li>Check that you've entered the correct domain in your PetPals settings</li>
              <li>Allow sufficient time for DNS propagation (up to 48 hours)</li>
              <li>Ensure your domain registration is active and not expired</li>
            </ul>

            <h3 className="text-lg font-medium mt-6">SSL Certificate Issues</h3>
            <p>
              PetPals automatically provisions SSL certificates for your custom domain. If you're seeing SSL errors:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Verify that your DNS records are correct</li>
              <li>Allow up to 24 hours for the SSL certificate to be issued</li>
              <li>Ensure you're using https:// in your URL</li>
            </ul>

            <h3 className="text-lg font-medium mt-6">Need Additional Help?</h3>
            <p>
              If you're still having issues with your custom domain, please contact our support team for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
