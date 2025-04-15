// Stud Services Feature - Main Export File

// Export components
export { default as StudServiceList } from './components/StudServiceList';
export { default as StudServiceForm } from './components/StudServiceForm';
export { default as StudReceptionist } from './components/StudReceptionist';

// Export types
export * from './types';

// Export queries
export { studServiceQueries, useStudServiceQueries } from './data/queries';

// Export MCP tools
export { studServiceTools } from './mcp/stud-tools';
