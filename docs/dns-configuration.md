# DNS Configuration for Kennel Websites

This document provides instructions for setting up DNS for kennel websites on the PetPals platform.

## Wildcard Subdomain Configuration

PetPals uses wildcard subdomains to host kennel websites (e.g., `yourkennel.petpals.com`). This requires a specific DNS configuration on the main domain.

### For Netlify Hosting

If you're hosting on Netlify, follow these steps to set up wildcard subdomains:

1. Log in to your Netlify account
2. Go to your site's settings
3. Navigate to the "Domain management" section
4. Add your custom domain (e.g., `petpals.com`)
5. Add a wildcard DNS record:
   - Type: `A`
   - Name: `*`
   - Value: Netlify's load balancer IP (typically `75.2.60.5`)
   - TTL: 3600 (or as recommended by Netlify)

6. Add another wildcard DNS record for IPv6:
   - Type: `AAAA`
   - Name: `*`
   - Value: Netlify's IPv6 address (typically `2600:1f14:1d4:b00:0:0:0:0`)
   - TTL: 3600 (or as recommended by Netlify)

### For Other DNS Providers

If you're using another DNS provider, you'll need to add similar wildcard records:

1. Log in to your DNS provider's control panel
2. Add a wildcard A record:
   - Type: `A`
   - Name: `*`
   - Value: Your server's IP address
   - TTL: 3600 (or as recommended)

3. If you support IPv6, add a wildcard AAAA record:
   - Type: `AAAA`
   - Name: `*`
   - Value: Your server's IPv6 address
   - TTL: 3600 (or as recommended)

## Custom Domain Configuration

If a kennel owner wants to use their own custom domain (e.g., `yourkennel.com`), they need to:

1. Purchase a domain from a domain registrar
2. Configure their domain to point to PetPals:
   - Add an A record pointing to the PetPals server IP
   - Add a CNAME record for `www` pointing to their kennel subdomain (e.g., `yourkennel.petpals.com`)

3. In the PetPals admin panel:
   - Enable "Use custom domain" in the website publishing settings
   - Enter their custom domain
   - Save and republish the website

## Verifying DNS Configuration

To verify that DNS is configured correctly:

1. Use `dig` or `nslookup` to check the DNS records:
   ```
   dig yourkennel.petpals.com
   ```

2. Check that the IP address returned matches the expected server IP

3. Test the website by visiting the subdomain in a browser

## Troubleshooting

If the subdomain is not working:

1. Check that the wildcard DNS record is correctly configured
2. Verify that the middleware is correctly extracting the subdomain
3. Ensure the kennel website is published in the database
4. Check server logs for any errors related to subdomain handling

For custom domains:

1. Verify that the A and CNAME records are correctly configured
2. Check that the custom domain is correctly entered in the kennel website settings
3. Allow time for DNS propagation (up to 48 hours in some cases)

## Support

For assistance with DNS configuration, contact the PetPals support team at support@petpals.com.
