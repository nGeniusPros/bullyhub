import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                About Bully Hub
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our mission is to revolutionize dog breeding through genetic science and technology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Our Story</h2>
              <p className="text-muted-foreground md:text-lg">
                Bully Hub was founded by a team of passionate dog breeders and technology experts who recognized the need for better tools in the breeding community.
              </p>
              <p className="text-muted-foreground md:text-lg">
                After years of breeding American Bullies and struggling with fragmented tools for genetic analysis, stud management, and breeding program planning, we decided to create a comprehensive solution that would bring all these essential functions together.
              </p>
              <p className="text-muted-foreground md:text-lg">
                Our platform is built on the belief that responsible breeding starts with understanding genetics and making informed decisions based on data, not just appearance.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Our Values</h3>
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
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold">Ethical Breeding</h4>
                      <p className="text-sm text-muted-foreground">
                        We promote responsible breeding practices that prioritize health, temperament, and genetic diversity.
                      </p>
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
                        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold">Dog Welfare</h4>
                      <p className="text-sm text-muted-foreground">
                        We believe in breeding for health and quality of life, not just appearance or profit.
                      </p>
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
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold">Education</h4>
                      <p className="text-sm text-muted-foreground">
                        We're committed to educating breeders and pet owners about genetics and responsible breeding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">Our Team</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Meet the passionate people behind Bully Hub
              </p>
            </div>
          </div>
          <div className="grid gap-8 mt-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-muted-foreground/20 mb-4"></div>
              <h3 className="text-xl font-bold">Michael Bady</h3>
              <p className="text-primary">Founder & CEO</p>
              <p className="text-sm text-muted-foreground mt-2">
                American Bully breeder with 10+ years of experience and a passion for genetics.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-muted-foreground/20 mb-4"></div>
              <h3 className="text-xl font-bold">Sarah Johnson</h3>
              <p className="text-primary">Chief Genetics Officer</p>
              <p className="text-sm text-muted-foreground mt-2">
                Canine geneticist with a Ph.D. in Veterinary Genetics and a focus on coat color inheritance.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-muted-foreground/20 mb-4"></div>
              <h3 className="text-xl font-bold">David Chen</h3>
              <p className="text-primary">CTO</p>
              <p className="text-sm text-muted-foreground mt-2">
                Software engineer with expertise in AI and machine learning applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="rounded-lg border bg-card p-8 shadow-sm order-2 md:order-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Our Impact</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md bg-muted p-4 text-center">
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <p className="text-sm text-muted-foreground">Breeders Using Our Platform</p>
                  </div>
                  <div className="rounded-md bg-muted p-4 text-center">
                    <div className="text-3xl font-bold text-primary">5,000+</div>
                    <p className="text-sm text-muted-foreground">Dogs Registered</p>
                  </div>
                  <div className="rounded-md bg-muted p-4 text-center">
                    <div className="text-3xl font-bold text-primary">2,500+</div>
                    <p className="text-sm text-muted-foreground">DNA Tests Analyzed</p>
                  </div>
                  <div className="rounded-md bg-muted p-4 text-center">
                    <div className="text-3xl font-bold text-primary">300+</div>
                    <p className="text-sm text-muted-foreground">Breeding Programs</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 order-1 md:order-2">
              <h2 className="text-3xl font-bold tracking-tighter">Our Mission</h2>
              <p className="text-muted-foreground md:text-lg">
                At Bully Hub, our mission is to revolutionize dog breeding through the power of genetic science and technology.
              </p>
              <p className="text-muted-foreground md:text-lg">
                We aim to provide breeders with the tools they need to make informed decisions that improve the health, temperament, and quality of dogs while preserving the unique characteristics of each breed.
              </p>
              <p className="text-muted-foreground md:text-lg">
                By making genetic information accessible and actionable, we're helping create a future where all dogs are bred responsibly, with a focus on health and genetic diversity.
              </p>
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
                Join the Bully Hub Community
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Be part of the revolution in dog breeding and genetics
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg">Sign Up Now</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
