import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function DemoPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-[#E8F4FC]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#333333]">
              See Pet Pals Dog Hub in Action
            </h1>
            <p className="text-xl text-[#555555]">
              Watch our demo video to see how our platform can transform the way you care for your dog
            </p>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-[#F8FBFD] rounded-lg flex items-center justify-center mb-12">
              <div className="text-center p-8">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#29ABE2" className="w-16 h-16 mx-auto mb-4">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
                </svg>
                <p className="text-[#555555]">Demo video placeholder - Click to play</p>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-[#333333] mb-6">
                Ready to Experience It Yourself?
              </h2>
              <p className="text-xl text-[#555555] mb-8">
                Start your free 30-day trial today and discover the full potential of Pet Pals Dog Hub
              </p>
              <Link href="/register">
                <Button size="lg" style={{ backgroundColor: "#FF8C00", color: "white", fontWeight: "bold" }} className="shadow-md hover:scale-105 transition-transform">
                  Start Your Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 md:py-20 bg-[#E8F4FC]">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#333333]">
              Key Features Highlighted in the Demo
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#29ABE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#333333] text-center mb-4">Health Records Management</h3>
              <p className="text-[#555555] text-center">
                See how easy it is to track vaccinations, medications, and health history
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#29ABE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#333333] text-center mb-4">AI Care Recommendations</h3>
              <p className="text-[#555555] text-center">
                Discover how our AI provides personalized care guidance for your dog
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
              <h3 className="text-xl font-medium text-[#333333] text-center mb-4">Community Features</h3>
              <p className="text-[#555555] text-center">
                Learn how to connect with other dog owners and access expert advice
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Personal Demo */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="bg-[#F8FBFD] rounded-lg p-8 md:p-12 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-[#333333] mb-4">
              Want a Personalized Demo?
            </h2>
            <p className="text-xl text-[#555555] mb-8">
              Schedule a one-on-one demo with our team to see how Pet Pals Dog Hub can be tailored to your specific needs
            </p>
            <Link href="/contact">
              <Button size="lg" style={{ backgroundColor: "#29ABE2", color: "white", fontWeight: "bold" }} className="shadow-md hover:scale-105 transition-transform">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
