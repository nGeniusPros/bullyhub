import React from "react";

/**
 * FamilyBreederTemplate
 * 
 * Landing page template for smaller, home-based kennels focused on companion animals.
 * 
 * Integration Points:
 * - All sections marked for dynamic data integration.
 * - Replace sample data with real data from the PetPals Dog Hub app as integration progresses.
 * 
 * Color Scheme:
 * - Accepts a colorScheme prop: "friendly" | "warm" | "soft"
 * - Applies color classes based on selection.
 */

type ColorScheme = "friendly" | "warm" | "soft";

interface KennelInfo {
  name: string;
  logoUrl?: string;
  about: string;
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
  socialLinks?: { platform: string; url: string }[];
  breeds: string[];
}

interface DogProfile {
  id: string;
  name: string;
  imageUrl: string;
  bio: string;
  breed: string;
  gender: string;
  dob: string;
  profileUrl?: string;
  healthTestingUrl?: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  url?: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  photoUrl?: string;
}

interface FamilyBreederTemplateProps {
  colorScheme?: ColorScheme;
  kennel: KennelInfo;
  dogs: DogProfile[];
  puppyGallery: string[]; // image URLs
  applicationSteps: string[];
  applicationFormUrl?: string; // Integration: embed or link to app's form
  puppyPackageInfo: string;
  blogPosts: BlogPost[];
  healthTestingInfo: string;
  healthTestingUrl?: string;
  testimonials: Testimonial[];
  socializationInfo: string;
}

/**
 * Color scheme mapping for easy extension.
 */
const colorSchemes = {
  friendly: {
    bg: "bg-yellow-50",
    primary: "text-green-800",
    accent: "text-yellow-600",
    button: "bg-green-600 text-white hover:bg-yellow-500",
    section: "bg-green-50",
  },
  warm: {
    bg: "bg-orange-50",
    primary: "text-brown-800",
    accent: "text-orange-600",
    button: "bg-orange-600 text-white hover:bg-brown-700",
    section: "bg-orange-100",
  },
  soft: {
    bg: "bg-blue-50",
    primary: "text-blue-700",
    accent: "text-tan-600",
    button: "bg-blue-400 text-white hover:bg-tan-400",
    section: "bg-tan-50",
  },
};

/**
 * Main Family Breeder Template Component
 */
const FamilyBreederTemplate: React.FC<FamilyBreederTemplateProps> = ({
  colorScheme = "friendly",
  kennel,
  dogs,
  puppyGallery,
  applicationSteps,
  applicationFormUrl,
  puppyPackageInfo,
  blogPosts,
  healthTestingInfo,
  healthTestingUrl,
  testimonials,
  socializationInfo,
}) => {
  const colors = colorSchemes[colorScheme];

  return (
    <div className={`${colors.bg} min-h-screen font-sans`}>
      {/* Hero Section */}
      <section className={`w-full py-12 px-4 md:px-0 ${colors.section}`}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Kennel Logo */}
          {kennel.logoUrl && (
            <img
              src={kennel.logoUrl}
              alt={`${kennel.name} logo`}
              className="w-28 h-28 object-contain rounded-full shadow-md mb-4 md:mb-0"
            />
          )}
          <div className="flex-1">
            <h1 className={`text-3xl md:text-4xl font-bold ${colors.primary}`}>
              Welcome to Our Loving Home of {kennel.breeds.join(", ")} Puppies
            </h1>
            <p className="mt-2 text-lg text-gray-700">
              Raising happy, healthy, and well-socialized puppies for loving families.
            </p>
            <a
              href="#puppy-application"
              className={`inline-block mt-6 px-6 py-3 rounded-lg font-semibold transition ${colors.button}`}
            >
              Learn About Our Puppy Application
            </a>
          </div>
        </div>
        {/* Puppy Gallery Carousel (placeholder) */}
        <div className="mt-8 flex gap-4 overflow-x-auto">
          {puppyGallery.slice(0, 4).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Puppy ${i + 1}`}
              className="w-40 h-32 object-cover rounded-lg shadow"
            />
          ))}
        </div>
      </section>

      {/* Our Dogs Section */}
      <section className="w-full py-12 px-4" id="our-dogs">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Meet Our Beloved Dogs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dogs.map((dog) => (
              <div key={dog.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <img
                  src={dog.imageUrl}
                  alt={dog.name}
                  className="w-28 h-28 object-cover rounded-full mb-2"
                />
                <div className="font-semibold text-lg">{dog.name}</div>
                <div className="text-sm text-gray-600">{dog.breed}</div>
                <div className="mt-2 text-xs text-gray-500 text-center">{dog.bio}</div>
                <div className="flex gap-2 mt-2">
                  <a
                    href={dog.profileUrl || "#"}
                    className="text-blue-600 underline text-xs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Profile
                  </a>
                  {dog.healthTestingUrl && (
                    <a
                      href={dog.healthTestingUrl}
                      className="text-green-600 underline text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Health Testing
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Puppy Application Process */}
      <section className={`w-full py-12 px-4 ${colors.section}`} id="puppy-application">
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Our Simple Puppy Adoption Process
          </h2>
          <ol className="list-decimal list-inside mb-6 text-gray-700">
            {applicationSteps.map((step, i) => (
              <li key={i} className="mb-2">{step}</li>
            ))}
          </ol>
          <div className="mb-4 text-gray-600">
            <strong>What’s included with your puppy:</strong> {puppyPackageInfo}
          </div>
          {/* Integration Point: Embed or link to puppy application form */}
          {applicationFormUrl ? (
            <iframe
              src={applicationFormUrl}
              title="Puppy Application"
              className="w-full h-96 rounded-lg border"
            />
          ) : (
            <div className="bg-white border rounded-lg p-6 text-center text-gray-400">
              Puppy Application Form (Integration Point)
            </div>
          )}
        </div>
      </section>

      {/* Life with Our Puppies Blog */}
      <section className="w-full py-12 px-4" id="puppy-blog">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Our Puppy Adventures
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <a
                key={post.id}
                href={post.url || "#"}
                className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <div className="font-semibold text-lg">{post.title}</div>
                <div className="text-sm text-gray-600 mt-1">{post.excerpt}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Health Testing Information */}
      <section className={`w-full py-12 px-4 ${colors.section}`} id="health-testing">
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Committed to Healthy Puppies
          </h2>
          <p className="text-gray-700 mb-4">{healthTestingInfo}</p>
          {/* Integration Point: Link to health testing results/certifications */}
          {healthTestingUrl && (
            <a
              href={healthTestingUrl}
              className="text-green-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Health Testing Results
            </a>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 px-4" id="testimonials">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Happy Families, Happy Puppies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
                {t.photoUrl && (
                  <img
                    src={t.photoUrl}
                    alt={t.author}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                )}
                <div>
                  <blockquote className="italic text-gray-700">"{t.quote}"</blockquote>
                  <div className="mt-2 text-sm font-semibold text-gray-600">
                    — {t.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Socialization and Training Information */}
      <section className={`w-full py-12 px-4 ${colors.section}`} id="socialization">
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Giving Our Puppies the Best Start
          </h2>
          <p className="text-gray-700">{socializationInfo}</p>
        </div>
      </section>

      {/* Inquiry Form (Puppy Availability) */}
      <section className="w-full py-12 px-4" id="inquiry">
        <div className="max-w-lg mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Puppy Availability Inquiry
          </h2>
          <form
            // Integration Point: Connect to app's lead capture
            onSubmit={(e) => e.preventDefault()}
            className="bg-white rounded-lg shadow p-6 flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Your Name"
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Breed of Interest"
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Tell us about your family"
              className="border rounded px-3 py-2"
            />
            <textarea
              placeholder="Any specific questions?"
              className="border rounded px-3 py-2"
              rows={4}
            />
            <button
              type="submit"
              className={`mt-2 px-4 py-2 rounded ${colors.button}`}
            >
              Send Inquiry
            </button>
          </form>
          {/* Contact Info */}
          <div className="mt-6 text-center text-gray-600">
            <div>{kennel.contact.email}</div>
            {kennel.contact.phone && <div>{kennel.contact.phone}</div>}
            {kennel.contact.address && <div>{kennel.contact.address}</div>}
            {/* Social Links */}
            <div className="flex justify-center gap-4 mt-2">
              {kennel.socialLinks?.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-gray-500 border-t mt-8">
        <div>
          &copy; {new Date().getFullYear()} {kennel.name}. All rights reserved.
        </div>
        <div className="mt-1">
          {/* Integration Point: Privacy policy and social links */}
          <a href="/privacy-policy" className="underline mr-2">
            Privacy Policy
          </a>
          {kennel.socialLinks?.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline mx-1"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default FamilyBreederTemplate;

/**
 * SAMPLE USAGE (for development/testing)
 * 
 * <FamilyBreederTemplate
 *   colorScheme="friendly"
 *   kennel={{
 *     name: "Happy Paws Family",
 *     logoUrl: "/logos/happy-paws.png",
 *     about: "We are a small, home-based breeder raising puppies as part of our family.",
 *     contact: { email: "hello@happypaws.com", phone: "555-987-6543", address: "456 Puppy Lane, Town, State" },
 *     socialLinks: [
 *       { platform: "Facebook", url: "https://facebook.com/happypaws" },
 *       { platform: "Instagram", url: "https://instagram.com/happypaws" }
 *     ],
 *     breeds: ["Golden Retriever"]
 *   }}
 *   dogs={[
 *     { id: "1", name: "Bella", imageUrl: "/dogs/bella.jpg", bio: "Sweet and gentle, loves kids.", breed: "Golden Retriever", gender: "F", dob: "2021-03-01", profileUrl: "#", healthTestingUrl: "#" }
 *   ]}
 *   puppyGallery={["/puppies/puppy1.jpg", "/puppies/puppy2.jpg"]}
 *   applicationSteps={[
 *     "Submit your puppy application.",
 *     "Schedule a phone interview.",
 *     "Reserve your puppy with a deposit.",
 *     "Puppy selection and go-home day!"
 *   ]}
 *   applicationFormUrl="https://yourform.com"
 *   puppyPackageInfo="Health check, first vaccinations, puppy pack, and lifetime support."
 *   blogPosts={[
 *     { id: "1", title: "Puppy Socialization Tips", excerpt: "How we help puppies adjust to new homes.", imageUrl: "/blog/socialization.jpg", url: "#" }
 *   ]}
 *   healthTestingInfo="All our breeding dogs are health tested for common breed issues."
 *   healthTestingUrl="#"
 *   testimonials={[
 *     { id: "1", quote: "Our puppy is the sweetest addition to our family!", author: "The Smiths", photoUrl: "/avatars/family1.png" }
 *   ]}
 *   socializationInfo="Our puppies are raised in our home, exposed to children, other pets, and everyday life."
 * />
 */
