import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ProfessionalBreederTemplate from "@/components/website-builder/ProfessionalBreederTemplate";
import ShowKennelTemplate from "@/components/website-builder/ShowKennelTemplate";
import FamilyBreederTemplate from "@/components/website-builder/FamilyBreederTemplate";
import MultiServiceKennelTemplate from "@/components/website-builder/MultiServiceKennelTemplate";
import { mapKennelDataToTemplateProps } from "@/utils/kennelSiteMapper";

// This is a dynamic route that will handle all public kennel site requests
export default async function KennelSitePage({ params }: { params: { slug?: string[] } }) {
  const headersList = headers();
  const subdomain = headersList.get("x-subdomain");
  
  // If no subdomain is present, this is a request to the main app
  if (!subdomain) {
    // This is the main app, but we're in a catch-all route
    // We should return a 404 to avoid conflicts with the root route
    return notFound();
  }
  
  try {
    // Initialize Supabase client
    const supabase = createServerComponentClient({ cookies });
    
    // Query the database for the kennel website data
    const { data: kennelWebsite, error } = await supabase
      .from("kennel_websites")
      .select(`
        *,
        breeder:breeder_id(
          id,
          first_name,
          last_name
        )
      `)
      .eq("site_name", subdomain)
      .single();
    
    if (error || !kennelWebsite) {
      console.error("Error fetching kennel website:", error);
      return notFound();
    }
    
    // If the website is not published, return a 404
    if (!kennelWebsite.published) {
      return notFound();
    }
    
    // Fetch additional data needed for the template
    const breederId = kennelWebsite.breeder_id;
    
    // Fetch dogs owned by the breeder
    const { data: dogs, error: dogsError } = await supabase
      .from("dogs")
      .select("*")
      .eq("owner_id", breederId);
    
    if (dogsError) {
      console.error("Error fetching dogs:", dogsError);
    }
    
    // Fetch stud dogs
    const { data: studDogs, error: studDogsError } = await supabase
      .from("dogs")
      .select("*")
      .eq("owner_id", breederId)
      .eq("is_stud", true);
    
    if (studDogsError) {
      console.error("Error fetching stud dogs:", studDogsError);
    }
    
    // Fetch litters
    const { data: litters, error: littersError } = await supabase
      .from("litters")
      .select("*")
      .eq("breeder_id", breederId);
    
    if (littersError) {
      console.error("Error fetching litters:", littersError);
    }
    
    // Prepare the data for the template
    const kennelData = {
      kennelWebsite,
      dogs: dogs || [],
      studDogs: studDogs || [],
      litters: litters || [],
    };
    
    // Map the data to the appropriate template props
    const templateProps = mapKennelDataToTemplateProps(kennelData);
    
    // Render the appropriate template based on the template type
    switch (kennelWebsite.template_type) {
      case "professional-breeder":
        return <ProfessionalBreederTemplate {...templateProps} />;
      case "show-kennel":
        return <ShowKennelTemplate {...templateProps} />;
      case "family-breeder":
        return <FamilyBreederTemplate {...templateProps} />;
      case "multi-service-kennel":
        return <MultiServiceKennelTemplate {...templateProps} />;
      default:
        // Default to professional breeder if template type is unknown
        return <ProfessionalBreederTemplate {...templateProps} />;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return notFound();
  }
}
