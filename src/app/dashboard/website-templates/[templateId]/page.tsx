"use client";
import React from "react";
import { useParams } from "next/navigation";
import ProfessionalBreederTemplate from "@/components/website-builder/ProfessionalBreederTemplate";
import ShowKennelTemplate from "@/components/website-builder/ShowKennelTemplate";
import FamilyBreederTemplate from "@/components/website-builder/FamilyBreederTemplate";
import MultiServiceKennelTemplate from "@/components/website-builder/MultiServiceKennelTemplate";

// Sample data for each template (replace with real data integration)
const SAMPLE_DATA = {
  "professional-breeder": {
    component: ProfessionalBreederTemplate,
    props: {
      colorScheme: "classic",
      kennel: {
        name: "The Legacy Kennel",
        logoUrl: "/logos/asana.png",
        mission: "Dedicated to Breeding Excellence",
        about: "Producing exceptional Bulldogs with a focus on health, temperament, and breed standards.",
        contact: { email: "info@legacykennel.com", phone: "555-123-4567", address: "123 Kennel Lane, City, State" },
        socialLinks: [
          { platform: "Facebook", url: "https://facebook.com/legacykennel" },
          { platform: "Instagram", url: "https://instagram.com/legacykennel" }
        ],
        breeds: ["Bulldog", "French Bulldog"]
      },
      featuredDogs: [
        { id: "1", name: "Champion Max", imageUrl: "/dogs/dog-1744345833521-658.jpg", breed: "Bulldog", gender: "M", dob: "2020-01-01", isStud: true, achievements: ["Grand Champion", "Best in Show"] }
      ],
      studDogs: [
        { id: "1", name: "Champion Max", imageUrl: "/dogs/dog-1744345833521-658.jpg", breed: "Bulldog", gender: "M", dob: "2020-01-01", isStud: true, achievements: ["Grand Champion", "Best in Show"], studFee: "$2000", profileUrl: "#" }
      ],
      breedingPhilosophy: "We believe in responsible breeding...",
      upcomingLitters: [
        { id: "1", parents: [{ name: "Champion Max", profileUrl: "#" }, { name: "Lady Bella", profileUrl: "#" }], expectedDate: "2025-06-01", geneticSummary: "Fawn, Brindle, Low COI", status: "Available" }
      ],
      testimonials: [
        { id: "1", quote: "Our puppy is amazing!", author: "Jane D.", photoUrl: "/avatars/avatar style 2/avatar-1.png" }
      ],
      services: [
        { name: "Artificial Insemination", description: "Professional AI services for your breeding program." },
        { name: "Progesterone Testing", description: "Accurate timing for optimal breeding results." }
      ],
      reproductiveCalendarUrl: "https://calendar.google.com/calendar/embed?src=your_calendar_id"
    }
  },
  "show-kennel": {
    component: ShowKennelTemplate,
    props: {
      colorScheme: "bold",
      kennel: {
        name: "Apex Kennels",
        logoUrl: "/logos/apex.png",
        focus: "Home to multiple national and international champions in the Doberman breed.",
        about: "Apex Kennels is dedicated to breeding and showing top-quality Dobermans.",
        contact: { email: "info@apexkennels.com", phone: "555-111-2222", address: "789 Show Lane, City, State" },
        socialLinks: [
          { platform: "Facebook", url: "https://facebook.com/apexkennels" },
          { platform: "Instagram", url: "https://instagram.com/apexkennels" }
        ],
        breeds: ["Doberman"]
      },
      featuredChampions: [
        { id: "1", name: "Ch. Titan", imageUrl: "/dogs/titan.jpg", titles: ["BIS", "GCH"], breed: "Doberman", gender: "M", dob: "2019-05-01", profileUrl: "#", videoUrl: "#" }
      ],
      achievements: [
        { id: "1", title: "Best in Show", year: "2024", event: "National Specialty", dogName: "Ch. Titan", dogProfileUrl: "#" }
      ],
      showEvents: [
        { id: "1", date: "2025-05-10", location: "New York", event: "Spring Classic", participatingDogs: [{ name: "Ch. Titan", profileUrl: "#" }] }
      ],
      championGallery: [
        { id: "1", name: "Ch. Titan", imageUrl: "/dogs/titan.jpg", titles: ["BIS", "GCH"], breed: "Doberman", gender: "M", dob: "2019-05-01", profileUrl: "#", videoUrl: "#" }
      ],
      showResults: [
        { id: "1", title: "Titan Wins Best in Show", excerpt: "Titan took top honors at the National Specialty.", imageUrl: "/blog/titan-bis.jpg", url: "#", date: "2024-11-01" }
      ],
      championVideos: [
        { id: "1", title: "Titan in the Ring", videoUrl: "#", dogName: "Ch. Titan" }
      ],
      judgeTestimonials: [
        { id: "1", quote: "Titan exemplifies the breed standard.", author: "Judge Smith", photoUrl: "/avatars/judge1.png" }
      ],
      studDogs: [
        { id: "1", name: "Ch. Titan", imageUrl: "/dogs/titan.jpg", titles: ["BIS", "GCH"], breed: "Doberman", gender: "M", dob: "2019-05-01", profileUrl: "#", videoUrl: "#" }
      ]
    }
  },
  "family-breeder": {
    component: FamilyBreederTemplate,
    props: {
      colorScheme: "friendly",
      kennel: {
        name: "Happy Paws Family",
        logoUrl: "/logos/happy-paws.png",
        about: "We are a small, home-based breeder raising puppies as part of our family.",
        contact: { email: "hello@happypaws.com", phone: "555-987-6543", address: "456 Puppy Lane, Town, State" },
        socialLinks: [
          { platform: "Facebook", url: "https://facebook.com/happypaws" },
          { platform: "Instagram", url: "https://instagram.com/happypaws" }
        ],
        breeds: ["Golden Retriever"]
      },
      dogs: [
        { id: "1", name: "Bella", imageUrl: "/dogs/bella.jpg", bio: "Sweet and gentle, loves kids.", breed: "Golden Retriever", gender: "F", dob: "2021-03-01", profileUrl: "#", healthTestingUrl: "#" }
      ],
      puppyGallery: ["/puppies/puppy1.jpg", "/puppies/puppy2.jpg"],
      applicationSteps: [
        "Submit your puppy application.",
        "Schedule a phone interview.",
        "Reserve your puppy with a deposit.",
        "Puppy selection and go-home day!"
      ],
      applicationFormUrl: "https://yourform.com",
      puppyPackageInfo: "Health check, first vaccinations, puppy pack, and lifetime support.",
      blogPosts: [
        { id: "1", title: "Puppy Socialization Tips", excerpt: "How we help puppies adjust to new homes.", imageUrl: "/blog/socialization.jpg", url: "#" }
      ],
      healthTestingInfo: "All our breeding dogs are health tested for common breed issues.",
      healthTestingUrl: "#",
      testimonials: [
        { id: "1", quote: "Our puppy is the sweetest addition to our family!", author: "The Smiths", photoUrl: "/avatars/family1.png" }
      ],
      socializationInfo: "Our puppies are raised in our home, exposed to children, other pets, and everyday life."
    }
  },
  "multi-service-kennel": {
    component: MultiServiceKennelTemplate,
    props: {
      colorScheme: "professional",
      kennel: {
        name: "Canine Care Center",
        logoUrl: "/logos/canine-care.png",
        about: "Your one-stop destination for all things canine.",
        contact: { email: "info@caninecare.com", phone: "555-222-3333", address: "101 Dogwood Ave, City, State" },
        socialLinks: [
          { platform: "Facebook", url: "https://facebook.com/caninecare" },
          { platform: "Instagram", url: "https://instagram.com/caninecare" }
        ],
        breeds: ["Labrador", "Poodle"],
        virtualTourUrl: "#"
      },
      services: [
        { id: "1", name: "Breeding", description: "Ethical breeding of top-quality dogs.", imageUrl: "/services/breeding.jpg", pricing: "$2000+", pageUrl: "#breeding", bookingUrl: "#" },
        { id: "2", name: "Training", description: "Obedience, agility, and behavior modification.", imageUrl: "/services/training.jpg", pricing: "$100/session", pageUrl: "#training", bookingUrl: "#" },
        { id: "3", name: "Boarding", description: "Comfortable, safe boarding facilities.", imageUrl: "/services/boarding.jpg", pricing: "$50/night", pageUrl: "#boarding", bookingUrl: "#" }
      ],
      staff: [
        { id: "1", name: "Jane Trainer", photoUrl: "/staff/jane.jpg", bio: "Certified dog trainer with 10+ years experience.", role: "Head Trainer" }
      ],
      pricingPackages: [
        { id: "1", name: "Boarding Package", description: "7 nights, daily walks, and playtime.", price: "$300" }
      ],
      clientPortalUrl: "#",
      bookingSystemEmbedUrl: "#"
    }
  }
};

export default function TemplatePage() {
  const params = useParams();
  const templateId = params?.templateId as string;
  const template = SAMPLE_DATA[templateId];

  if (!template) return <div>Template not found.</div>;

  const TemplateComponent = template.component;
  return <TemplateComponent {...template.props} />;
}
