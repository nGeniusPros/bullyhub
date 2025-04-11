import React from "react";

// --- TYPE DEFINITIONS (Assume these are defined as in your original code) ---
type ColorScheme = "classic" | "modern" | "warm";

interface KennelInfo {
  name: string;
  logoUrl?: string;
  mission: string;
  about: string; // Pulled from "General Breeding Philosophy/Practices Overview" in Kennel Settings
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
  socialLinks?: { platform: string; url: string }[];
  breeds: string[]; // Pulled from Kennel Settings
}

interface DogProfile {
  id: string; // Unique ID from Dog Database
  name: string;
  imageUrl: string;
  achievements?: string[]; // Titles/Achievements from Dog Database
  breed: string;
  gender: string;
  dob: string; // Date of Birth
  isStud: boolean; // Availability for Stud from Dog Database
  studFee?: string; // Stud Fee from Dog Database
  profileUrl?: string; // Link to full profile within PetPals Hub App (generated)
  // Integration Point: Need fields for Pedigree Data, Genetic Data, Health Testing for detailed views
}

interface LitterInfo {
  id: string; // Unique ID from Litter Management
  parents: { name: string; profileUrl?: string }[]; // Links to parent Dog Profiles
  expectedDate: string; // Expected/Birth Date
  geneticSummary?: string; // Potential Genetic Traits (pulled from parent data analysis)
  status: "Available" | "Reserved" | "Sold"; // Availability Status
}

interface Testimonial {
  id: string; // From Testimonial Management section in app
  quote: string;
  author: string;
  photoUrl?: string;
}

interface Service {
  name: string; // From Service Settings in app
  description: string;
  price?: string;
}

// --- COLOR SCHEME MAPPING (Assume this is defined as in your original code) ---
const colorSchemes = {
  classic: {
    bg: "bg-white",
    text: "text-gray-800",
    primary: "text-navy-900",
    accent: "text-gold-600",
    buttonBg: "bg-navy-900",
    buttonText: "text-white",
    buttonHoverBg: "hover:bg-gold-600",
    buttonHoverText: "hover:text-navy-900", // Example hover text change
    sectionBg: "bg-navy-50",
    cardBg: "bg-white",
    footerBg: "bg-gray-100",
    footerText: "text-gray-600",
    inputBorder: "border-gray-300 focus:border-navy-500 focus:ring-navy-500",
  },
  modern: {
    bg: "bg-white",
    text: "text-gray-800",
    primary: "text-teal-800",
    accent: "text-coral-500",
    buttonBg: "bg-teal-800",
    buttonText: "text-white",
    buttonHoverBg: "hover:bg-coral-500",
    buttonHoverText: "hover:text-white",
    sectionBg: "bg-teal-50",
    cardBg: "bg-white",
    footerBg: "bg-gray-100",
    footerText: "text-gray-600",
    inputBorder: "border-gray-300 focus:border-teal-500 focus:ring-teal-500",
  },
  warm: {
    bg: "bg-cream-50",
    text: "text-gray-800",
    primary: "text-burgundy-800",
    accent: "text-amber-700", // Adjusted accent for better contrast potential
    buttonBg: "bg-burgundy-800",
    buttonText: "text-white",
    buttonHoverBg: "hover:bg-amber-700",
    buttonHoverText: "hover:text-burgundy-900",
    sectionBg: "bg-cream-100",
    cardBg: "bg-white",
    footerBg: "bg-cream-200",
    footerText: "text-burgundy-900",
    inputBorder: "border-gray-300 focus:border-burgundy-500 focus:ring-burgundy-500",
  },
};


// --- PROPS INTERFACE ---

interface ProfessionalBreederTemplateProps {
  colorScheme?: ColorScheme;
  // --- Data Integration Points ---
  kennel: KennelInfo; // Populated from General Kennel Information in App Settings
  featuredDogs: DogProfile[]; // Populated from selecting "Featured Dogs" in App's Dog DB
  studDogs: DogProfile[]; // Populated by filtering Dog DB for "Available for Stud" = Yes
  breedingPhilosophy: string; // Populated from "General Breeding Philosophy/Practices Overview" in App Settings
  upcomingLitters: LitterInfo[]; // Populated from App's Litter Management section
  testimonials: Testimonial[]; // Populated from App's Testimonial Management (if available)
  services: Service[]; // Populated from App's Service Settings
  reproductiveCalendarUrl?: string; // Optional: URL for embedded calendar from App Settings
  // --- Function Integration Points ---
  onStudInquirySubmit: (formData: { name: string; email: string; dogOfInterest?: string; message?: string }) => Promise<void>;
  onContactSubmit: (formData: { name: string; email: string; breedOfInterest?: string; message?: string }) => Promise<void>;
  privacyPolicyUrl?: string; // Link from App Settings
}

// --- SUB-COMPONENTS (for better modularity) ---

// NOTE: In a real project, these would likely be in separate files (e.g., ./components/HeroSection.tsx)

const HeroSection: React.FC<{
  kennel: KennelInfo;
  featuredDogs: DogProfile[];
  colors: typeof colorSchemes[ColorScheme];
}> = ({ kennel, featuredDogs, colors }) => (
  <section className={`w-full py-16 px-4 md:py-24 ${colors.sectionBg}`}>
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
      {/* Kennel Info */}
      <div className="flex-1 text-center md:text-left">
        {kennel.logoUrl && (
          <img
            src={kennel.logoUrl}
            alt={`${kennel.name} logo`}
            className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-full shadow-md mb-4 mx-auto md:mx-0"
          />
        )}
        {/* Kennel Name: Pulled directly from "Kennel Settings." */}
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold ${colors.primary}`}>
          {kennel.name}
        </h1>
        {/* Mission Statement: Pulled from "Kennel Settings." */}
        <p className={`mt-3 text-lg md:text-xl ${colors.text} opacity-90`}>
          {kennel.mission}
        </p>
        <a
          href="#stud-services" // Link to relevant section
          className={`inline-block mt-6 px-8 py-3 rounded-lg font-semibold transition duration-300 ease-in-out ${colors.buttonBg} ${colors.buttonText} ${colors.buttonHoverBg} ${colors.buttonHoverText}`}
        >
          Explore Our Dogs
        </a>
      </div>

      {/* Featured Dogs Carousel (Placeholder) */}
      {/* Integration Point: Replace div with a real carousel component (e.g., Swiper, react-slick) */}
      {/* Data: Populated from selecting "Featured Dogs" in App's Dog DB */}
      {featuredDogs.length > 0 && (
        <div className="w-full md:w-1/3 mt-8 md:mt-0">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden aspect-square relative">
             {/* Carousel implementation goes here */}
             <img
                src={featuredDogs[0].imageUrl} // Sample: show first image
                alt={`Featured dog: ${featuredDogs[0].name}`}
                className="w-full h-full object-cover"
             />
             <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 text-center">
                 <p className="font-semibold">{featuredDogs[0].name}</p>
                 <p className="text-sm">{featuredDogs[0].breed}</p>
             </div>
             {/* Add carousel controls/pagination */}
          </div>
          <p className="text-center mt-2 text-sm text-gray-600">Our Featured Stars</p>
        </div>
      )}
    </div>
  </section>
);

const StudServicesSection: React.FC<{
  studDogs: DogProfile[];
  colors: typeof colorSchemes[ColorScheme];
  onSubmit: ProfessionalBreederTemplateProps['onStudInquirySubmit'];
}> = ({ studDogs, colors, onSubmit }) => {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            dogOfInterest: formData.get('dogOfInterest') as string || undefined,
            message: formData.get('message') as string || undefined,
        };
        // Integration Point: Call function prop to send data to app backend
        await onSubmit(data);
        // Optional: Add success message/state handling
        event.currentTarget.reset(); // Clear form
    };

    return (
      <section className="w-full py-16 px-4" id="stud-services">
        <div className="max-w-6xl mx-auto">
          {/* Headline: Templated ("Exceptional Stud Dogs Available"). */}
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-center ${colors.primary}`}>
            Exceptional Stud Dogs Available
          </h2>
          {/* Integration Point: Overview text can be a setting in the app or static */}
          <p className={`mb-10 text-center text-lg ${colors.text} opacity-80 max-w-3xl mx-auto`}>
            Our stud dogs represent the pinnacle of the breed, selected for their outstanding health, proven temperament, and champion lineage. Explore their profiles below.
          </p>

          {/* Stud Dogs Grid */}
          {/* Data: Populated by filtering Dog DB for "Available for Stud" = Yes */}
          {studDogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {studDogs.map((dog) => (
                <div key={dog.id} className={`${colors.cardBg} rounded-lg shadow-lg p-5 flex flex-col items-center text-center transition duration-300 hover:shadow-xl`}>
                  <img
                    src={dog.imageUrl}
                    alt={dog.name}
                    className="w-40 h-40 object-cover rounded-full mb-4 border-4 border-white shadow-md"
                  />
                  <div className={`font-bold text-xl ${colors.primary}`}>{dog.name}</div>
                  <div className={`text-md ${colors.text} opacity-70`}>{dog.breed}</div>
                  {dog.achievements && dog.achievements.length > 0 && (
                    <ul className="mt-2 text-xs text-gray-500 list-disc list-inside">
                      {dog.achievements.slice(0, 2).map((ach, i) => ( // Show first 2 achievements
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  )}
                  {/* Integration Point: Link to full profile in PetPals Hub App */}
                  <a
                    href={dog.profileUrl || "#"} // Fallback href just in case
                    className={`mt-4 ${colors.accent} underline font-semibold text-sm hover:text-opacity-80`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View full profile and pedigree for ${dog.name}`}
                  >
                    View Full Profile & Pedigree
                  </a>
                  {dog.studFee && (
                    <div className={`mt-2 text-sm font-medium ${colors.text}`}>
                      Stud Fee: {dog.studFee}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center ${colors.text} opacity-70`}>No stud dogs currently listed. Please check back later.</p>
          )}

          {/* Breeding Inquiry Form Snippet */}
          <form
            id="breeding-inquiry"
            className={`mt-12 ${colors.sectionBg} rounded-lg p-6 md:p-8 shadow-md max-w-2xl mx-auto`}
            onSubmit={handleSubmit}
            aria-labelledby="stud-inquiry-heading"
          >
            <h3 id="stud-inquiry-heading" className={`text-xl font-semibold mb-4 ${colors.primary}`}>Interested in a Stud?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                className={`w-full border rounded px-3 py-2 ${colors.inputBorder} focus:outline-none focus:ring-2`}
                required
                aria-required="true"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email *"
                className={`w-full border rounded px-3 py-2 ${colors.inputBorder} focus:outline-none focus:ring-2`}
                required
                aria-required="true"
              />
              <input
                type="text"
                name="dogOfInterest"
                placeholder="Dog of Interest (Optional)"
                className={`w-full border rounded px-3 py-2 ${colors.inputBorder} focus:outline-none focus:ring-2 md:col-span-2`}
              />
              <textarea
                name="message"
                placeholder="Your Message (Optional)"
                className={`w-full border rounded px-3 py-2 md:col-span-2 ${colors.inputBorder} focus:outline-none focus:ring-2`}
                rows={3}
              />
            </div>
            <button
              type="submit"
              className={`mt-5 w-full md:w-auto px-6 py-2 rounded font-semibold transition duration-300 ${colors.buttonBg} ${colors.buttonText} ${colors.buttonHoverBg} ${colors.buttonHoverText}`}
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </section>
    );
}


const BreedingProgramSection: React.FC<{
    breedingPhilosophy: string;
    colors: typeof colorSchemes[ColorScheme];
    // Integration Point: Add props for pedigree data if displaying directly
}> = ({ breedingPhilosophy, colors }) => (
    <section className={`w-full py-16 px-4 ${colors.sectionBg}`}>
        <div className="max-w-4xl mx-auto">
            {/* Headline: Emphasize commitment */}
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-center ${colors.primary}`}>
                Our Dedicated Breeding Program
            </h2>
            {/* Description: Pulled from "General Breeding Philosophy/Practices Overview" in "Kennel Settings." */}
            <p className={`text-lg ${colors.text} opacity-90 whitespace-pre-line leading-relaxed`}>
                {breedingPhilosophy}
            </p>

            {/* Integration Point: Pedigree chart component */}
            {/* This could be an iframe embed from the app, or a component */}
            {/* that takes pedigree data structure from the app and renders it. */}
            <div className="mt-10 p-6 bg-white border rounded-lg text-center text-gray-500 shadow">
                <h3 className={`text-xl font-semibold mb-3 ${colors.primary}`}>Pedigree Information</h3>
                <p>Detailed pedigree charts for our key breeding dogs are available within their profiles.</p>
                {/* Placeholder - Replace with actual implementation */}
                <div className="mt-4 italic text-sm">[Interactive Pedigree Chart Integration Point]</div>
                <p className="mt-2 text-sm">Links available on individual dog profile pages accessed via the Stud Services section.</p>
            </div>
        </div>
    </section>
);

const UpcomingLittersSection: React.FC<{
    upcomingLitters: LitterInfo[];
    colors: typeof colorSchemes[ColorScheme];
}> = ({ upcomingLitters, colors }) => (
    <section className="w-full py-16 px-4" id="upcoming-litters">
        <div className="max-w-5xl mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold mb-10 text-center ${colors.primary}`}>
                Anticipated Litters - Future Champions
            </h2>
            {/* Data: pulled from the app's "Litter Management" section */}
            {upcomingLitters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {upcomingLitters.map((litter) => (
                        <div key={litter.id} className={`${colors.cardBg} rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-xl`}>
                            <div className="font-semibold text-lg mb-2">
                                {litter.parents.map((parent, i) => (
                                    <span key={i}>
                                        {/* Integration Point: Link to parent's profile in PetPals Hub App */}
                                        <a
                                            href={parent.profileUrl || "#"}
                                            className={`${colors.accent} underline hover:text-opacity-80`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`View profile for ${parent.name}`}
                                        >
                                            {parent.name}
                                        </a>
                                        {i < litter.parents.length - 1 && <span className="mx-1"> × </span>}
                                    </span>
                                ))}
                            </div>
                            <div className={`text-sm ${colors.text} opacity-80 mb-1`}>
                                <span className="font-medium">Expected Whelping Date:</span> {litter.expectedDate}
                            </div>
                             {/* Integration Point: Display genetic predictions from PetPals Hub App */}
                            {litter.geneticSummary && (
                                <div className="mt-2 text-xs text-gray-600 mb-1">
                                    <span className="font-medium">Potential Traits:</span> {litter.geneticSummary}
                                </div>
                            )}
                            <div className="mt-2 text-sm mb-4">
                                Status: <span className={`font-semibold ${litter.status === 'Available' ? colors.primary : 'text-gray-600'}`}>{litter.status}</span>
                            </div>
                            {/* Integration Point: Link to a waitlist form/page or contact section */}
                            <a
                                href="#contact" // Changed to general contact, can be specific waitlist form URL
                                className={`inline-block px-5 py-2 rounded font-semibold text-sm transition duration-300 ${colors.buttonBg} ${colors.buttonText} ${colors.buttonHoverBg} ${colors.buttonHoverText}`}
                            >
                                Inquire About This Litter
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                 <p className={`text-center ${colors.text} opacity-70`}>No upcoming litters currently announced. Please check back soon or contact us for future plans.</p>
            )}
        </div>
    </section>
);


const TestimonialsSection: React.FC<{
    testimonials: Testimonial[];
    colors: typeof colorSchemes[ColorScheme];
}> = ({ testimonials, colors }) => {
    if (!testimonials || testimonials.length === 0) {
        // Optionally render nothing or a placeholder if no testimonials are provided
        return null; // Or a small placeholder section
    }
    return (
        <section className={`w-full py-16 px-4 ${colors.sectionBg}`}>
            <div className="max-w-5xl mx-auto">
                <h2 className={`text-3xl md:text-4xl font-bold mb-10 text-center ${colors.primary}`}>
                    What Our Families Say
                </h2>
                 {/* Data: Pulled from App's Testimonial Management */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((t) => (
                        <div key={t.id} className={`${colors.cardBg} rounded-lg shadow-lg p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left`}>
                            {t.photoUrl && (
                                <img
                                    src={t.photoUrl}
                                    alt={`Photo of ${t.author}`}
                                    className="w-20 h-20 object-cover rounded-full flex-shrink-0 shadow-sm"
                                />
                            )}
                            <div className="flex-grow">
                                <blockquote className={`italic ${colors.text} opacity-90 relative`}>
                                    <span className={`absolute -top-2 -left-3 text-4xl ${colors.primary} opacity-30`}>“</span>
                                    {t.quote}
                                    <span className={`absolute -bottom-2 -right-1 text-4xl ${colors.primary} opacity-30`}>”</span>
                                </blockquote>
                                <div className={`mt-3 text-sm font-semibold ${colors.primary} opacity-80`}>
                                    — {t.author}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


const ServicesSection: React.FC<{
    services: Service[];
    reproductiveCalendarUrl?: string;
    colors: typeof colorSchemes[ColorScheme];
}> = ({ services, reproductiveCalendarUrl, colors }) => {
     // Only render the section if there are services or a calendar URL
    if ((!services || services.length === 0) && !reproductiveCalendarUrl) {
        return null;
    }
    return (
        <section className="w-full py-16 px-4" id="repro-services">
            <div className="max-w-4xl mx-auto">
                <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-center ${colors.primary}`}>
                    Reproductive Services & Availability
                </h2>

                {/* Integration Point: Embed calendar (e.g., Google Calendar) if URL provided in App Settings */}
                {reproductiveCalendarUrl ? (
                    <div className="mb-10 shadow-lg rounded-lg overflow-hidden border">
                       <iframe
                            src={reproductiveCalendarUrl}
                            title="Reproductive Services Calendar"
                            className="w-full h-72 md:h-96" // Adjusted height
                            loading="lazy" // Lazy load the iframe
                       />
                    </div>
                ) : (
                    <div className={`${colors.sectionBg} border rounded-lg p-6 text-center text-gray-500 mb-10 shadow-sm`}>
                        <p>Contact us for service availability.</p>
                        <p className="text-sm mt-1">[Calendar Integration Point - Optional]</p>
                    </div>
                )}

                 {/* Data: Pulled from App's Service Settings */}
                {services && services.length > 0 && (
                     <>
                        <h3 className={`text-xl font-semibold mb-4 ${colors.primary}`}>Services Offered</h3>
                        <ul className="space-y-3 mb-8">
                            {services.map((service, i) => (
                            <li key={i} className={`${colors.cardBg} p-4 rounded shadow-sm border-l-4 border-${colors.accent.split('-')[1]}-500`}> {/* Simple card look */}
                                <span className={`font-semibold ${colors.primary}`}>{service.name}:</span>{' '}
                                <span className={`${colors.text} opacity-90`}>{service.description}</span>
                                {service.price && (
                                <span className="ml-2 text-xs text-gray-500">({service.price})</span>
                                )}
                            </li>
                            ))}
                        </ul>
                        <div className="text-center">
                            <a
                                href="#contact" // Link to general contact form
                                className={`inline-block px-6 py-2 rounded font-semibold text-sm transition duration-300 ${colors.buttonBg} ${colors.buttonText} ${colors.buttonHoverBg} ${colors.buttonHoverText}`}
                            >
                                Contact for Service Inquiry
                            </a>
                        </div>
                     </>
                )}
            </div>
        </section>
    );
}


const ContactSection: React.FC<{
    kennel: KennelInfo;
    colors: typeof colorSchemes[ColorScheme];
    onSubmit: ProfessionalBreederTemplateProps['onContactSubmit'];
}> = ({ kennel, colors, onSubmit }) => {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
         const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            breedOfInterest: formData.get('breedOfInterest') as string || undefined,
            message: formData.get('message') as string || undefined,
        };
         // Integration Point: Call function prop to send data to app backend's lead capture
        await onSubmit(data);
        // Optional: Add success message/state handling
        event.currentTarget.reset(); // Clear form
    };

    return (
        <section className={`w-full py-16 px-4 ${colors.sectionBg}`} id="contact">
            <div className="max-w-lg mx-auto">
                 <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-center ${colors.primary}`}>
                    Contact Us
                </h2>
                 {/* Structure: Templated, submissions managed within the app's lead capture. */}
                <form
                    onSubmit={handleSubmit}
                    className={`${colors.cardBg} rounded-lg shadow-xl p-6 md:p-8 flex flex-col gap-5`}
                    aria-labelledby="contact-heading"
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name *"
                        className={`w-full border rounded px-4 py-2 ${colors.inputBorder} focus:outline-none focus:ring-2`}
                        required
                        aria-required="true"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email *"
                        className={`w-full border rounded px-4 py-2 ${colors.inputBorder} focus:outline-none focus:ring-2`}
                        required
                        aria-required="true"
                    />
                    <input
                        type="text"
                        name="breedOfInterest"
                        placeholder="Breed of Interest (Optional)"
                         className={`w-full border rounded px-4 py-2 ${colors.inputBorder} focus:outline-none focus:ring-2`}
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message *"
                        className={`w-full border rounded px-4 py-2 ${colors.inputBorder} focus:outline-none focus:ring-2`}
                        rows={4}
                        required
                        aria-required="true"
                    />
                    <button
                        type="submit"
                        className={`mt-2 w-full px-6 py-3 rounded font-semibold transition duration-300 ${colors.buttonBg} ${colors.buttonText} ${colors.buttonHoverBg} ${colors.buttonHoverText}`}
                    >
                        Send Message
                    </button>
                </form>

                {/* Contact Info: Pulled from Kennel Settings */}
                <div className={`mt-8 text-center ${colors.text} opacity-80`}>
                    <p className="font-semibold mb-1">Get in Touch Directly:</p>
                    {kennel.contact.email && <div>Email: <a href={`mailto:${kennel.contact.email}`} className={`${colors.accent} hover:underline`}>{kennel.contact.email}</a></div>}
                    {kennel.contact.phone && <div>Phone: <a href={`tel:${kennel.contact.phone}`} className={`${colors.accent} hover:underline`}>{kennel.contact.phone}</a></div>}
                    {kennel.contact.address && <div className="mt-1">{kennel.contact.address}</div>}
                    {/* Social Links: Pulled from Kennel Settings */}
                    {kennel.socialLinks && kennel.socialLinks.length > 0 && (
                        <div className="flex justify-center gap-4 mt-4">
                            {kennel.socialLinks.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${colors.accent} hover:text-opacity-80 text-sm underline`}
                                    aria-label={`Visit our ${link.platform} page`}
                                >
                                    {link.platform}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

const Footer: React.FC<{
    kennelName: string;
    privacyPolicyUrl?: string;
    socialLinks?: { platform: string; url: string }[];
    colors: typeof colorSchemes[ColorScheme];
}> = ({ kennelName, privacyPolicyUrl, socialLinks, colors }) => (
    <footer className={`w-full py-8 px-4 text-center text-sm ${colors.footerBg} ${colors.footerText} border-t`}>
        <div>
             &copy; {new Date().getFullYear()} {kennelName}. All rights reserved.
        </div>
        <div className="mt-2 flex justify-center items-center gap-4 flex-wrap">
            {/* Integration Point: Privacy policy link from App Settings */}
            {privacyPolicyUrl && (
                <a href={privacyPolicyUrl} className="underline hover:opacity-80">
                    Privacy Policy
                </a>
            )}
             {/* Integration Point: Terms/Contract link from App Settings */}
            {/* Example: <a href={termsUrl} className="underline hover:opacity-80">Terms & Conditions</a> */}

             {/* Repeat social links if desired */}
             {socialLinks && socialLinks.length > 0 && socialLinks.map((link, i) => (
                <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80"
                     aria-label={`Visit our ${link.platform} page (footer link)`}
                >
                    {link.platform}
                </a>
            ))}
        </div>
         {/* Optional: Link back to PetPals Hub or Website Builder Credit */}
         {/* <div className="mt-3 text-xs opacity-60">Website powered by PetPals Dog Hub</div> */}
    </footer>
);


// --- MAIN TEMPLATE COMPONENT ---

/**
 * ProfessionalBreederTemplate (Enhanced)
 *
 * Landing page template for established kennels focusing on breeding programs.
 * Designed for integration with the PetPals Dog Hub app.
 * Features: Modular components, responsive design, customizable color schemes,
 * clear data integration points, basic accessibility considerations.
 */
const ProfessionalBreederTemplate: React.FC<ProfessionalBreederTemplateProps> = ({
  colorScheme = "classic",
  kennel,
  featuredDogs,
  studDogs,
  breedingPhilosophy,
  upcomingLitters,
  testimonials,
  services,
  reproductiveCalendarUrl,
  onStudInquirySubmit,
  onContactSubmit,
  privacyPolicyUrl
}) => {
  const colors = colorSchemes[colorScheme];

  // Basic validation / fallback for required data
  if (!kennel) {
      // In a real app, you might show a loading state or error message
      return <div className="p-8 text-red-600">Error: Kennel information is missing.</div>;
  }

  // Define dummy submit handlers for testing if none are provided
  const handleDummySubmit = async (formData: any) => {
      console.log("Form Submitted (Dummy Handler):", formData);
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      alert("Inquiry submitted successfully (Test Mode)!");
  };

  return (
    <div className={`${colors.bg} ${colors.text} min-h-screen font-sans antialiased`}>
        <HeroSection kennel={kennel} featuredDogs={featuredDogs} colors={colors} />
        <StudServicesSection studDogs={studDogs} colors={colors} onSubmit={onStudInquirySubmit || handleDummySubmit} />
        <BreedingProgramSection breedingPhilosophy={breedingPhilosophy} colors={colors} />
        <UpcomingLittersSection upcomingLitters={upcomingLitters} colors={colors} />
        <TestimonialsSection testimonials={testimonials} colors={colors} />
        <ServicesSection services={services} reproductiveCalendarUrl={reproductiveCalendarUrl} colors={colors} />
        <ContactSection kennel={kennel} colors={colors} onSubmit={onContactSubmit || handleDummySubmit} />
        <Footer kennelName={kennel.name} privacyPolicyUrl={privacyPolicyUrl} socialLinks={kennel.socialLinks} colors={colors} />
    </div>
  );
};

export default ProfessionalBreederTemplate;

// --- SAMPLE USAGE (For Development/Testing) ---
/*
// In your testing/preview page:
import ProfessionalBreederTemplate from './ProfessionalBreederTemplate';

const sampleKennelData: KennelInfo = {
    name: "The Legacy Kennel",
    logoUrl: "https://via.placeholder.com/150/000080/FFFFFF?text=Logo", // Navy-like placeholder
    mission: "Dedicated to Breeding Excellence in Champion Bloodlines",
    about: "With over 20 years of experience, we are committed to producing exceptional Bulldogs that adhere to the highest breed standards. Our focus is on health, stable temperament, and correct conformation. All our breeding dogs undergo rigorous health testing.",
    contact: { email: "info@legacykennel.sample.com", phone: "555-123-4567", address: "123 Kennel Lane, Breederville, ST 12345" },
    socialLinks: [
      { platform: "Facebook", url: "https://facebook.com/#" },
      { platform: "Instagram", url: "https://instagram.com/#" }
    ],
    breeds: ["English Bulldog", "French Bulldog"]
};

const sampleFeaturedDogs: DogProfile[] = [
    { id: "dog1", name: "Champion Maximus 'Max'", imageUrl: "https://via.placeholder.com/400/D3D3D3/000000?text=Max", breed: "English Bulldog", gender: "M", dob: "2020-01-15", isStud: true, achievements: ["Grand Champion", "Best in Show Winner"], profileUrl: "#max-profile" }
];

const sampleStudDogs: DogProfile[] = [
    { id: "dog1", name: "Champion Maximus 'Max'", imageUrl: "https://via.placeholder.com/300/D3D3D3/000000?text=Max", breed: "English Bulldog", gender: "M", dob: "2020-01-15", isStud: true, achievements: ["Grand Champion", "Best in Show Winner"], studFee: "$2500", profileUrl: "#max-profile" },
    { id: "dog2", name: "Sir Reginald 'Reggie'", imageUrl: "https://via.placeholder.com/300/E0E0E0/000000?text=Reggie", breed: "English Bulldog", gender: "M", dob: "2021-05-20", isStud: true, achievements: ["AKC Champion Pointed"], studFee: "$1800", profileUrl: "#reggie-profile" },
    { id: "dog3", name: "Baron Von Smoosh III", imageUrl: "https://via.placeholder.com/300/C0C0C0/000000?text=Baron", breed: "French Bulldog", gender: "M", dob: "2022-02-10", isStud: true, studFee: "$2000", profileUrl: "#baron-profile" }
];

const samplePhilosophy = `We believe in a holistic approach to breeding, prioritizing the long-term health and well-being of our dogs above all else.
Our program includes comprehensive health screening (OFA, PennHIP, genetic panels), careful pedigree analysis to minimize COI, and early neurological stimulation for puppies.
We raise our puppies in a home environment, ensuring they are well-socialized and ready to become beloved family members. We stand behind our dogs with a comprehensive health guarantee.`;

const sampleLitters: LitterInfo[] = [
    { id: "litter1", parents: [{ name: "Champion Maximus", profileUrl: "#max-profile" }, { name: "Duchess Penelope", profileUrl: "#penny-profile" }], expectedDate: "August 15, 2025", geneticSummary: "Expecting fawn and white pups. Low COI.", status: "Available" },
    { id: "litter2", parents: [{ name: "Sir Reginald", profileUrl: "#reggie-profile" }, { name: "Lady Clementine", profileUrl: "#clem-profile" }], expectedDate: "October 01, 2025", geneticSummary: "Potential for brindle and piebald. Excellent temperaments expected.", status: "Reserved" }
];

const sampleTestimonials: Testimonial[] = [
    { id: "t1", quote: "The puppy we got from Legacy Kennel is the best dog we've ever owned. Healthy, smart, and so loving!", author: "The Smith Family", photoUrl: "https://via.placeholder.com/80/FFA500/FFFFFF?text=S" },
    { id: "t2", quote: "Professional and knowledgeable breeders. They truly care about their dogs and the breed. Highly recommend!", author: "Dr. Amanda Chen", photoUrl: "https://via.placeholder.com/80/008080/FFFFFF?text=AC" }
];

const sampleServices: Service[] = [
    { name: "Artificial Insemination (AI)", description: "Experienced AI services including TCI and surgical.", price: "Inquire" },
    { name: "Progesterone Testing", description: "In-house testing for accurate breeding timing.", price: "$75 per test" },
    { name: "Ultrasound Confirmation", description: "Pregnancy confirmation via ultrasound.", price: "$100" }
];

function MyPageComponent() {
    const handleStudSubmit = async (data) => { console.log("Stud Inquiry:", data); alert('Stud inquiry received!'); };
    const handleContactSubmit = async (data) => { console.log("Contact Form:", data); alert('Contact message received!'); };

    return (
        <ProfessionalBreederTemplate
            colorScheme="classic" // Try "modern" or "warm"
            kennel={sampleKennelData}
            featuredDogs={sampleFeaturedDogs}
            studDogs={sampleStudDogs}
            breedingPhilosophy={samplePhilosophy}
            upcomingLitters={sampleLitters}
            testimonials={sampleTestimonials}
            services={sampleServices}
            // reproductiveCalendarUrl="YOUR_GOOGLE_CALENDAR_EMBED_URL" // Optional
            onStudInquirySubmit={handleStudSubmit}
            onContactSubmit={handleContactSubmit}
            privacyPolicyUrl="/privacy-policy-sample"
                    />
    );
}
*/
