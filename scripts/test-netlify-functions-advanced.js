// scripts/test-netlify-functions-advanced.js
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import readline from 'readline';

// Get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const functionsDir = path.join(__dirname, '..', 'netlify', 'functions');

// Base URL for local Netlify functions
const baseUrl = 'http://localhost:8888/.netlify/functions';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Test data for different functions
const testData = {
  'hello-world': {
    method: 'GET',
    data: null,
    description: 'A simple test function that returns a greeting message',
    expectedStatus: 200,
    validateResponse: (response) => {
      return response.message && typeof response.message === 'string';
    }
  },
  'dna-test-integration': {
    method: 'POST',
    data: {
      dogId: 'test-dog-1',
      testType: 'color-genetics',
      testResults: {
        gene1: 'Bb',
        gene2: 'dd',
        gene3: 'Kk'
      }
    },
    description: 'Stores DNA test results for dogs in the database',
    expectedStatus: 200,
    validateResponse: (response) => {
      return response.message && response.data;
    }
  },
  'stud-receptionist': {
    method: 'POST',
    data: {
      femaleId: 'test-dog-2',
      message: 'Looking for a stud for my female French Bulldog with blue coat'
    },
    description: 'AI-powered stud recommendations',
    expectedStatus: 200,
    validateResponse: (response) => {
      return response.message && response.response && response.recommendedStuds;
    }
  },
  'color-prediction': {
    method: 'POST',
    data: {
      sireId: 'test-dog-1',
      damId: 'test-dog-2'
    },
    description: 'Predicts puppy coat colors based on parents\' genetics',
    expectedStatus: 200,
    validateResponse: (response) => {
      return response.predictions && response.parentColors && response.confidence;
    }
  },
  'coi-calculator': {
    method: 'POST',
    data: {
      sireId: 'test-dog-1',
      damId: 'test-dog-2',
      generations: 5
    },
    description: 'Calculates Coefficient of Inbreeding for potential matings',
    expectedStatus: 200,
    validateResponse: (response) => {
      return typeof response.coiPercentage === 'number' && 
             response.diversityAssessment && 
             response.riskLevel && 
             Array.isArray(response.recommendations);
    }
  },
  'health-clearance-verification': {
    method: 'POST',
    data: {
      dogId: 'test-dog-1',
      test: 'Hip Dysplasia',
      date: '2023-04-15',
      result: 'OFA Good',
      verificationNumber: 'HD-12345'
    },
    description: 'Verifies health clearances',
    expectedStatus: 200,
    validateResponse: (response) => {
      return response.message && response.clearance;
    }
  },
  'breeding-program-compatibility': {
    method: 'POST',
    data: {
      dogId: 'test-dog-1',
      breedingProgramId: 'test-program-1'
    },
    description: 'Checks breeding program compatibility',
    expectedStatus: 200,
    validateResponse: (response) => {
      return response.compatible !== undefined && 
             response.requirements && 
             response.missingRequirements !== undefined;
    }
  },
  'social-media-integration': {
    method: 'POST',
    data: {
      text: 'Test post from Bully Hub',
      platforms: ['facebook', 'instagram'],
      userId: 'test-user-1'
    },
    description: 'Integrates with social media platforms',
    expectedStatus: 200,
    validateResponse: (response) => {
      return response.success !== undefined;
    }
  }
};

// Get list of available functions
function getAvailableFunctions() {
  try {
    const files = fs.readdirSync(functionsDir);
    return files
      .filter(file => file.endsWith('.js'))
      .map(file => file.replace('.js', ''));
  } catch (error) {
    console.error(chalk.red('Error reading functions directory:'), error);
    return [];
  }
}

// Test a single function
async function testFunction(functionName) {
  const testConfig = testData[functionName] || {
    method: 'GET',
    data: null,
    description: 'Unknown function',
    expectedStatus: 200,
    validateResponse: () => true
  };
  
  const url = `${baseUrl}/${functionName}`;
  
  try {
    console.log(chalk.blue(`Testing function: ${functionName}`));
    console.log(chalk.gray(`Description: ${testConfig.description}`));
    console.log(chalk.gray(`URL: ${url}`));
    console.log(chalk.gray(`Method: ${testConfig.method}`));
    
    if (testConfig.data) {
      console.log(chalk.gray(`Data: ${JSON.stringify(testConfig.data, null, 2)}`));
    }
    
    const options = {
      method: testConfig.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (testConfig.data) {
      options.body = JSON.stringify(testConfig.data);
    }
    
    const response = await fetch(url, options);
    const result = await response.json();
    
    console.log(chalk.green(`Status: ${response.status}`));
    console.log(chalk.green('Response:'));
    console.log(JSON.stringify(result, null, 2));
    
    // Validate response
    const isValid = testConfig.validateResponse(result);
    
    return {
      success: response.status === testConfig.expectedStatus && isValid,
      status: response.status,
      data: result,
      isValid
    };
  } catch (error) {
    console.error(chalk.red(`Error testing function ${functionName}:`), error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test CORS headers
async function testCorsHeaders(functionName) {
  const testConfig = testData[functionName] || {
    method: 'GET',
    data: null
  };
  
  const url = `${baseUrl}/${functionName}`;
  
  try {
    console.log(chalk.blue(`Testing CORS headers for: ${functionName}`));
    
    // Test OPTIONS request
    const optionsResponse = await fetch(url, {
      method: 'OPTIONS'
    });
    
    const corsHeaders = {
      'access-control-allow-origin': optionsResponse.headers.get('access-control-allow-origin'),
      'access-control-allow-headers': optionsResponse.headers.get('access-control-allow-headers'),
      'access-control-allow-methods': optionsResponse.headers.get('access-control-allow-methods')
    };
    
    console.log(chalk.green('CORS Headers:'));
    console.log(JSON.stringify(corsHeaders, null, 2));
    
    const hasCorsHeaders = corsHeaders['access-control-allow-origin'] === '*' && 
                          corsHeaders['access-control-allow-headers'] && 
                          corsHeaders['access-control-allow-methods'];
    
    return {
      success: hasCorsHeaders,
      corsHeaders
    };
  } catch (error) {
    console.error(chalk.red(`Error testing CORS headers for ${functionName}:`), error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test all functions
async function testAllFunctions() {
  console.log(chalk.yellow('=== Testing Netlify Functions ===\n'));
  
  // Check if Netlify dev server is running
  try {
    await fetch(`${baseUrl}/hello-world`);
  } catch (error) {
    console.error(chalk.red('Error: Netlify dev server is not running.'));
    console.log(chalk.yellow('Please start the server with: npm run netlify:dev'));
    process.exit(1);
  }
  
  const availableFunctions = getAvailableFunctions();
  console.log(chalk.blue(`Found ${availableFunctions.length} functions to test.\n`));
  
  const results = {};
  const corsResults = {};
  
  for (const functionName of availableFunctions) {
    console.log(chalk.yellow(`\n--- Testing ${functionName} ---`));
    
    // Test function
    results[functionName] = await testFunction(functionName);
    
    // Test CORS headers
    corsResults[functionName] = await testCorsHeaders(functionName);
    
    console.log(chalk.yellow(`--- End of ${functionName} test ---\n`));
  }
  
  // Summary
  console.log(chalk.yellow('\n=== Test Summary ===\n'));
  
  let successCount = 0;
  let failCount = 0;
  let corsSuccessCount = 0;
  let corsFailCount = 0;
  
  console.log(chalk.yellow('Function Tests:'));
  for (const [functionName, result] of Object.entries(results)) {
    if (result.success) {
      console.log(chalk.green(`✓ ${functionName}`));
      successCount++;
    } else {
      console.log(chalk.red(`✗ ${functionName}`));
      failCount++;
    }
  }
  
  console.log(chalk.yellow('\nCORS Tests:'));
  for (const [functionName, result] of Object.entries(corsResults)) {
    if (result.success) {
      console.log(chalk.green(`✓ ${functionName}`));
      corsSuccessCount++;
    } else {
      console.log(chalk.red(`✗ ${functionName}`));
      corsFailCount++;
    }
  }
  
  console.log(chalk.yellow(`\nFunction Tests: ${successCount}/${availableFunctions.length} passed`));
  console.log(chalk.yellow(`CORS Tests: ${corsSuccessCount}/${availableFunctions.length} passed`));
  
  if (failCount === 0 && corsFailCount === 0) {
    console.log(chalk.green('\nAll tests passed!'));
  } else {
    console.log(chalk.yellow('\nSome tests failed. Please check the errors above.'));
  }
}

// Test a specific function
async function testSpecificFunction(functionName) {
  console.log(chalk.yellow(`=== Testing ${functionName} ===\n`));
  
  // Check if Netlify dev server is running
  try {
    await fetch(`${baseUrl}/hello-world`);
  } catch (error) {
    console.error(chalk.red('Error: Netlify dev server is not running.'));
    console.log(chalk.yellow('Please start the server with: npm run netlify:dev'));
    process.exit(1);
  }
  
  // Check if function exists
  const availableFunctions = getAvailableFunctions();
  if (!availableFunctions.includes(functionName)) {
    console.error(chalk.red(`Error: Function '${functionName}' not found.`));
    console.log(chalk.yellow(`Available functions: ${availableFunctions.join(', ')}`));
    process.exit(1);
  }
  
  // Test function
  const result = await testFunction(functionName);
  
  // Test CORS headers
  const corsResult = await testCorsHeaders(functionName);
  
  // Summary
  console.log(chalk.yellow('\n=== Test Summary ===\n'));
  
  console.log(chalk.yellow('Function Test:'));
  if (result.success) {
    console.log(chalk.green(`✓ ${functionName}`));
  } else {
    console.log(chalk.red(`✗ ${functionName}`));
  }
  
  console.log(chalk.yellow('\nCORS Test:'));
  if (corsResult.success) {
    console.log(chalk.green(`✓ ${functionName}`));
  } else {
    console.log(chalk.red(`✗ ${functionName}`));
  }
  
  if (result.success && corsResult.success) {
    console.log(chalk.green('\nAll tests passed!'));
  } else {
    console.log(chalk.yellow('\nSome tests failed. Please check the errors above.'));
  }
}

// Main function
async function main() {
  // Check if a specific function was specified
  const args = process.argv.slice(2);
  const functionName = args[0];
  
  if (functionName) {
    await testSpecificFunction(functionName);
    rl.close();
  } else {
    // Ask if user wants to test all functions or a specific one
    rl.question('Test all functions? (Y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'n') {
        const availableFunctions = getAvailableFunctions();
        console.log(chalk.blue(`Available functions: ${availableFunctions.join(', ')}`));
        
        rl.question('Enter function name to test: ', async (functionName) => {
          if (functionName && availableFunctions.includes(functionName)) {
            await testSpecificFunction(functionName);
          } else {
            console.error(chalk.red(`Error: Function '${functionName}' not found.`));
          }
          rl.close();
        });
      } else {
        await testAllFunctions();
        rl.close();
      }
    });
  }
}

// Run the main function
main().catch(error => {
  console.error(chalk.red('Error running tests:'), error);
  rl.close();
  process.exit(1);
});
