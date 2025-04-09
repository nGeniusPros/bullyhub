// netlify/functions/health-clearance-verification.js
import { createClient } from '@supabase/supabase-js';
import { createResponse, handleOptions } from '../utils/cors-headers';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function handler(event, context) {
  // Allow both GET and POST requests
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method Not Allowed' });
  }

  try {
    // Handle GET request to verify a specific clearance
    if (event.httpMethod === 'GET') {
      const params = new URLSearchParams(event.queryStringParameters);
      const verificationNumber = params.get('verificationNumber');
      
      if (!verificationNumber) {
        return createResponse(400, { error: 'Verification number is required' });
      }
      
      return await verifyHealthClearance(verificationNumber);
    }
    
    // Handle POST request to submit a new clearance for verification
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const { dogId, test, date, result, verificationNumber, documents } = data;
      
      if (!dogId || !test || !date || !result || !verificationNumber) {
        return createResponse(400, { error: 'Missing required fields' });
      }
      
      return await submitHealthClearance(data);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return createResponse(500, { error: 'Internal Server Error' });
  }
}

// Verify a health clearance by verification number
async function verifyHealthClearance(verificationNumber) {
  try {
    // Query the health clearance by verification number
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
    
    return {
      statusCode: 200,
      body: JSON.stringify(verificationResult),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error verifying health clearance:', error);
    return createResponse(500, { error: 'Failed to verify health clearance' });
  }
}

// Submit a health clearance for verification
async function submitHealthClearance(clearanceData) {
  try {
    // Verify that the dog exists
    const { data: dog, error: dogError } = await supabase
      .from('dogs')
      .select('id, name, breed, color, owner_id')
      .eq('id', clearanceData.dogId)
      .single();
    
    if (dogError) {
      console.error('Error fetching dog:', dogError);
      return createResponse(404, { error: 'Dog not found' });
    }
    
    // Verify the test against known health testing requirements
    const { data: testRequirements, error: testError } = await supabase
      .from('health_testing_requirements')
      .select('*')
      .eq('test_name', clearanceData.test)
      .single();
    
    // If the test is not found in requirements, we'll still accept it but mark it as non-standard
    const isStandardTest = !testError && testRequirements;
    
    // Determine if the test result is passing based on the result and test requirements
    let status = 'pending';
    if (isStandardTest) {
      status = determineTestStatus(clearanceData.result, testRequirements);
    }
    
    // Calculate expiry date if applicable (some tests need to be renewed periodically)
    let expiryDate = null;
    if (clearanceData.expiryDate) {
      expiryDate = clearanceData.expiryDate;
    } else if (isStandardTest && testRequirements.validity_period) {
      // Add validity period to test date
      const testDate = new Date(clearanceData.date);
      testDate.setMonth(testDate.getMonth() + testRequirements.validity_period);
      expiryDate = testDate.toISOString().split('T')[0];
    }
    
    // Insert or update the health clearance
    const { data: existingClearance, error: existingError } = await supabase
      .from('health_clearances')
      .select('id')
      .eq('dog_id', clearanceData.dogId)
      .eq('test', clearanceData.test)
      .eq('verification_number', clearanceData.verificationNumber)
      .maybeSingle();
    
    let operation;
    let clearanceId;
    
    if (!existingError && existingClearance) {
      // Update existing clearance
      const { data: updatedClearance, error: updateError } = await supabase
        .from('health_clearances')
        .update({
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
    
    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Health clearance ${operation} successfully`,
        clearanceId: clearanceId,
        status: status,
        isStandardTest: isStandardTest,
        expiryDate: expiryDate
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error submitting health clearance:', error);
    return createResponse(500, { error: 'Failed to submit health clearance' });
  }
}

// Determine test status based on result and requirements
function determineTestStatus(result, testRequirements) {
  // This is a simplified implementation
  // In a real application, this would involve more complex logic based on the specific test
  
  if (!testRequirements.action_on_positive) {
    // If no specific action is defined, use a simple pass/fail logic
    return result.toLowerCase().includes('pass') || 
           result.toLowerCase().includes('clear') || 
           result.toLowerCase().includes('normal') ? 'passed' : 'failed';
  }
  
  // Parse the action_on_positive field to determine status
  const action = testRequirements.action_on_positive.toLowerCase();
  
  if (action.includes('grade 0-1 acceptable')) {
    // For graded tests like patella luxation
    const grade = parseInt(result.match(/\d+/)?.[0] || '99');
    return grade <= 1 ? 'passed' : 'failed';
  } else if (action.includes('score 1-2 acceptable')) {
    // For scored tests like BOAS
    const score = parseInt(result.match(/\d+/)?.[0] || '99');
    return score <= 2 ? 'passed' : 'failed';
  } else if (action.includes('ofa fair or better')) {
    // For OFA ratings
    const rating = result.toLowerCase();
    return rating.includes('excellent') || rating.includes('good') || rating.includes('fair') ? 'passed' : 'failed';
  } else if (action.includes('carriers can breed')) {
    // For genetic tests where carriers are acceptable
    return result.toLowerCase().includes('affected') ? 'failed' : 'passed';
  } else {
    // Default case
    return result.toLowerCase().includes('pass') || 
           result.toLowerCase().includes('clear') || 
           result.toLowerCase().includes('normal') ? 'passed' : 'failed';
  }
}
