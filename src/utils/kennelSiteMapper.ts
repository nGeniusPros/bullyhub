/**
 * Utility functions to map database kennel data to template props
 */

// Map kennel website data to the appropriate template props
export function mapKennelDataToTemplateProps(kennelData: any) {
  const { kennelWebsite, dogs, studDogs, litters } = kennelData;
  
  // Base kennel info common to all templates
  const kennelInfo = {
    name: kennelWebsite.site_name,
    logoUrl: kennelWebsite.logo_url,
    about: kennelWebsite.content?.about || "",
    contact: {
      email: kennelWebsite.content?.contact?.email || "",
      phone: kennelWebsite.content?.contact?.phone || "",
      address: kennelWebsite.content?.contact?.address || "",
    },
    socialLinks: kennelWebsite.content?.socialLinks || [],
    breeds: kennelWebsite.content?.breeds || [],
  };
  
  // Map dogs to the format expected by templates
  const mappedDogs = dogs.map((dog: any) => ({
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    dateOfBirth: dog.date_of_birth,
    color: dog.color,
    imageUrl: dog.profile_image_url || "/images/default-dog.jpg",
    description: dog.description || "",
    titles: dog.titles || [],
    isStud: dog.is_stud || false,
  }));
  
  // Map stud dogs
  const mappedStudDogs = studDogs.map((dog: any) => ({
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    dateOfBirth: dog.date_of_birth,
    color: dog.color,
    imageUrl: dog.profile_image_url || "/images/default-dog.jpg",
    description: dog.description || "",
    titles: dog.titles || [],
    studFee: dog.stud_fee || "",
    healthTesting: dog.health_testing || [],
  }));
  
  // Map litters
  const mappedLitters = litters.map((litter: any) => ({
    id: litter.id,
    sire: litter.sire_name || "Unknown",
    dam: litter.dam_name || "Unknown",
    expectedDate: litter.expected_date || litter.whelping_date,
    puppyCount: litter.puppy_count || 0,
    available: litter.available || false,
    description: litter.description || "",
    imageUrl: litter.image_url || "/images/default-litter.jpg",
  }));
  
  // Template-specific props
  switch (kennelWebsite.template_type) {
    case "professional-breeder":
      return {
        colorScheme: kennelWebsite.color_scheme?.scheme || "classic",
        kennel: {
          ...kennelInfo,
          mission: kennelWebsite.content?.mission || "Dedicated to breeding excellence",
        },
        featuredDogs: mappedDogs.filter((dog: any) => 
          kennelWebsite.content?.featuredDogs?.includes(dog.id)
        ),
        studDogs: mappedStudDogs,
        breedingPhilosophy: kennelWebsite.content?.breedingPhilosophy || "",
        upcomingLitters: mappedLitters,
        testimonials: kennelWebsite.content?.testimonials || [],
        services: kennelWebsite.content?.services || [],
        reproductiveCalendarUrl: kennelWebsite.content?.reproductiveCalendarUrl,
        onStudInquirySubmit: async () => {},
        onContactSubmit: async () => {},
        privacyPolicyUrl: kennelWebsite.content?.privacyPolicyUrl,
      };
      
    case "show-kennel":
      return {
        colorScheme: kennelWebsite.color_scheme?.scheme || "bold",
        kennel: {
          ...kennelInfo,
          focus: kennelWebsite.content?.focus || "Championship breeding program",
        },
        featuredChampions: mappedDogs.filter((dog: any) => 
          dog.titles && dog.titles.length > 0
        ),
        achievements: kennelWebsite.content?.achievements || [],
        showEvents: kennelWebsite.content?.showEvents || [],
        championGallery: kennelWebsite.content?.championGallery || [],
        showResults: kennelWebsite.content?.showResults || [],
        championVideos: kennelWebsite.content?.championVideos || [],
        judgeTestimonials: kennelWebsite.content?.judgeTestimonials || [],
        studDogs: mappedStudDogs,
      };
      
    case "family-breeder":
      return {
        colorScheme: kennelWebsite.color_scheme?.scheme || "friendly",
        kennel: kennelInfo,
        dogs: mappedDogs,
        puppyGallery: kennelWebsite.content?.puppyGallery || [],
        applicationSteps: kennelWebsite.content?.applicationSteps || [],
        applicationFormUrl: kennelWebsite.content?.applicationFormUrl,
        puppyPackageInfo: kennelWebsite.content?.puppyPackageInfo || "",
        blogPosts: kennelWebsite.content?.blogPosts || [],
        healthTestingInfo: kennelWebsite.content?.healthTestingInfo || "",
        healthTestingUrl: kennelWebsite.content?.healthTestingUrl,
        testimonials: kennelWebsite.content?.testimonials || [],
        socializationInfo: kennelWebsite.content?.socializationInfo || "",
      };
      
    case "multi-service-kennel":
      return {
        colorScheme: kennelWebsite.color_scheme?.scheme || "professional",
        kennel: {
          ...kennelInfo,
          virtualTourUrl: kennelWebsite.content?.virtualTourUrl,
        },
        services: kennelWebsite.content?.services || [],
        staff: kennelWebsite.content?.staff || [],
        pricingPackages: kennelWebsite.content?.pricingPackages || [],
        clientPortalUrl: kennelWebsite.content?.clientPortalUrl,
        bookingSystemEmbedUrl: kennelWebsite.content?.bookingSystemEmbedUrl,
      };
      
    default:
      // Default to professional breeder if template type is unknown
      return {
        colorScheme: "classic",
        kennel: kennelInfo,
        featuredDogs: [],
        studDogs: [],
        breedingPhilosophy: "",
        upcomingLitters: [],
        testimonials: [],
        services: [],
        onStudInquirySubmit: async () => {},
        onContactSubmit: async () => {},
      };
  }
}
