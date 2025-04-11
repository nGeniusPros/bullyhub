import React from "react";

/**
 * MultiServiceKennelTemplate
 * 
 * Landing page template for kennels offering breeding, training, boarding, and additional services.
 * 
 * Integration Points:
 * - All sections marked for dynamic data integration.
 * - Replace sample data with real data from the PetPals Dog Hub app as integration progresses.
 * 
 * Color Scheme:
 * - Accepts a colorScheme prop: "professional" | "earthy" | "bold"
 * - Applies color classes based on selection.
 */

type ColorScheme = "professional" | "earthy" | "bold";

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
  virtualTourUrl?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  pageUrl?: string;
  pricing?: string;
  bookingUrl?: string;
}

interface StaffProfile {
  id: string;
  name: string;
  photoUrl?: string;
  bio: string;
  role: string;
}

interface PricingPackage {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface MultiServiceKennelTemplateProps {
  colorScheme?: ColorScheme;
  kennel: KennelInfo;
  services: Service[];
  staff: StaffProfile[];
  pricingPackages: PricingPackage[];
  clientPortalUrl?: string;
  bookingSystemEmbedUrl?: string;
}

/**
 * Color scheme mapping for easy extension.
 */
const colorSchemes = {
  professional: {
    bg: "bg-white",
    primary: "text-blue-900",
    accent: "text-blue-600",
    button: "bg-blue-900 text-white hover:bg-blue-600",
    section: "bg-blue-50",
  },
  earthy: {
    bg: "bg-green-50",
    primary: "text-green-900",
    accent: "text-brown-700",
    button: "bg-green-700 text-white hover:bg-brown-700",
    section: "bg-green-100",
  },
  bold: {
    bg: "bg-black",
    primary: "text-orange-500",
    accent: "text-white",
    button: "bg-orange-500 text-white hover:bg-black border border-orange-500",
    section: "bg-gray-900",
  },
};

/**
 * Main Multi-Service Kennel Template Component
 */
const MultiServiceKennelTemplate: React.FC<MultiServiceKennelTemplateProps> = ({
  colorScheme = "professional",
  kennel,
  services,
  staff,
  pricingPackages,
  clientPortalUrl,
  bookingSystemEmbedUrl,
}) => {
  const colors = colorSchemes[colorScheme];

  // Service navigation links
  const serviceNav = services.map((s) => ({
    name: s.name,
    url: s.pageUrl || `#${s.name.toLowerCase().replace(/\s+/g, "-")}`,
  }));

  return (
    <div className={`${colors.bg} min-h-screen font-sans`}>
      {/* Hero Section */}
      <section className={`w-full py-12 px-4 md:px-0 ${colors.section}`}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Kennel Logo */}
          {kennel.logoUrl && (
            <img
              src={kennel.logoUrl}
              alt={`${kennel.name} logo`}
              className="w-32 h-32 object-contain rounded-full shadow-md mb-4 md:mb-0"
            />
          )}
          <div className="flex-1">
            <h1 className={`text-3xl md:text-5xl font-bold ${colors.primary}`}>
              {kennel.name}: Your Partner in Canine Care
            </h1>
            <p className="mt-2 text-lg md:text-xl text-gray-700">
              Offering {services.map((s) => s.name).join(", ")} and more.
            </p>
            {/* Service Navigation */}
            <nav className="mt-6 flex flex-wrap gap-4">
              {serviceNav.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  className={`px-4 py-2 rounded font-semibold transition ${colors.button}`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
          {/* Service-Oriented Image/Carousel (placeholder) */}
          <div className="hidden md:block w-64">
            {services[0]?.imageUrl && (
              <img
                src={services[0].imageUrl}
                alt={services[0].name}
                className="w-full h-48 object-cover rounded-lg shadow"
              />
            )}
          </div>
        </div>
      </section>

      {/* Service Pages */}
      {services.map((service) => (
        <section
          key={service.id}
          className={`w-full py-12 px-4 ${colors.section}`}
          id={service.name.toLowerCase().replace(/\s+/g, "-")}
        >
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
            {service.imageUrl && (
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-40 h-40 object-cover rounded-lg shadow mb-4 md:mb-0"
              />
            )}
            <div className="flex-1">
              <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${colors.primary}`}>
                {service.name}
              </h2>
              <p className="text-gray-700 mb-2">{service.description}</p>
              {service.pricing && (
                <div className="mb-2 text-sm text-gray-600">
                  <strong>Pricing:</strong> {service.pricing}
                </div>
              )}
              {/* Integration Point: Booking widget for this service */}
              {service.bookingUrl && (
                <a
                  href={service.bookingUrl}
                  className={`inline-block mt-2 px-4 py-2 rounded ${colors.button} text-sm`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book {service.name}
                </a>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Integrated Booking System */}
      <section className="w-full py-12 px-4" id="booking">
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Book Our Services
          </h2>
          {/* Integration Point: Embed booking system */}
          {bookingSystemEmbedUrl ? (
            <iframe
              src={bookingSystemEmbedUrl}
              title="Booking System"
              className="w-full h-96 rounded-lg border"
            />
          ) : (
            <div className="bg-white border rounded-lg p-6 text-center text-gray-400">
              Booking System Integration (Integration Point)
            </div>
          )}
        </div>
      </section>

      {/* Staff/Team Member Profiles */}
      <section className={`w-full py-12 px-4 ${colors.section}`} id="staff">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Meet Our Experienced Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                {member.photoUrl && (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-24 h-24 object-cover rounded-full mb-2"
                  />
                )}
                <div className="font-semibold text-lg">{member.name}</div>
                <div className="text-xs text-gray-600 mb-2">{member.role}</div>
                <div className="text-xs text-gray-500 text-center">{member.bio}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Virtual Tour */}
      <section className="w-full py-12 px-4" id="virtual-tour">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Take a Virtual Tour
          </h2>
          {/* Integration Point: Embed virtual tour or gallery */}
          {kennel.virtualTourUrl ? (
            <iframe
              src={kennel.virtualTourUrl}
              title="Facility Virtual Tour"
              className="w-full h-96 rounded-lg border"
            />
          ) : (
            <div className="bg-white border rounded-lg p-6 text-center text-gray-400">
              Virtual Tour Integration (Integration Point)
            </div>
          )}
        </div>
      </section>

      {/* Pricing and Package Information */}
      <section className={`w-full py-12 px-4 ${colors.section}`} id="pricing">
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Pricing & Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pricingPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow p-4">
                <div className="font-semibold text-lg">{pkg.name}</div>
                <div className="text-sm text-gray-600 mb-2">{pkg.price}</div>
                <div className="text-xs text-gray-500">{pkg.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Portal Access */}
      <section className="w-full py-12 px-4" id="client-portal">
        <div className="max-w-md mx-auto text-center">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Client Login
          </h2>
          <p className="mb-4 text-gray-700">
            Access your account, booking history, and more.
          </p>
          {clientPortalUrl ? (
            <a
              href={clientPortalUrl}
              className={`inline-block px-6 py-3 rounded-lg font-semibold transition ${colors.button}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Client Portal
            </a>
          ) : (
            <div className="bg-white border rounded-lg p-6 text-center text-gray-400">
              Client Portal Integration (Integration Point)
            </div>
          )}
        </div>
      </section>

      {/* Contact Form (Service Inquiries) */}
      <section className={`w-full py-12 px-4 ${colors.section}`} id="contact">
        <div className="max-w-lg mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Contact Us
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
              placeholder="Service of Interest"
              className="border rounded px-3 py-2"
            />
            <textarea
              placeholder="Message"
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

export default MultiServiceKennelTemplate;

/**
 * SAMPLE USAGE (for development/testing)
 * 
 * <MultiServiceKennelTemplate
 *   colorScheme="professional"
 *   kennel={{
 *     name: "Canine Care Center",
 *     logoUrl: "/logos/canine-care.png",
 *     about: "Your one-stop destination for all things canine.",
 *     contact: { email: "info@caninecare.com", phone: "555-222-3333", address: "101 Dogwood Ave, City, State" },
 *     socialLinks: [
 *       { platform: "Facebook", url: "https://facebook.com/caninecare" },
 *       { platform: "Instagram", url: "https://instagram.com/caninecare" }
 *     ],
 *     breeds: ["Labrador", "Poodle"],
 *     virtualTourUrl: "#"
 *   }}
 *   services={[
 *     { id: "1", name: "Breeding", description: "Ethical breeding of top-quality dogs.", imageUrl: "/services/breeding.jpg", pricing: "$2000+", pageUrl: "#breeding", bookingUrl: "#" },
 *     { id: "2", name: "Training", description: "Obedience, agility, and behavior modification.", imageUrl: "/services/training.jpg", pricing: "$100/session", pageUrl: "#training", bookingUrl: "#" },
 *     { id: "3", name: "Boarding", description: "Comfortable, safe boarding facilities.", imageUrl: "/services/boarding.jpg", pricing: "$50/night", pageUrl: "#boarding", bookingUrl: "#" }
 *   ]}
 *   staff={[
 *     { id: "1", name: "Jane Trainer", photoUrl: "/staff/jane.jpg", bio: "Certified dog trainer with 10+ years experience.", role: "Head Trainer" }
 *   ]}
 *   pricingPackages={[
 *     { id: "1", name: "Boarding Package", description: "7 nights, daily walks, and playtime.", price: "$300" }
 *   ]}
 *   clientPortalUrl="#"
 *   bookingSystemEmbedUrl="#"
 * />
 */
