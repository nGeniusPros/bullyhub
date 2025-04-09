// scripts/deploy-to-netlify.js
import { execSync } from "child_process";
import readline from "readline";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Check if Netlify CLI is installed
function checkNetlifyCLI() {
  try {
    execSync("netlify --version", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if user is logged in to Netlify
function checkNetlifyLogin() {
  try {
    const result = execSync("netlify status", { encoding: "utf8" });
    return !result.includes("You are not logged in");
  } catch (error) {
    return false;
  }
}

// Check if required environment variables are set
function checkEnvironmentVariables() {
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "OPENAI_API_KEY",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  return {
    allSet: missingVars.length === 0,
    missingVars,
  };
}

// Deploy to Netlify
function deploy(production = false) {
  console.log("\n🚀 Starting Netlify deployment...");

  try {
    // Build the application
    console.log("\n📦 Building the application...");
    execSync("npm run build", { stdio: "inherit" });

    // Deploy to Netlify
    console.log("\n🌐 Deploying to Netlify...");
    const deployCommand = production
      ? "netlify deploy --prod"
      : "netlify deploy";

    execSync(deployCommand, { stdio: "inherit" });

    console.log("\n✅ Deployment completed successfully!");
    if (!production) {
      console.log(
        "\n⚠️ This was a draft deployment. To deploy to production, run:"
      );
      console.log("npm run netlify:deploy:prod");
    }
  } catch (error) {
    console.error("\n❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

// Main function
async function main() {
  console.log("=== Bully Hub Netlify Deployment ===\n");

  // Check if prod flag is passed
  const isProd = process.argv.includes("prod");

  // Check Netlify CLI
  if (!checkNetlifyCLI()) {
    console.error("❌ Netlify CLI is not installed. Please install it with:");
    console.error("npm install -g netlify-cli");
    process.exit(1);
  }

  // Check Netlify login
  if (!checkNetlifyLogin()) {
    console.log("⚠️ You are not logged in to Netlify. Please log in:");
    execSync("netlify login", { stdio: "inherit" });
  }

  // Check environment variables
  const { allSet, missingVars } = checkEnvironmentVariables();
  if (!allSet) {
    console.error("❌ The following environment variables are missing:");
    missingVars.forEach((varName) => console.error(`  - ${varName}`));
    console.error(
      "\nPlease set these variables in your .env.local file or Netlify environment variables."
    );
    process.exit(1);
  }

  if (isProd) {
    console.log("\n⚠️ You are about to deploy to PRODUCTION!");
    rl.question("Are you sure? (y/N): ", (confirmation) => {
      if (confirmation.toLowerCase() === "y") {
        deploy(true);
      } else {
        console.log("\n🛑 Production deployment cancelled.");
        rl.question(
          "Would you like to create a draft deployment instead? (Y/n): ",
          (draftAnswer) => {
            if (draftAnswer.toLowerCase() !== "n") {
              deploy(false);
            } else {
              console.log("\n🛑 Deployment cancelled.");
            }
            rl.close();
          }
        );
      }
    });
  } else {
    // Ask for deployment type if not specified
    rl.question("Deploy to production? (y/N): ", (answer) => {
      const production = answer.toLowerCase() === "y";

      if (production) {
        console.log("\n⚠️ You are about to deploy to production!");
        rl.question("Are you sure? (y/N): ", (confirmation) => {
          if (confirmation.toLowerCase() === "y") {
            deploy(true);
          } else {
            console.log("\n🛑 Production deployment cancelled.");
            rl.question(
              "Would you like to create a draft deployment instead? (Y/n): ",
              (draftAnswer) => {
                if (draftAnswer.toLowerCase() !== "n") {
                  deploy(false);
                } else {
                  console.log("\n🛑 Deployment cancelled.");
                }
                rl.close();
              }
            );
          }
        });
      } else {
        deploy(false);
        rl.close();
      }
    });
  }
}

// Run the main function
main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
