import { GeneticMarker, HealthMarker } from "@/types";

interface ParsedDNATest {
  markers: GeneticMarker[];
  healthMarkers: HealthMarker[];
}

/**
 * Parse DNA test results from various providers
 */
export async function parseDNATestFile(
  file: File,
  provider: string
): Promise<ParsedDNATest> {
  const fileContent = await readFileAsText(file);
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  switch (provider) {
    case "Embark":
      return parseEmbarkResults(fileContent, fileExtension);
    case "AnimalGenetics":
      return parseAnimalGeneticsResults(fileContent, fileExtension);
    default:
      return parseGenericResults(fileContent, fileExtension);
  }
}

/**
 * Read file content as text
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Parse Embark DNA test results
 */
function parseEmbarkResults(
  fileContent: string,
  fileExtension?: string
): ParsedDNATest {
  // This would contain actual parsing logic for Embark's format
  // For now, we'll return mock data
  
  const markers: GeneticMarker[] = [
    { locus: "A Locus", alleles: ["at", "at"], description: "Tan points" },
    { locus: "B Locus", alleles: ["B", "b"], description: "Carrier for chocolate/liver" },
    { locus: "D Locus", alleles: ["D", "d"], description: "Carrier for dilution" },
    { locus: "E Locus", alleles: ["E", "E"], description: "No masking" },
    { locus: "K Locus", alleles: ["KB", "ky"], description: "Dominant black carrier" },
  ];

  const healthMarkers: HealthMarker[] = [
    { condition: "Hip Dysplasia", status: "Clear" },
    { condition: "Degenerative Myelopathy", status: "Clear" },
    { condition: "Exercise-Induced Collapse", status: "Carrier" },
    { condition: "Progressive Retinal Atrophy", status: "Clear" },
  ];

  return { markers, healthMarkers };
}

/**
 * Parse Animal Genetics DNA test results
 */
function parseAnimalGeneticsResults(
  fileContent: string,
  fileExtension?: string
): ParsedDNATest {
  // This would contain actual parsing logic for Animal Genetics' format
  // For now, we'll return mock data
  
  const markers: GeneticMarker[] = [
    { locus: "A Locus", alleles: ["ay", "at"], description: "Sable with tan points" },
    { locus: "B Locus", alleles: ["B", "B"], description: "No chocolate/liver" },
    { locus: "D Locus", alleles: ["d", "d"], description: "Blue/dilute" },
    { locus: "E Locus", alleles: ["E", "e"], description: "Mask carrier" },
    { locus: "S Locus", alleles: ["S", "sp"], description: "Piebald carrier" },
  ];

  const healthMarkers: HealthMarker[] = [
    { condition: "Multidrug Resistance 1", status: "Clear" },
    { condition: "Hyperuricosuria", status: "Clear" },
    { condition: "Collie Eye Anomaly", status: "Clear" },
    { condition: "Degenerative Myelopathy", status: "Clear" },
  ];

  return { markers, healthMarkers };
}

/**
 * Parse generic DNA test results
 */
function parseGenericResults(
  fileContent: string,
  fileExtension?: string
): ParsedDNATest {
  // This would attempt to parse a generic format
  // For now, we'll return basic mock data
  
  const markers: GeneticMarker[] = [
    { locus: "Coat Color", alleles: ["Unknown", "Unknown"], description: "Color genes detected" },
    { locus: "Coat Type", alleles: ["Unknown", "Unknown"], description: "Coat type genes detected" },
  ];

  const healthMarkers: HealthMarker[] = [
    { condition: "General Health Panel", status: "Clear" },
  ];

  return { markers, healthMarkers };
}
