import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// Patterns to look for
const patterns = [
  {
    name: 'Missing error handling in async functions',
    regex: /async\s+\w+\s*\([^)]*\)\s*{\s*(?!.*try).*await/g,
    severity: 'HIGH',
    suggestion: 'Add try-catch blocks around async operations'
  },
  {
    name: 'Direct Supabase client creation without error handling',
    regex: /createBrowserSupabaseClient\(\)(?!.*try)/g,
    severity: 'HIGH',
    suggestion: 'Wrap Supabase client creation in try-catch blocks'
  },
  {
    name: 'Missing dependency arrays in useEffect',
    regex: /useEffect\(\s*\(\)\s*=>\s*{[^}]*}\s*\)/g,
    severity: 'MEDIUM',
    suggestion: 'Add dependency arrays to useEffect hooks'
  },
  {
    name: 'Potential state update after unmount',
    regex: /const\s+\[\w+,\s*set\w+\]\s*=\s*useState[^;]*;\s*useEffect\(\s*\(\)\s*=>\s*{[^}]*set\w+/g,
    severity: 'MEDIUM',
    suggestion: 'Check if component is mounted before updating state in async operations'
  },
  {
    name: 'Direct DOM manipulation',
    regex: /document\.getElementById|document\.querySelector/g,
    severity: 'MEDIUM',
    suggestion: 'Use React refs instead of direct DOM manipulation'
  },
  {
    name: 'Console.log statements',
    regex: /console\.log/g,
    severity: 'LOW',
    suggestion: 'Remove console.log statements in production code'
  }
];

// Function to recursively scan directories
async function scanDirectory(dir) {
  const issues = [];
  const files = await fs.promises.readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== 'node_modules' && file !== '.next') {
        const subIssues = await scanDirectory(filePath);
        issues.push(...subIssues);
      }
    } else if (
      file.endsWith('.js') || 
      file.endsWith('.jsx') || 
      file.endsWith('.ts') || 
      file.endsWith('.tsx')
    ) {
      const fileIssues = await scanFile(filePath);
      issues.push(...fileIssues);
    }
  }
  
  return issues;
}

// Function to scan a single file
async function scanFile(filePath) {
  const issues = [];
  const content = await fs.promises.readFile(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  
  for (const pattern of patterns) {
    const matches = content.match(pattern.regex);
    
    if (matches) {
      issues.push({
        file: relativePath,
        pattern: pattern.name,
        severity: pattern.severity,
        suggestion: pattern.suggestion,
        occurrences: matches.length
      });
    }
  }
  
  return issues;
}

// Main function
async function main() {
  console.log('Scanning codebase for potential issues...');
  
  try {
    const issues = await scanDirectory(srcDir);
    
    // Group issues by severity
    const highSeverity = issues.filter(issue => issue.severity === 'HIGH');
    const mediumSeverity = issues.filter(issue => issue.severity === 'MEDIUM');
    const lowSeverity = issues.filter(issue => issue.severity === 'LOW');
    
    console.log('\n=== Bully Hub Codebase Audit Results ===\n');
    
    console.log(`Found ${issues.length} potential issues:`);
    console.log(`- ${highSeverity.length} high severity issues`);
    console.log(`- ${mediumSeverity.length} medium severity issues`);
    console.log(`- ${lowSeverity.length} low severity issues`);
    
    if (highSeverity.length > 0) {
      console.log('\n=== HIGH SEVERITY ISSUES ===');
      highSeverity.forEach(issue => {
        console.log(`\nFile: ${issue.file}`);
        console.log(`Issue: ${issue.pattern}`);
        console.log(`Occurrences: ${issue.occurrences}`);
        console.log(`Suggestion: ${issue.suggestion}`);
      });
    }
    
    if (mediumSeverity.length > 0) {
      console.log('\n=== MEDIUM SEVERITY ISSUES ===');
      mediumSeverity.forEach(issue => {
        console.log(`\nFile: ${issue.file}`);
        console.log(`Issue: ${issue.pattern}`);
        console.log(`Occurrences: ${issue.occurrences}`);
        console.log(`Suggestion: ${issue.suggestion}`);
      });
    }
    
    if (lowSeverity.length > 0) {
      console.log('\n=== LOW SEVERITY ISSUES ===');
      lowSeverity.forEach(issue => {
        console.log(`\nFile: ${issue.file}`);
        console.log(`Issue: ${issue.pattern}`);
        console.log(`Occurrences: ${issue.occurrences}`);
        console.log(`Suggestion: ${issue.suggestion}`);
      });
    }
    
    // Write results to a file
    const reportPath = path.join(rootDir, 'codebase-audit-report.md');
    let report = '# Bully Hub Codebase Audit Report\n\n';
    
    report += `Found ${issues.length} potential issues:\n`;
    report += `- ${highSeverity.length} high severity issues\n`;
    report += `- ${mediumSeverity.length} medium severity issues\n`;
    report += `- ${lowSeverity.length} low severity issues\n\n`;
    
    if (highSeverity.length > 0) {
      report += '## HIGH SEVERITY ISSUES\n\n';
      highSeverity.forEach(issue => {
        report += `### ${issue.file}\n`;
        report += `- **Issue**: ${issue.pattern}\n`;
        report += `- **Occurrences**: ${issue.occurrences}\n`;
        report += `- **Suggestion**: ${issue.suggestion}\n\n`;
      });
    }
    
    if (mediumSeverity.length > 0) {
      report += '## MEDIUM SEVERITY ISSUES\n\n';
      mediumSeverity.forEach(issue => {
        report += `### ${issue.file}\n`;
        report += `- **Issue**: ${issue.pattern}\n`;
        report += `- **Occurrences**: ${issue.occurrences}\n`;
        report += `- **Suggestion**: ${issue.suggestion}\n\n`;
      });
    }
    
    if (lowSeverity.length > 0) {
      report += '## LOW SEVERITY ISSUES\n\n';
      lowSeverity.forEach(issue => {
        report += `### ${issue.file}\n`;
        report += `- **Issue**: ${issue.pattern}\n`;
        report += `- **Occurrences**: ${issue.occurrences}\n`;
        report += `- **Suggestion**: ${issue.suggestion}\n\n`;
      });
    }
    
    await fs.promises.writeFile(reportPath, report);
    console.log(`\nReport written to ${reportPath}`);
    
  } catch (error) {
    console.error('Error scanning codebase:', error);
  }
}

main();
