import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-[#E8F4FC]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              About PetPals Dog Hub
            </h1>
            <p className="text-xl text-muted-foreground">
              Our mission is to revolutionize dog care through technology, community, and expertise
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/images/about-team.jpg"
                alt="Pet Pals Dog Hub Team"
                width={500}
                height={350}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-foreground">Our Story</h2>
              <p className="text-muted-foreground">
                PetPals Dog Hub was founded in 2023 by a team of passionate dog breeders, veterinarians, and technology experts who saw a need for better tools to manage dog health and breeding programs.
              </p>
              <p className="text-muted-foreground">
                What started as a simple health tracking app has evolved into a comprehensive platform that connects breeders, pet owners, and veterinarians in a collaborative ecosystem focused on improving dog health and wellbeing.
              </p>
              <p className="text-muted-foreground">
                Today, PetPals Dog Hub is used by thousands of breeders and pet owners across the country, helping to raise healthier dogs and create stronger connections between everyone involved in a dog's life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 md:py-20 bg-[#E8F4FC]">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground">Our Mission</h2>
            <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
              We're on a mission to transform dog care through technology, community, and expertise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#29ABE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-foreground text-center mb-4">Better Health Outcomes</h3>
              <p className="text-muted-foreground text-center">
                We believe that better information leads to better health decisions. Our platform provides the tools and insights needed to improve dog health outcomes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#29ABE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-foreground text-center mb-4">Connected Community</h3>
              <p className="text-muted-foreground text-center">
                We're building bridges between breeders, pet owners, and veterinarians to create a collaborative approach to dog care.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#29ABE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-foreground text-center mb-4">Ethical Breeding</h3>
              <p className="text-muted-foreground text-center">
                We promote responsible breeding practices that prioritize health, genetic diversity, and temperament over appearance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
              Our diverse team brings together expertise in veterinary medicine, dog breeding, and technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="mb-4 relative w-48 h-48 mx-auto overflow-hidden rounded-full">
                <Image
                  src="/images/team-member-1.jpg"
                  alt="Dr. Sarah Johnson"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-medium text-foreground">Dr. Sarah Johnson</h3>
              <p className="text-muted-foreground">Co-Founder & Chief Veterinary Officer</p>
              <p className="text-muted-foreground mt-2">
                Veterinarian with 15+ years of experience specializing in canine genetics and health
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 relative w-48 h-48 mx-auto overflow-hidden rounded-full">
                <Image
                  src="/images/team-member-2.jpg"
                  alt="Michael Roberts"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-medium text-foreground">Michael Roberts</h3>
              <p className="text-muted-foreground">Co-Founder & CEO</p>
              <p className="text-muted-foreground mt-2">
                Professional dog breeder with 20+ years of experience and technology enthusiast
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 relative w-48 h-48 mx-auto overflow-hidden rounded-full">
                <Image
                  src="/images/team-member-3.jpg"
                  alt="Jennifer Chen"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-medium text-foreground">Jennifer Chen</h3>
              <p className="text-muted-foreground">CTO</p>
              <p className="text-muted-foreground mt-2">
                AI and software development expert with a passion for applying technology to animal health
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 md:py-20 bg-[#E8F4FC]">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground">Our Impact</h2>
            <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
              Growing every day to improve the lives of dogs and their owners
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-[#29ABE2] mb-2">5,000+</div>
              <p className="text-muted-foreground">Dogs Registered</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-[#29ABE2] mb-2">2,500+</div>
              <p className="text-muted-foreground">Active Breeders</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-[#29ABE2] mb-2">10,000+</div>
              <p className="text-muted-foreground">Pet Owners</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-[#29ABE2] mb-2">98%</div>
              <p className="text-muted-foreground">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="bg-[#E8F4FC] rounded-lg shadow-lg p-8 md:p-12 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Join Our Mission
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Be part of the revolution in dog care and breeding
            </p>
            <Link href="/register">
              <Button size="lg" style={{ backgroundColor: "#FF8C00", color: "white", fontWeight: "bold" }} className="shadow-md hover:scale-105 transition-transform">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
