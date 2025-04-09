import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Powerful Features for Breeders & Pet Owners
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover the comprehensive tools and features that make Bully Hub the ultimate platform for dog breeding and genetic management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DNA Integration Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 p-3">
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
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter">DNA Integration</h2>
              <p className="text-muted-foreground md:text-lg">
                Import and visualize genetic data from major testing providers for comprehensive breeding decisions.
              </p>
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
                    className="mr-2 h-5 w-5 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Support for Embark and Animal Genetics test results
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
                    className="mr-2 h-5 w-5 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Visual representation of genetic markers
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
                    className="mr-2 h-5 w-5 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Health marker analysis and risk assessment
                </li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">DNA Test Results</h3>
                  <p className="text-muted-foreground">Sample visualization of genetic markers</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">A Locus</span>
                      <span className="text-primary">at/at</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Tan points (homozygous)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">B Locus</span>
                      <span className="text-primary">B/b</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: '50%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Carrier for chocolate/liver</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">D Locus</span>
                      <span className="text-primary">d/d</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Blue/dilute (homozygous)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Stud Receptionist Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="rounded-lg border bg-card p-8 shadow-sm order-2 md:order-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">AI Stud Receptionist</h3>
                  <p className="text-muted-foreground">Sample conversation</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
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
                        className="h-4 w-4 text-primary"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-sm">
                      I'm interested in using your stud for my female. What information do you need?
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
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
                        className="h-4 w-4 text-primary"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      </svg>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-3 text-sm">
                      Thank you for your interest! To evaluate compatibility, I'll need:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Your female's DNA test results</li>
                        <li>Photos of your female</li>
                        <li>Registration information</li>
                      </ul>
                      Would you like to upload these now?
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 order-1 md:order-2">
              <div className="inline-block rounded-lg bg-primary/10 p-3">
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
                  className="h-6 w-6 text-primary"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter">AI Stud Receptionist</h2>
              <p className="text-muted-foreground md:text-lg">
                Automated inquiry management and DNA compatibility analysis for stud services.
              </p>
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
                    className="mr-2 h-5 w-5 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  24/7 automated responses to stud inquiries
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
                    className="mr-2 h-5 w-5 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Genetic compatibility analysis
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
                    className="mr-2 h-5 w-5 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Color prediction and health risk assessment
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Breeding Program Tools Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 p-3">
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
                  className="h-6 w-6 text-primary"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter">Breeding Program Tools</h2>
              <p className="text-muted-foreground md:text-lg">
                Advanced tools for genetic strategy planning, line development, and litter management.
              </p>
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
                    className="mr-2 h-5 w-5 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Line development simulator
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
                    className="mr-2 h-5 w-5 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Coefficient of Inbreeding (COI) calculator
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
                    className="mr-2 h-5 w-5 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Litter management and tracking
                </li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Coefficient of Inbreeding</h3>
                  <p className="text-muted-foreground">Sample COI calculation</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>COI (5 generations)</span>
                    <span className="font-bold">8.2%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '16.4%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>Moderate</span>
                    <span>High</span>
                  </div>
                  <div className="rounded-md bg-muted p-4 text-sm">
                    <p className="font-medium mb-2">Common Ancestors:</p>
                    <ul className="space-y-1">
                      <li>Champion Blue Max (3-4 linebreeding): 4.7% contribution</li>
                      <li>Grand Champion Rocky (4-5 linebreeding): 2.1% contribution</li>
                      <li>Other ancestors: 1.4% contribution</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Transform Your Breeding Program?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Join Bully Hub today and access powerful tools for genetic analysis, stud management, and more.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg">Sign Up Now</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">View Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
