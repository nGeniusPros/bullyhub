// scripts/test-netlify-functions.js
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const functionsDir = path.join(__dirname, '..', 'netlify', 'functions');

// Base URL for local Netlify functions
const baseUrl = 'http://localhost:8888/.netlify/functions';

// Test data for different functions
const testData = {
  'hello-world': {
    method: 'GET',
    data: null
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
    }
  },
  'stud-receptionist': {
    method: 'POST',
    data: {
      femaleId: 'test-dog-2',
      message: 'Looking for a stud for my female French Bulldog with blue coat'
    }
  },
  'color-prediction': {
    method: 'POST',
    data: {
      sireId: 'test-dog-1',
      damId: 'test-dog-2'
    }
  },
  'coi-calculator': {
    method: 'POST',
    data: {
      sireId: 'test-dog-1',
      damId: 'test-dog-2',
      generations: 5
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
    }
  },
  'breeding-program-compatibility': {
    method: 'POST',
    data: {
      dogId: 'test-dog-1',
      breedingProgramId: 'test-program-1'
    }
  },
  'social-media-integration': {
    method: 'POST',
    data: {
      text: 'Test post from Bully Hub',
      platforms: ['facebook', 'instagram'],
      userId: 'test-user-1'
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
    data: null
  };
  
  const url = `${baseUrl}/${functionName}`;
  
  try {
    console.log(chalk.blue(`Testing function: ${functionName}`));
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
    
    return {
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      data: result
    };
  } catch (error) {
    console.error(chalk.red(`Error testing function ${functionName}:`), error);
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
  console.log(chalk.blue(`Found ${availableFunctions.length} functions to test:\n`));
  
  const results = {};
  
  for (const functionName of availableFunctions) {
    console.log(chalk.yellow(`\n--- Testing ${functionName} ---`));
    results[functionName] = await testFunction(functionName);
    console.log(chalk.yellow(`--- End of ${functionName} test ---\n`));
  }
  
  // Summary
  console.log(chalk.yellow('\n=== Test Summary ===\n'));
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [functionName, result] of Object.entries(results)) {
    if (result.success) {
      console.log(chalk.green(`✓ ${functionName}`));
      successCount++;
    } else {
      console.log(chalk.red(`✗ ${functionName}`));
      failCount++;
    }
  }
  
  console.log(chalk.yellow(`\nTotal: ${availableFunctions.length}`));
  console.log(chalk.green(`Success: ${successCount}`));
  console.log(chalk.red(`Failed: ${failCount}`));
}

// Run the tests
testAllFunctions().catch(error => {
  console.error(chalk.red('Error running tests:'), error);
  process.exit(1);
});
