import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted text-center">
        <div className="container px-4 md:px-6 flex flex-col items-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl">
            Revolutionary DNA-Powered Breeding Management
          </h1>
          <p className="max-w-2xl text-muted-foreground md:text-xl">
            Discover the first app that combines advanced genetic analysis with AI-powered breeding insights. Transform your breeding program with technology that predicts puppy outcomes with unprecedented accuracy.
          </p>
          <em className="max-w-2xl text-lg md:text-xl">
            "The science of breeding meets the power of artificial intelligence."
          </em>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/register">
              <Button size="lg">Sign Up for Early Access</Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg">Learn More</Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <Image src="/cards/illustration-1.png" alt="DNA with dog silhouette" width={200} height={200} />
            <Image src="/cards/illustration-2.png" alt="Breeder with tablet and dogs" width={200} height={200} />
            <Image src="/cards/illustration-3.png" alt="Genetic prediction visualization" width={200} height={200} />
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6 space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            What Makes The Bully Hub Different?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <Image src="/cards/illustration-4.png" alt="DNA Integration" width={80} height={80} className="mx-auto" />
              <h3 className="text-xl font-semibold text-center">DNA Integration</h3>
              <p className="text-muted-foreground text-center">
                Connect directly with Embark and Animal Genetics for scientifically accurate breeding decisions.
              </p>
            </div>
            <div className="space-y-4">
              <Image src="/public/icons/robot.png" alt="AI Stud Receptionist" width={80} height={80} className="mx-auto" />
              <h3 className="text-xl font-semibold text-center">AI Stud Receptionist</h3>
              <p className="text-muted-foreground text-center">
                24/7 automated screening and management of stud service inquiries.
              </p>
            </div>
            <div className="space-y-4">
              <Image src="/public/icons/prediction.png" alt="Color Prediction Engine" width={80} height={80} className="mx-auto" />
              <h3 className="text-xl font-semibold text-center">Color Prediction Engine</h3>
              <p className="text-muted-foreground text-center">
                Visualize potential coat colors and patterns before breeding.
              </p>
            </div>
            <div className="space-y-4">
              <Image src="/public/icons/graph-bar.svg" alt="COI Calculator" width={80} height={80} className="mx-auto" />
              <h3 className="text-xl font-semibold text-center">Coefficient of Inbreeding Calculator</h3>
              <p className="text-muted-foreground text-center">
                Make informed decisions with precise COI calculations.
              </p>
            </div>
            <div className="space-y-4">
              <Image src="/public/icons/calendar.png" alt="Line Development Simulator" width={80} height={80} className="mx-auto" />
              <h3 className="text-xl font-semibold text-center">Line Development Simulator</h3>
              <p className="text-muted-foreground text-center">
                Plan your breeding program generations ahead.
              </p>
            </div>
            <div className="space-y-4">
              <Image src="/public/icons/dna.png" alt="Genetic Marker Analysis" width={80} height={80} className="mx-auto" />
              <h3 className="text-xl font-semibold text-center">Genetic Marker Analysis</h3>
              <p className="text-muted-foreground text-center">
                Analyze loci A, B, D, E, K, S, and M for precise litter predictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container px-4 md:px-6 space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Imagine Your Breeding Program Transformed
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">For Breeders</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Save Time: Automate the screening of stud inquiries and let AI handle initial consultations.</li>
                <li>Increase Revenue: Market your studs with professional DNA-verified profiles that command premium fees.</li>
                <li>Reduce Risks: Identify genetic health concerns before breeding occurs.</li>
                <li>Build Your Legacy: Create and maintain exceptional bloodlines with scientific precision.</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">For Pet Owners</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Understand Your Dog: Access simplified genetic information about your pet's heritage and traits.</li>
                <li>Connect with Breeders: Maintain a lifelong connection with your dog's breeder for support and guidance.</li>
                <li>Learn and Grow: Educational resources tailored to your specific dog's genetic makeup.</li>
                <li>Join the Community: Connect with other owners of genetically similar dogs.</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <blockquote className="p-6 bg-background rounded-lg shadow">
              <p className="italic">
                "The back-massing planner helped me preserve the traits of my foundation stud even years after he was no longer breeding. The puppies from my program now consistently show his exceptional structure and temperament."
              </p>
              <footer className="mt-4 font-semibold">— Professional Breeder</footer>
            </blockquote>
            <blockquote className="p-6 bg-background rounded-lg shadow">
              <p className="italic">
                "As someone new to the bully community, the genetic explanations helped me understand my dog's color inheritance and potential health considerations. The breeder connection feature gives me peace of mind knowing I have ongoing support."
              </p>
              <footer className="mt-4 font-semibold">— Pet Owner</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 md:py-28 text-center">
        <div className="container px-4 md:px-6 flex flex-col items-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Join The Breeding Revolution Today
          </h2>
          <p className="max-w-2xl text-muted-foreground md:text-xl">
            Be among the first to experience The Bully Hub with our exclusive beta program.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground text-left max-w-xl mx-auto">
            <li>Early Access: First 100 breeders receive 3 months FREE premium subscription.</li>
            <li>Launch Special: Register your kennel now and receive a complimentary professional DNA analysis.</li>
          </ul>
          <Link href="/register">
            <Button size="lg" className="mt-6">Sign Up for Early Access</Button>
          </Link>
          <p className="mt-4 text-muted-foreground">
            Your breeding program deserves the best tools. Don't rely on guesswork when science can light the way.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <Image src="/public/icons/appstore.png" alt="App Store" width={150} height={50} />
            <Image src="/public/icons/googleplay.png" alt="Google Play" width={150} height={50} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t text-center text-muted-foreground">
        <p>The Bully Hub — Where Science Meets Breeding Excellence</p>
      </footer>
    </MainLayout>
  );
}
