// Health Clearances Feature - Health Clearance Verification Function

/**
 * Verify health clearances and process new submissions
 *
 * This function handles verification of health clearances by verification number
 * and processes new health clearance submissions.
 */
export const createHandler = ({ createResponse, handleOptions, supabase }) => async (event, context) => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  try {
    // Handle GET request to verify a specific clearance
    if (event.httpMethod === 'GET') {
      const params = new URLSearchParams(event.queryStringParameters);
      const verificationNumber = params.get('verificationNumber');

      if (!verificationNumber) {
        return createResponse(400, { error: 'Verification number is required' });
      }

      return await verifyHealthClearance(verificationNumber, { createResponse, supabase });
    }

    // Handle POST request to submit a new clearance for verification
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const { dogId, test, date, result, verificationNumber, documents } = data;

      if (!dogId || !test || !date || !result || !verificationNumber) {
        return createResponse(400, { error: 'Missing required fields' });
      }

      return await submitHealthClearance(data, { createResponse, supabase });
    }

    return createResponse(405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('Error processing request:', error);
    return createResponse(500, { error: 'Internal Server Error' });
  }
};

/**
 * Verify a health clearance by verification number
 */
async function verifyHealthClearance(verificationNumber, { createResponse, supabase }) {
  try {
    // Get the health clearance from the database
    const { data: healthClearance, error } = await supabase
      .from('health_clearances')
      .select(`
        *,
        dog:dogs(id, name, breed, color)
      `)
      .eq('verification_number', verificationNumber)
      .single();

    if (error) {
      console.error('Error fetching health clearance:', error);
      return createResponse(404, { error: 'Health clearance not found' });
    }

    // Check if the clearance is expired
    const isExpired = healthClearance.expiry_date && new Date(healthClearance.expiry_date) < new Date();

    // Format the response
    const verificationResult = {
      verified: true,
      clearance: {
        id: healthClearance.id,
        dogId: healthClearance.dog_id,
        dogName: healthClearance.dog?.name,
        dogBreed: healthClearance.dog?.breed,
        dogColor: healthClearance.dog?.color,
        test: healthClearance.test,
        date: healthClearance.date,
        result: healthClearance.result,
        status: healthClearance.status,
        expiryDate: healthClearance.expiry_date,
        verificationNumber: healthClearance.verification_number,
        isExpired: isExpired,
        verifiedAt: new Date().toISOString()
      }
    };

    return createResponse(200, verificationResult);
  } catch (error) {
    console.error('Error verifying health clearance:', error);
    return createResponse(500, { error: 'Failed to verify health clearance' });
  }
}

/**
 * Submit a new health clearance or update an existing one
 */
async function submitHealthClearance(clearanceData, { createResponse, supabase }) {
  try {
    // Check if a clearance with this verification number already exists
    const { data: existingClearance, error: checkError } = await supabase
      .from('health_clearances')
      .select('id')
      .eq('verification_number', clearanceData.verificationNumber)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing clearance:', checkError);
      return createResponse(500, { error: 'Failed to check for existing clearance' });
    }

    // Determine the status based on the test and result
    const status = determineStatus(clearanceData.test, clearanceData.result);

    // Calculate expiry date if applicable
    const expiryDate = calculateExpiryDate(clearanceData.test, clearanceData.date);

    let clearanceId;
    let operation;

    if (existingClearance) {
      // Update existing clearance
      const { data: updatedClearance, error: updateError } = await supabase
        .from('health_clearances')
        .update({
          test: clearanceData.test,
          date: clearanceData.date,
          result: clearanceData.result,
          status: status,
          expiry_date: expiryDate,
          notes: clearanceData.notes,
          documents: clearanceData.documents,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingClearance.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating health clearance:', updateError);
        return createResponse(500, { error: 'Failed to update health clearance' });
      }

      clearanceId = updatedClearance.id;
      operation = 'updated';
    } else {
      // Insert new clearance
      const { data: newClearance, error: insertError } = await supabase
        .from('health_clearances')
        .insert({
          dog_id: clearanceData.dogId,
          test: clearanceData.test,
          date: clearanceData.date,
          result: clearanceData.result,
          status: status,
          expiry_date: expiryDate,
          verification_number: clearanceData.verificationNumber,
          notes: clearanceData.notes,
          documents: clearanceData.documents
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting health clearance:', insertError);
        return createResponse(500, { error: 'Failed to create health clearance' });
      }

      clearanceId = newClearance.id;
      operation = 'created';
    }

    return createResponse(200, {
      success: true,
      message: `Health clearance ${operation} successfully`,
      clearanceId,
      status,
      expiryDate
    });
  } catch (error) {
    console.error('Error submitting health clearance:', error);
    return createResponse(500, { error: 'Failed to submit health clearance' });
  }
}

/**
 * Determine the status of a health clearance based on the test and result
 */
function determineStatus(test, result) {
  const testLower = test.toLowerCase();
  const resultLower = result.toLowerCase();

  // Define test-specific rules
  const testRules = {
    'cardiac evaluation': { action: 'normal or better' },
    'patella evaluation': { action: 'grade 0-1 acceptable' },
    'hip evaluation': { action: 'ofa fair or better' },
    'elbow evaluation': { action: 'grade 0-1 acceptable' },
    'boas assessment': { action: 'score 1-2 acceptable' },
    'eye examination': { action: 'normal or better' },
    'dna test': { action: 'carriers can breed' }
  };

  // Find the applicable rule
  let action = 'normal or better'; // Default rule

  for (const [testPattern, rule] of Object.entries(testRules)) {
    if (testLower.includes(testPattern)) {
      action = rule.action;
      break;
    }
  }

  // Apply the rule to determine status
  if (action === 'normal or better') {
    return resultLower.includes('normal') ||
           resultLower.includes('clear') ||
           resultLower.includes('negative') ||
           resultLower.includes('pass') ? 'passed' : 'failed';
  }

  if (action.includes('grade 0-1 acceptable')) {
    // For graded tests like patella luxation
    const grade = parseInt(result.match(/\\d+/)?.[0] || '99');
    return grade <= 1 ? 'passed' : 'failed';
  } else if (action.includes('score 1-2 acceptable')) {
    // For scored tests like BOAS
    const score = parseInt(result.match(/\\d+/)?.[0] || '99');
    return score <= 2 ? 'passed' : 'failed';
  } else if (action.includes('ofa fair or better')) {
    // For OFA ratings
    const rating = result.toLowerCase();
    return rating.includes('excellent') || rating.includes('good') || rating.includes('fair') ? 'passed' : 'failed';
  } else if (action.includes('carriers can breed')) {
    // For genetic tests where carriers are acceptable
    return resultLower.includes('affected') ? 'failed' : 'passed';
  }

  // Default to pending if we can't determine
  return 'pending';
}

/**
 * Calculate the expiry date for a health clearance
 */
function calculateExpiryDate(test, testDate) {
  const testLower = test.toLowerCase();
  const date = new Date(testDate);

  // Define test-specific expiry periods
  if (testLower.includes('cardiac') || testLower.includes('heart')) {
    // Cardiac evaluations typically valid for 1 year
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  }

  if (testLower.includes('eye') || testLower.includes('ophthalmologist')) {
    // Eye examinations typically valid for 1 year
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  }

  if (testLower.includes('boas')) {
    // BOAS assessments typically valid for 2 years
    date.setFullYear(date.getFullYear() + 2);
    return date.toISOString().split('T')[0];
  }

  if (testLower.includes('hip') || testLower.includes('elbow') || testLower.includes('patella')) {
    // Orthopedic evaluations typically valid for 2 years
    date.setFullYear(date.getFullYear() + 2);
    return date.toISOString().split('T')[0];
  }

  if (testLower.includes('dna') || testLower.includes('genetic')) {
    // DNA tests are typically valid for life
    return null;
  }

  // Default to 1 year if we don't have a specific rule
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
}
