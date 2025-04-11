import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function ForOwnersPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-[#E8F4FC]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#333333]">
              The Ultimate Platform for Dog Owners
            </h1>
            <p className="text-xl text-[#555555]">
              Manage your dog's health, connect with experts, and join a community of passionate dog owners
            </p>
            <div className="pt-6">
              <Link href="/register">
                <Button size="lg" style={{ backgroundColor: "#FF8C00", color: "white", fontWeight: "bold" }} className="shadow-md hover:scale-105 transition-transform">
                  Start Your Free Trial Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#333333]">
              Features Designed for Dog Owners
            </h2>
            <p className="text-xl text-[#555555] mt-4 max-w-3xl mx-auto">
              Our platform provides everything you need to give your dog the best care possible
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-[#333333]">Complete Health Management</h3>
              <p className="text-[#555555]">
                Keep track of your dog's health records, vaccinations, and medications all in one place.
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Digital vaccination records and reminders</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Medication tracking and dosage reminders</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Secure sharing with veterinarians and care providers</span>
                </li>
              </ul>
            </div>
            <div>
              <Image 
                src="/images/health-management.jpg" 
                alt="Health management dashboard" 
                width={500} 
                height={350}
                className="rounded-lg shadow-lg" 
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <Image 
                src="/images/community-features.jpg" 
                alt="Community features" 
                width={500} 
                height={350}
                className="rounded-lg shadow-lg" 
              />
            </div>
            <div className="space-y-4 order-1 md:order-2">
              <h3 className="text-2xl font-medium text-[#333333]">Community & Expert Support</h3>
              <p className="text-[#555555]">
                Connect with other dog owners and get advice from veterinarians and breed experts.
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Breed-specific discussion forums</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Expert Q&A sessions and educational content</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Direct connection with your dog's breeder</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-[#333333]">AI-Powered Care Recommendations</h3>
              <p className="text-[#555555]">
                Receive personalized care recommendations based on your dog's breed, age, and health profile.
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Breed-specific nutrition and exercise plans</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Early health issue detection and alerts</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Personalized training and behavior guidance</span>
                </li>
              </ul>
            </div>
            <div>
              <Image 
                src="/images/ai-recommendations.jpg" 
                alt="AI care recommendations" 
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
              Give Your Dog the Care They Deserve
            </h2>
            <p className="text-xl text-[#555555] mb-8">
              Join thousands of dog owners already using Pet Pals Dog Hub
            </p>
            <Link href="/register">
              <Button size="lg" style={{ backgroundColor: "#FF8C00", color: "white", fontWeight: "bold" }} className="shadow-md hover:scale-105 transition-transform">
                Start Your 30-Day Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
