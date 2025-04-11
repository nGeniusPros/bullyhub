// netlify/functions/breeding-program-compatibility.js
import { createClient } from '@supabase/supabase-js';
import { createResponse, handleOptions } from '../utils/cors-headers';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method Not Allowed' })
  }

  try {
    // Parse the incoming request body
    const data = JSON.parse(event.body);
    const { dogId, breedingProgramId } = data;

    if (!dogId || !breedingProgramId) {
      return createResponse(400, { error: 'Missing required fields' })
    }

    // Get dog details with health clearances and DNA tests
    const { data: dog, error: dogError } = await supabase
      .from('dogs')
      .select(`
        *,
        health_clearances(*),
        dna_tests:dna_test_results(
          id,
          provider,
          test_date,
          genetic_markers(id, locus, alleles, description),
          health_markers(id, condition, status)
        )
      `)
      .eq('id', dogId)
      .single();

    if (dogError) {
      console.error('Error fetching dog:', dogError);
      return createResponse(500, { error: 'Failed to fetch dog details' })
    }

    // Get breeding program details
    const { data: breedingProgram, error: programError } = await supabase
      .from('breeding_programs')
      .select('*')
      .eq('id', breedingProgramId)
      .single();

    if (programError) {
      console.error('Error fetching breeding program:', programError);
      return createResponse(500, { error: 'Failed to fetch breeding program details' })
    }

    // Get health testing requirements
    const { data: healthRequirements, error: requirementsError } = await supabase
      .from('health_testing_requirements')
      .select('*');

    if (requirementsError) {
      console.error('Error fetching health requirements:', requirementsError);
      // Continue with analysis even if we can't fetch requirements
    }

    // Analyze compatibility
    const compatibility = analyzeBreedingProgramCompatibility(dog, breedingProgram, healthRequirements || []);

    return {
      statusCode: 200,
      body: JSON.stringify(compatibility),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return createResponse(500, { error: 'Internal Server Error' });
  }
}

// Analyze if a dog meets the requirements for a breeding program
function analyzeBreedingProgramCompatibility(dog, breedingProgram, healthRequirements) {
  // Initialize compatibility result
  const compatibility = {
    dogId: dog.id,
    dogName: dog.name,
    breedingProgramId: breedingProgram.id,
    breedingProgramName: breedingProgram.name,
    overallCompatibility: 'Unknown',
    colorCompatibility: {
      compatible: false,
      details: ''
    },
    healthCompatibility: {
      compatible: false,
      missingTests: [],
      failedTests: []
    },
    ageCompatibility: {
      compatible: false,
      details: ''
    },
    recommendations: []
  };

  // Check color compatibility
  compatibility.colorCompatibility = checkColorCompatibility(dog, breedingProgram);

  // Check health compatibility
  compatibility.healthCompatibility = checkHealthCompatibility(dog, breedingProgram, healthRequirements);

  // Check age compatibility
  compatibility.ageCompatibility = checkAgeCompatibility(dog);

  // Determine overall compatibility
  if (compatibility.colorCompatibility.compatible && 
      compatibility.healthCompatibility.compatible && 
      compatibility.ageCompatibility.compatible) {
    compatibility.overallCompatibility = 'Fully Compatible';
  } else if (!compatibility.colorCompatibility.compatible && 
             !compatibility.healthCompatibility.compatible && 
             !compatibility.ageCompatibility.compatible) {
    compatibility.overallCompatibility = 'Not Compatible';
  } else {
    compatibility.overallCompatibility = 'Partially Compatible';
  }

  // Generate recommendations
  compatibility.recommendations = generateRecommendations(compatibility);

  return compatibility;
}

// Check if the dog's color is compatible with the breeding program
function checkColorCompatibility(dog, breedingProgram) {
  const dogColor = dog.color ? dog.color.toLowerCase() : '';
  const programColorFocus = breedingProgram.color_focus ? breedingProgram.color_focus.toLowerCase() : '';
  
  // Direct match
  if (dogColor === programColorFocus) {
    return {
      compatible: true,
      details: `${dog.name}'s color (${dog.color}) matches the breeding program's focus (${breedingProgram.color_focus}).`
    };
  }
  
  // Check for related colors
  const relatedColors = getRelatedColors(programColorFocus);
  if (relatedColors.includes(dogColor)) {
    return {
      compatible: true,
      details: `${dog.name}'s color (${dog.color}) is related to the breeding program's focus (${breedingProgram.color_focus}) and can contribute to the program.`
    };
  }
  
  // Check if the dog carries genes for the target color
  const carriesTargetColor = checkIfDogCarriesColor(dog, programColorFocus);
  if (carriesTargetColor) {
    return {
      compatible: true,
      details: `${dog.name} carries genes for ${breedingProgram.color_focus} and can contribute to the program.`
    };
  }
  
  // Not compatible
  return {
    compatible: false,
    details: `${dog.name}'s color (${dog.color}) does not match or contribute to the breeding program's focus (${breedingProgram.color_focus}).`
  };
}

// Check if the dog meets the health requirements for the breeding program
function checkHealthCompatibility(dog, breedingProgram, healthRequirements) {
  const result = {
    compatible: false,
    missingTests: [],
    failedTests: []
  };
  
  // Get required health tests for this breeding program
  const requiredTests = [];
  
  // Add tests from breeding program health protocols
  if (breedingProgram.health_protocols && Array.isArray(breedingProgram.health_protocols)) {
    breedingProgram.health_protocols.forEach(protocol => {
      if (protocol.required) {
        requiredTests.push(protocol.protocolName);
      }
    });
  }
  
  // Add mandatory tests from health requirements
  healthRequirements.forEach(requirement => {
    if (requirement.is_mandatory) {
      // Check if the test applies to this dog's color
      const applicableToAllColors = !requirement.applicable_colors || requirement.applicable_colors.length === 0;
      const applicableToThisColor = requirement.applicable_colors && 
                                   requirement.applicable_colors.some(color => 
                                     dog.color && dog.color.toLowerCase().includes(color.toLowerCase()));
      
      if (applicableToAllColors || applicableToThisColor) {
        requiredTests.push(requirement.test_name);
      }
    }
  });
  
  // Remove duplicates
  const uniqueRequiredTests = [...new Set(requiredTests)];
  
  // Check if the dog has all required tests
  const dogTests = new Set();
  if (dog.health_clearances && Array.isArray(dog.health_clearances)) {
    dog.health_clearances.forEach(clearance => {
      dogTests.add(clearance.test);
      
      // Check if the test was passed
      if (clearance.status !== 'passed') {
        result.failedTests.push({
          test: clearance.test,
          result: clearance.result,
          status: clearance.status
        })
      }
    }
    );
  }
  
  // Find missing tests
  uniqueRequiredTests.forEach(test => {
    if (!dogTests.has(test)) {
      result.missingTests.push(test);
    }
  })
  
  // Dog is health compatible if there are no missing or failed tests
  result.compatible = result.missingTests.length === 0 && result.failedTests.length === 0;
  
  return result;
}

// Check if the dog's age is appropriate for breeding
function checkAgeCompatibility(dog) {
  if (!dog.date_of_birth) {
    return {
      compatible: false,
      details: 'Dog\'s date of birth is unknown.'
    };
  }
  
  const birthDate = new Date(dog.date_of_birth);
  const today = new Date();
  
  // Calculate age in months
  const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                      (today.getMonth() - birthDate.getMonth());
  
  // Minimum breeding age (typically 18-24 months for responsible breeding)
  const minBreedingAge = 18;
  
  // Maximum breeding age (varies by breed and gender, typically 5-7 years)
  const maxBreedingAge = dog.gender === 'female' ? 60 : 84; // 5 years for females, 7 for males
  
  if (ageInMonths < minBreedingAge) {
    return {
      compatible: false,
      details: `${dog.name} is too young for breeding. Current age: ${Math.floor(ageInMonths / 12)} years and ${ageInMonths % 12} months. Minimum recommended age: ${Math.floor(minBreedingAge / 12)} years and ${minBreedingAge % 12} months.`
    };
  } else if (ageInMonths > maxBreedingAge) {
    return {
      compatible: false,
      details: `${dog.name} is too old for breeding. Current age: ${Math.floor(ageInMonths / 12)} years and ${ageInMonths % 12} months. Maximum recommended age: ${Math.floor(maxBreedingAge / 12)} years and ${maxBreedingAge % 12} months.`
    };
  } else {
    return {
      compatible: true,
      details: `${dog.name}'s age (${Math.floor(ageInMonths / 12)} years and ${ageInMonths % 12} months) is appropriate for breeding.`
    };
  }
}

// Generate recommendations based on compatibility analysis
function generateRecommendations(compatibility) {
  const recommendations = [];
  
  // Color recommendations
  if (!compatibility.colorCompatibility.compatible) {
    recommendations.push('Consider a different breeding program that matches this dog\'s color genetics.');
    recommendations.push('DNA testing for color genes could provide more information about this dog\'s genetic potential.');
  }
  
  // Health recommendations
  if (compatibility.healthCompatibility.missingTests.length > 0) {
    recommendations.push(`Complete the following health tests: ${compatibility.healthCompatibility.missingTests.join(', ')}.`);
  }
  
  if (compatibility.healthCompatibility.failedTests.length > 0) {
    recommendations.push('This dog has failed some required health tests and may not be suitable for this breeding program.');
  }
  
  // Age recommendations
  if (!compatibility.ageCompatibility.compatible) {
    if (compatibility.ageCompatibility.details.includes('too young')) {
      recommendations.push('Wait until the dog reaches the minimum breeding age before including in this program.');
    } else if (compatibility.ageCompatibility.details.includes('too old')) {
      recommendations.push('Consider retiring this dog from breeding.');
    }
  }
  
  // If fully compatible
  if (compatibility.overallCompatibility === 'Fully Compatible') {
    recommendations.push('This dog is fully compatible with the breeding program and can be included immediately.');
  }
  // If partially compatible
  else if (compatibility.overallCompatibility === 'Partially Compatible') {
    recommendations.push('Address the noted issues to make this dog fully compatible with the breeding program.');
  }
  
  return recommendations;
}

// Helper function to get related colors
function getRelatedColors(color) {
  const colorMap = {
    'blue': ['blue fawn', 'blue brindle', 'blue pied', 'blue sable'],
    'fawn': ['cream', 'fawn pied', 'fawn brindle', 'blue fawn'],
    'brindle': ['brindle pied', 'blue brindle', 'fawn brindle', 'tiger brindle'],
    'black': ['black and tan', 'black pied', 'seal'],
    'chocolate': ['chocolate and tan', 'chocolate pied', 'lilac'],
    'pied': ['fawn pied', 'brindle pied', 'blue pied', 'black pied', 'chocolate pied'],
    'merle': ['blue merle', 'chocolate merle', 'fawn merle', 'brindle merle'],
    'sable': ['blue sable', 'fawn sable']
  };
  
  return colorMap[color.toLowerCase()] || [];
}

// Helper function to check if a dog carries genes for a specific color
function checkIfDogCarriesColor(dog, targetColor) {
  // This would require detailed genetic marker analysis
  // For now, we'll use a simplified approach based on DNA tests
  
  if (!dog.dna_tests || dog.dna_tests.length === 0) {
    return false;
  }
  
  // Look for genetic markers related to color
  for (const test of dog.dna_tests) {
    if (!test.genetic_markers) continue;
    
    for (const marker of test.genetic_markers) {
      // Check for color-related loci
      if (['A', 'B', 'D', 'E', 'K', 'S'].includes(marker.locus)) {
        // Check for specific alleles based on target color
        switch (targetColor.toLowerCase()) {
          case 'blue':
            // Blue requires 'd/d' (dilute gene)
            if (marker.locus === 'D' && marker.alleles && marker.alleles.includes('d')) {
              return true;
            }
            break;
          case 'chocolate':
            // Chocolate requires 'b/b'
            if (marker.locus === 'B' && marker.alleles && marker.alleles.includes('b')) {
              return true;
            }
            break;
          case 'pied':
            // Pied requires 's/s'
            if (marker.locus === 'S' && marker.alleles && marker.alleles.includes('s')) {
              return true;
            }
            break;
          // Add more color genetics as needed
        }
      }
    }
  }
  
  return false;
}
