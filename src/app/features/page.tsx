import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturesPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-[#E8F4FC]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#333333]">
              Powerful Features for Breeders & Pet Owners
            </h1>
            <p className="text-xl text-[#555555]">
              Discover the comprehensive tools and features that make PetPals Dog Hub the ultimate platform for dog care and breeding management.
            </p>
          </div>
        </div>
      </section>

      {/* DNA Integration Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-[#333333]">DNA Integration</h2>
              <p className="text-[#555555]">
                Import and visualize genetic data from major testing providers for comprehensive breeding decisions.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Support for Embark and Animal Genetics test results</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Visual representation of genetic markers</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Health marker analysis and risk assessment</span>
                </li>
              </ul>
            </div>
            <div>
              <Image
                src="/assets/images/features/dna-analysis.png"
                alt="DNA test results visualization"
                width={500}
                height={350}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Stud Receptionist Section */}
      <section className="py-16 md:py-20 bg-[#E8F4FC]">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <Image
                src="/assets/images/features/ai-recommendations.png"
                alt="AI Stud Receptionist interface"
                width={500}
                height={350}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <h2 className="text-3xl font-semibold text-[#333333]">AI Stud Receptionist</h2>
              <p className="text-[#555555]">
                Automated inquiry management and DNA compatibility analysis for stud services.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">24/7 automated responses to stud inquiries</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Genetic compatibility analysis</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Color prediction and health risk assessment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Breeding Program Tools Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-[#333333]">Breeding Program Tools</h2>
              <p className="text-[#555555]">
                Advanced tools for genetic strategy planning, line development, and litter management.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Line development simulator</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Coefficient of Inbreeding (COI) calculator</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Litter management and tracking</span>
                </li>
              </ul>
            </div>
            <div>
              <Image
                src="/assets/images/features/breeding-tools.png"
                alt="Breeding program tools interface"
                width={500}
                height={350}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[#E8F4FC]">
        <div className="container px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">
              Ready to Transform How You Care for Your Dog?
            </h2>
            <p className="text-xl text-[#555555] mb-8">
              Join PetPals Dog Hub today and access powerful tools for health management, breeding, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" style={{ backgroundColor: "#FF8C00", color: "white", fontWeight: "bold" }} className="shadow-md hover:scale-105 transition-transform">
                  Start Your Free Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-[#29ABE2] text-[#29ABE2] hover:bg-[#E8F4FC] hover:scale-105 transition-transform">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
