import MainLayout from '@/components/layout/MainLayout';

export default function WebsiteTemplatesPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted text-center space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
          Kennel Website Template System
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
          Launch a professional, customizable website for your kennel business with seamless integration into The Bully Hub App.
        </p>
      </section>

      {/* Executive Summary */}
      <section className="py-16 md:py-24 container space-y-6">
        <h2 className="text-3xl font-bold tracking-tighter">Executive Summary</h2>
        <p>
          The Kennel Website Template System provides Bully Hub users with professionally designed, customizable website templates tailored for dog kennels and breeding businesses. Breeders can quickly deploy websites without technical expertise, fully integrated with app features like stud marketing, genetic data, and reproductive services.
        </p>
      </section>

      {/* Template Selection Grid */}
      <section className="py-20 md:py-28 bg-muted">
        <div className="container px-4 md:px-6 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Choose Your Kennel Website Template</h2>
          <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">
            Select a professionally designed template to customize for your kennel business.
          </p>
        </div>
        <div className="container px-4 md:px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <a href="/kennel-sites/templates/professional-breeder" className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-2">Professional Breeder</h3>
            <p>Ideal for established kennels with extensive breeding programs.</p>
          </a>
          <a href="/kennel-sites/templates/show-kennel" className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-2">Show Kennel</h3>
            <p>Perfect for competition-focused kennels with champion dogs.</p>
          </a>
          <a href="/kennel-sites/templates/family-breeder" className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-2">Family Breeder</h3>
            <p>Great for smaller, home-based kennels focused on companion animals.</p>
          </a>
          <a href="/kennel-sites/templates/multi-service-kennel" className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-2">Multi-Service Kennel</h3>
            <p>For kennels offering breeding, training, boarding, and more.</p>
          </a>
        </div>
      </section>
    </MainLayout>
  );
}
