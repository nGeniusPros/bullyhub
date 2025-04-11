import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-[#E8F4FC]">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-6">
              <div className="flex items-center mb-4">
                <Image src="/icons/paw-tech.svg" alt="Paw print with tech elements" width={40} height={40} className="text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#333333]">
                The Ultimate AI-Powered Platform for Dog Breeders and Pet Owners
              </h1>
              <p className="text-xl text-[#555555]">
                Manage health records, track development, and connect with a community that cares as much about your dog as you do
              </p>
              <div className="pt-6">
                <Link href="/register">
                  <Button size="lg" style={{ backgroundColor: "#FF8C00", color: "white", fontWeight: "bold" }} className="shadow-md hover:scale-105 transition-transform">
                    Start Your Free Trial Today
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:col-span-5">
              <Image
                src="/images/hero-dogs.jpg"
                alt="Breeder with puppies and pet owner with dog"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Agitation Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#333333] mb-6">
              Managing Your Dog's Health and Development Shouldn't Be Complex
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Column 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <Image
                src="/icons/fragmented-docs.svg"
                alt="Document with fragmented pieces"
                width={48}
                height={48}
                className="text-[#FFDA63]"
              />
              <h3 className="text-xl font-medium text-[#333333]">Fragmented Records?</h3>
              <p className="text-[#555555]">
                Are you struggling to keep track of vaccinations, health history, and important documents across multiple systems and paper files?
              </p>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <Image
                src="/icons/dna-chart.svg"
                alt="DNA/genetic chart"
                width={48}
                height={48}
                className="text-[#FFDA63]"
              />
              <h3 className="text-xl font-medium text-[#333333]">Breeding Decisions?</h3>
              <p className="text-[#555555]">
                Do you find it challenging to make informed breeding decisions without comprehensive genetic information and health predictions?
              </p>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <Image
                src="/icons/dog-question.svg"
                alt="Question mark with dog silhouette"
                width={48}
                height={48}
                className="text-[#FFDA63]"
              />
              <h3 className="text-xl font-medium text-[#333333]">Care Knowledge?</h3>
              <p className="text-[#555555]">
                Are you unsure about the best care practices for your specific dog breed and lacking personalized guidance?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution/Benefits Section */}
      <section className="py-16 md:py-20 bg-[#E8F4FC]">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#333333]">
              An Integrated Platform for Everyone in Your Dog's Life
            </h2>
          </div>

          {/* Benefit 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-4 order-2 md:order-1">
              <h3 className="text-2xl font-medium text-[#333333]">Comprehensive Dog Profiles</h3>
              <p className="text-[#555555]">
                Keep universal health records, genetic background, growth tracking, vaccination schedules, nutrition plans, and training milestones all in one secure location, accessible to everyone who cares for your dog.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/images/dog-profile-dashboard.jpg"
                alt="Unified dog profile dashboard"
                width={500}
                height={350}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="">
              <Image
                src="/images/ai-health-monitoring.jpg"
                alt="AI health monitoring interface"
                width={500}
                height={350}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-[#333333]">AI-Powered Health Management</h3>
              <p className="text-[#555555]">
                Leverage our cutting-edge AI to monitor your dog's health with breed-specific alerts, early warning detection, and preventative care recommendations based on your dog's unique profile.
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 order-2 md:order-1">
              <h3 className="text-2xl font-medium text-[#333333]">Breeding Program Tools</h3>
              <p className="text-[#555555]">
                Make informed breeding decisions with genetic health predictions, inbreeding assessments, trait prediction tools, and a seamless system to transfer puppy profiles to new owners.
              </p>
              <div className="pt-4">
                <Link href="/features">
                  <Button variant="outline" className="text-primary border-primary hover:bg-[#E8F4FC] hover:scale-105 transition-transform">
                    Explore Platform Features
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/images/breeding-program-tools.jpg"
                alt="Breeding program tools interface"
                width={500}
                height={350}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#333333]">
              Trusted by Breeders and Pet Owners Alike
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg border border-[#E0E0E0] shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src="/images/testimonial-1.jpg"
                    alt="Sarah M."
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">Sarah M., Professional Breeder</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFDA63" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#555555] italic text-base">
                "PetPals Dog Hub has revolutionized my breeding program. The genetic analysis tools and health tracking have improved my breeding decisions tremendously."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg border border-[#E0E0E0] shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src="/images/testimonial-2.jpg"
                    alt="Michael T."
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">Michael T., Pet Owner</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFDA63" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#555555] italic text-base">
                "As a first-time dog owner, the personalized care recommendations and health alerts have been invaluable. I feel confident I'm giving my dog the best care possible."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg border border-[#E0E0E0] shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src="/images/testimonial-3.jpg"
                    alt="Jennifer L."
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">Jennifer L., Pet Owner</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFDA63" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#555555] italic text-base">
                "The connection between breeder and owner accounts is genius. I can see my dog's complete history and get breed-specific advice directly from their breeder."
              </p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-[#8FBC8F]">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-sm font-medium">Data Security Certified</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-[#8FBC8F]">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span className="text-sm font-medium">Veterinarian Approved</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-[#8FBC8F]">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-medium">Ethical Breeding Advocate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature/Benefit Section */}
      <section className="py-16 md:py-20 bg-[#E8F4FC]">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#333333]">
              Key Platform Features
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#29ABE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                  <path d="M12 11h4" />
                  <path d="M12 16h4" />
                  <path d="M8 11h.01" />
                  <path d="M8 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#333333] text-center mb-4">Health Management System</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">AI-driven health monitoring with breed-specific alerts</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Early warning detection based on logged symptoms</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Preventative care recommendations and reminders</span>
                </li>
              </ul>
              <p className="text-[#555555] mb-6">Keep your dog healthy with intelligent monitoring that prevents issues before they become serious.</p>
              <div className="text-center">
                <Link href="/features/health">
                  <Button style={{ backgroundColor: "#FF8C00", color: "white" }} className="hover:scale-105 transition-transform">
                    Explore Health Tools
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
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
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Breed-specific forums and discussion groups</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Expert Q&A sessions with veterinarians</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Educational content libraries by breed</span>
                </li>
              </ul>
              <p className="text-[#555555] mb-6">Connect with other owners and experts to get the best advice for your specific breed.</p>
              <div className="text-center">
                <Link href="/features/community">
                  <Button style={{ backgroundColor: "#FF8C00", color: "white" }} className="hover:scale-105 transition-transform">
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#29ABE2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#333333] text-center mb-4">AI-Powered Assistance</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Personalized dog care recommendations</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Predictive health analytics for early intervention</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8FBC8F" className="w-5 h-5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#555555]">Smart notification system based on dog life stages</span>
                </li>
              </ul>
              <p className="text-[#555555] mb-6">Receive intelligent guidance tailored to your dog's unique needs at every stage of life.</p>
              <div className="text-center">
                <Link href="/features/ai">
                  <Button style={{ backgroundColor: "#FF8C00", color: "white" }} className="hover:scale-105 transition-transform">
                    See AI in Action
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#333333]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* FAQ 1 */}
            <div className="border-b border-[#E0E0E0] pb-4">
              <h3 className="text-lg font-medium text-[#333333] mb-2">How secure is my dog's health and genetic data?</h3>
              <p className="text-[#555555]">
                We implement HIPAA-inspired security protocols with strong encryption for all sensitive information. You control exactly who has access to your dog's data.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="border-b border-[#E0E0E0] pb-4">
              <h3 className="text-lg font-medium text-[#333333] mb-2">Can I use PetPals if I didn't get my dog from a breeder on the platform?</h3>
              <p className="text-[#555555]">
                Absolutely! PetPals provides standalone value for all pet owners, regardless of where you acquired your dog. You'll still access all health management and community features.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="border-b border-[#E0E0E0] pb-4">
              <h3 className="text-lg font-medium text-[#333333] mb-2">How accurate are the AI health predictions and genetic analyses?</h3>
              <p className="text-[#555555]">
                Our AI system is trained on millions of dog health records and continuously improves with usage. While not a replacement for veterinary care, it has proven highly effective at early issue detection.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="border-b border-[#E0E0E0] pb-4">
              <h3 className="text-lg font-medium text-[#333333] mb-2">How does the connection between breeder and owner accounts work?</h3>
              <p className="text-[#555555]">
                Breeders can transfer puppy profiles directly to new owners while maintaining appropriate access to health records. Both parties control privacy settings and information sharing.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="border-b border-[#E0E0E0] pb-4">
              <h3 className="text-lg font-medium text-[#333333] mb-2">Can veterinarians access my dog's health records on the platform?</h3>
              <p className="text-[#555555]">
                Yes! You can grant temporary or permanent access to veterinarians, trainers, and other care providers through our secure sharing system.
              </p>
            </div>

            {/* FAQ 6 */}
            <div className="border-b border-[#E0E0E0] pb-4">
              <h3 className="text-lg font-medium text-[#333333] mb-2">What does the subscription include and how much does it cost?</h3>
              <p className="text-[#555555]">
                We offer tiered subscriptions for both breeders and pet owners, starting at $9.99/month. All plans include core features with premium options for advanced tools and analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-[#29ABE2] to-[#FFDA63]">
        <div className="container px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/icons/dog-tech.svg"
                alt="Dog with digital elements"
                width={60}
                height={60}
              />
            </div>
            <h2 className="text-3xl font-bold text-[#333333] mb-4">
              Ready to Transform How You Care for Your Dog?
            </h2>
            <p className="text-xl text-[#555555] mb-8">
              Join thousands of breeders and pet owners already using PetPals Dog Hub to provide the best care for their dogs
            </p>
            <Link href="/register">
              <Button size="lg" style={{ backgroundColor: "#FF8C00", color: "white", fontWeight: "bold" }} className="shadow-md hover:scale-105 transition-transform px-8 py-6 text-lg">
                Start Your 30-Day Free Trial
              </Button>
            </Link>
            <div className="mt-4">
              <Link href="/demo" className="text-[#29ABE2] hover:underline">
                or Watch Demo Video
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
