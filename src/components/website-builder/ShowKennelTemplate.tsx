import React from "react";

/**
 * ShowKennelTemplate
 * 
 * Landing page template for competition-oriented kennels with champion dogs.
 * 
 * Integration Points:
 * - All sections marked for dynamic data integration.
 * - Replace sample data with real data from the PetPals Dog Hub app as integration progresses.
 * 
 * Color Scheme:
 * - Accepts a colorScheme prop: "bold" | "elegant" | "subtle"
 * - Applies color classes based on selection.
 */

type ColorScheme = "bold" | "elegant" | "subtle";

interface KennelInfo {
  name: string;
  logoUrl?: string;
  focus: string;
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
  titles: string[];
  breed: string;
  gender: string;
  dob: string;
  profileUrl?: string;
  videoUrl?: string;
}

interface Achievement {
  id: string;
  title: string;
  year: string;
  event: string;
  dogName: string;
  dogProfileUrl?: string;
}

interface ShowEvent {
  id: string;
  date: string;
  location: string;
  event: string;
  participatingDogs: { name: string; profileUrl?: string }[];
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  url?: string;
  date: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  photoUrl?: string;
}

interface ShowKennelTemplateProps {
  colorScheme?: ColorScheme;
  kennel: KennelInfo;
  featuredChampions: DogProfile[];
  achievements: Achievement[];
  showEvents: ShowEvent[];
  championGallery: DogProfile[];
  showResults: BlogPost[];
  championVideos: { id: string; title: string; videoUrl: string; dogName: string }[];
  judgeTestimonials: Testimonial[];
  studDogs: DogProfile[];
}

/**
 * Color scheme mapping for easy extension.
 */
const colorSchemes = {
  bold: {
    bg: "bg-black",
    primary: "text-red-600",
    accent: "text-white",
    button: "bg-red-600 text-white hover:bg-black border border-red-600",
    section: "bg-gray-900",
  },
  elegant: {
    bg: "bg-purple-900",
    primary: "text-silver-200",
    accent: "text-purple-300",
    button: "bg-silver-200 text-purple-900 hover:bg-purple-700",
    section: "bg-purple-800",
  },
  subtle: {
    bg: "bg-gray-50",
    primary: "text-blue-900",
    accent: "text-gray-600",
    button: "bg-blue-900 text-white hover:bg-gray-600",
    section: "bg-blue-50",
  },
};

/**
 * Main Show Kennel Template Component
 */
const ShowKennelTemplate: React.FC<ShowKennelTemplateProps> = ({
  colorScheme = "bold",
  kennel,
  featuredChampions,
  achievements,
  showEvents,
  championGallery,
  showResults,
  championVideos,
  judgeTestimonials,
  studDogs,
}) => {
  const colors = colorSchemes[colorScheme];

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
            <h1 className={`text-3xl md:text-5xl font-bold uppercase ${colors.primary}`}>
              {kennel.name}: Breeding Champions
            </h1>
            <p className="mt-2 text-lg md:text-xl text-white">
              {kennel.focus}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {/* Dynamic Achievements Showcase (rotating or static for now) */}
              {achievements.slice(0, 3).map((ach) => (
                <span
                  key={ach.id}
                  className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {ach.title} ({ach.year})
                </span>
              ))}
            </div>
            <a
              href="#show-inquiry"
              className={`inline-block mt-6 px-6 py-3 rounded-lg font-semibold transition ${colors.button}`}
            >
              Inquire About Show Prospects
            </a>
          </div>
          {/* Featured Champion Image/Video (placeholder) */}
          <div className="hidden md:block w-64">
            {featuredChampions[0]?.videoUrl ? (
              <video
                src={featuredChampions[0].videoUrl}
                controls
                className="w-full h-48 object-cover rounded-lg shadow"
              />
            ) : (
              <img
                src={featuredChampions[0]?.imageUrl}
                alt={featuredChampions[0]?.name}
                className="w-full h-48 object-cover rounded-lg shadow"
              />
            )}
            <div className="mt-2 text-center font-medium text-white">
              {featuredChampions[0]?.name}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Showcase */}
      <section className="w-full py-12 px-4" id="achievements">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Our Championship Legacy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((ach) => (
              <div key={ach.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <div className="font-semibold text-lg text-red-700">{ach.title}</div>
                <div className="text-sm text-gray-600">{ach.event} ({ach.year})</div>
                <a
                  href={ach.dogProfileUrl || "#"}
                  className="mt-2 text-blue-600 underline text-xs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ach.dogName}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Show Calendar */}
      <section className={`w-full py-12 px-4 ${colors.section}`} id="show-calendar">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Upcoming Show Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow p-4">
                <div className="font-semibold">{event.event}</div>
                <div className="text-sm text-gray-600">{event.date} — {event.location}</div>
                <div className="mt-2 text-xs">
                  Participating Dogs:{" "}
                  {event.participatingDogs.map((dog, i) => (
                    <span key={i}>
                      <a
                        href={dog.profileUrl || "#"}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {dog.name}
                      </a>
                      {i < event.participatingDogs.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Champions Gallery */}
      <section className="w-full py-12 px-4" id="champion-gallery">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Meet Our Champions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {championGallery.map((dog) => (
              <div key={dog.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <img
                  src={dog.imageUrl}
                  alt={dog.name}
                  className="w-24 h-24 object-cover rounded-full mb-2"
                />
                <div className="font-semibold text-lg">{dog.name}</div>
                <div className="text-xs text-gray-600">{dog.titles.join(", ")}</div>
                <a
                  href={dog.profileUrl || "#"}
                  className="mt-2 text-blue-600 underline text-xs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Profile
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Show Results Blog */}
      <section className={`w-full py-12 px-4 ${colors.section}`} id="show-results">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Latest Show Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {showResults.map((post) => (
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
                <div className="text-xs text-gray-500">{post.date}</div>
                <div className="text-sm text-gray-600 mt-1">{post.excerpt}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Video Integration */}
      <section className="w-full py-12 px-4" id="champion-videos">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            See Our Dogs in Motion
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {championVideos.map((vid) => (
              <div key={vid.id} className="bg-white rounded-lg shadow p-4">
                <div className="font-semibold mb-2">{vid.title} — {vid.dogName}</div>
                <video
                  src={vid.videoUrl}
                  controls
                  className="w-full h-48 object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Judge Testimonials */}
      <section className={`w-full py-12 px-4 ${colors.section}`} id="judge-testimonials">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            What the Judges Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {judgeTestimonials.map((t) => (
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

      {/* Stud Services (Competition Pedigrees) */}
      <section className="w-full py-12 px-4" id="stud-services">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Stud Dogs with Winning Pedigrees
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studDogs.map((dog) => (
              <div key={dog.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <img
                  src={dog.imageUrl}
                  alt={dog.name}
                  className="w-28 h-28 object-cover rounded-full mb-2"
                />
                <div className="font-semibold text-lg">{dog.name}</div>
                <div className="text-xs text-gray-600">{dog.titles.join(", ")}</div>
                <a
                  href={dog.profileUrl || "#"}
                  className="mt-2 text-blue-600 underline text-xs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Profile
                </a>
                {dog.videoUrl && (
                  <a
                    href={dog.videoUrl}
                    className="text-red-600 underline text-xs mt-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch in Ring
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form (Show Prospects) */}
      <section className={`w-full py-12 px-4 ${colors.section}`} id="show-inquiry">
        <div className="max-w-lg mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${colors.primary}`}>
            Show Prospect Inquiry
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
              placeholder="Show Experience"
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
          <div className="mt-6 text-center text-gray-300">
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
                  className="text-blue-400 hover:underline"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-gray-400 border-t mt-8">
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

export default ShowKennelTemplate;

/**
 * SAMPLE USAGE (for development/testing)
 * 
 * <ShowKennelTemplate
 *   colorScheme="bold"
 *   kennel={{
 *     name: "Apex Kennels",
 *     logoUrl: "/logos/apex.png",
 *     focus: "Home to multiple national and international champions in the Doberman breed.",
 *     about: "Apex Kennels is dedicated to breeding and showing top-quality Dobermans.",
 *     contact: { email: "info@apexkennels.com", phone: "555-111-2222", address: "789 Show Lane, City, State" },
 *     socialLinks: [
 *       { platform: "Facebook", url: "https://facebook.com/apexkennels" },
 *       { platform: "Instagram", url: "https://instagram.com/apexkennels" }
 *     ],
 *     breeds: ["Doberman"]
 *   }}
 *   featuredChampions={[
 *     { id: "1", name: "Ch. Titan", imageUrl: "/dogs/titan.jpg", titles: ["BIS", "GCH"], breed: "Doberman", gender: "M", dob: "2019-05-01", profileUrl: "#", videoUrl: "#" }
 *   ]}
 *   achievements={[
 *     { id: "1", title: "Best in Show", year: "2024", event: "National Specialty", dogName: "Ch. Titan", dogProfileUrl: "#" }
 *   ]}
 *   showEvents={[
 *     { id: "1", date: "2025-05-10", location: "New York", event: "Spring Classic", participatingDogs: [{ name: "Ch. Titan", profileUrl: "#" }] }
 *   ]}
 *   championGallery={[
 *     { id: "1", name: "Ch. Titan", imageUrl: "/dogs/titan.jpg", titles: ["BIS", "GCH"], breed: "Doberman", gender: "M", dob: "2019-05-01", profileUrl: "#", videoUrl: "#" }
 *   ]}
 *   showResults={[
 *     { id: "1", title: "Titan Wins Best in Show", excerpt: "Titan took top honors at the National Specialty.", imageUrl: "/blog/titan-bis.jpg", url: "#", date: "2024-11-01" }
 *   ]}
 *   championVideos={[
 *     { id: "1", title: "Titan in the Ring", videoUrl: "#", dogName: "Ch. Titan" }
 *   ]}
 *   judgeTestimonials={[
 *     { id: "1", quote: "Titan exemplifies the breed standard.", author: "Judge Smith", photoUrl: "/avatars/judge1.png" }
 *   ]}
 *   studDogs={[
 *     { id: "1", name: "Ch. Titan", imageUrl: "/dogs/titan.jpg", titles: ["BIS", "GCH"], breed: "Doberman", gender: "M", dob: "2019-05-01", profileUrl: "#", videoUrl: "#" }
 *   ]}
 * />
 */
