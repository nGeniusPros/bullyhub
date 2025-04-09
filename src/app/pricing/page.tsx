import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

export default function PricingPage() {
  return (
    <MainLayout>
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Simple, Transparent Pricing
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose the plan that's right for you and your breeding program
              </p>
            </div>
          </div>
          <div className="grid gap-8 mt-16 md:grid-cols-3">
            {/* Basic Plan */}
            <div className="flex flex-col rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <h3 className="text-2xl font-bold">Pet Owner</h3>
                <div className="mt-4 text-4xl font-bold">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <p className="mt-2 text-muted-foreground">Perfect for pet owners looking to understand their dog's genetics</p>
              </div>
              <div className="flex flex-col p-6 space-y-4 border-t">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Up to 3 dog profiles</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>DNA test result storage</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Basic genetic visualization</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Health marker analysis</span>
                  </li>
                </ul>
                <Link href="/register?plan=pet-owner" className="w-full">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="flex flex-col rounded-lg border bg-card shadow-sm relative">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
                Popular
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold">Breeder</h3>
                <div className="mt-4 text-4xl font-bold">$29.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <p className="mt-2 text-muted-foreground">For serious breeders managing multiple dogs and breeding programs</p>
              </div>
              <div className="flex flex-col p-6 space-y-4 border-t">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Up to 15 dog profiles</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Unlimited DNA test storage</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Stud service management</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>AI stud receptionist</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Up to 3 breeding programs</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Color prediction engine</span>
                  </li>
                </ul>
                <Link href="/register?plan=breeder" className="w-full">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="flex flex-col rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <h3 className="text-2xl font-bold">Professional</h3>
                <div className="mt-4 text-4xl font-bold">$79.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <p className="mt-2 text-muted-foreground">For professional kennels and breeding operations</p>
              </div>
              <div className="flex flex-col p-6 space-y-4 border-t">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Unlimited dog profiles</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>All Breeder plan features</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Unlimited breeding programs</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Advanced line development simulator</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Kennel branding suite</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link href="/register?plan=professional" className="w-full">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Find answers to common questions about Bully Hub
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl mt-12 space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-bold mb-2">Can I switch plans later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-bold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Yes, all plans come with a 14-day free trial so you can explore the features before committing.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and Apple Pay.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-bold mb-2">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Join Bully Hub today and transform your breeding program with our powerful genetic tools.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg">Sign Up Now</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
