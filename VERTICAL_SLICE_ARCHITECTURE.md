# Vertical Slice Architecture with MCP Protocol in Netlify/Supabase Stack

## Directory Structure

```
/
├── src/
│   ├── features/                      # Vertical slices organized by feature
│   │   ├── dna-testing/               # DNA Testing feature slice
│   │   │   ├── data/                  # Supabase schema and queries
│   │   │   │   ├── schema.sql         # Database schema for this feature
│   │   │   │   └── queries.ts         # Supabase queries for this feature
│   │   │   ├── functions/             # Netlify Functions for this feature
│   │   │   │   ├── dna-test-parser.js # Serverless function implementation
│   │   │   │   └── get-dna-data.js    # Serverless function implementation
│   │   │   ├── components/            # UI components for this feature
│   │   │   │   ├── DNATestForm.tsx    # Component for submitting DNA tests
│   │   │   │   └── DNAResultsView.tsx # Component for viewing DNA results
│   │   │   └── mcp/                   # MCP tools for this feature
│   │   │       └── dna-tools.ts       # MCP tool definitions
│   │   │
│   │   ├── stud-services/             # Stud Services feature slice
│   │   │   ├── data/                  # Supabase schema and queries
│   │   │   ├── functions/             # Netlify Functions for this feature
│   │   │   ├── components/            # UI components for this feature
│   │   │   └── mcp/                   # MCP tools for this feature
│   │   │
│   │   ├── health-clearances/         # Health Clearances feature slice
│   │   │   ├── data/                  # Supabase schema and queries
│   │   │   ├── functions/             # Netlify Functions for this feature
│   │   │   ├── components/            # UI components for this feature
│   │   │   └── mcp/                   # MCP tools for this feature
│   │   │
│   │   └── marketplace/               # Marketplace feature slice
│   │       ├── data/                  # Supabase schema and queries
│   │       ├── functions/             # Netlify Functions for this feature
│   │       ├── components/            # UI components for this feature
│   │       └── mcp/                   # MCP tools for this feature
│   │
│   ├── lib/                           # Shared libraries
│   │   ├── supabase.ts                # Supabase client (server)
│   │   ├── supabase-browser.ts        # Supabase client (browser)
│   │   └── mcp.ts                     # MCP handler
│   │
│   ├── components/                    # Shared UI components
│   ├── hooks/                         # Shared React hooks
│   └── app/                           # Next.js app router pages
│
├── netlify/
│   ├── functions/                     # Function entry points (redirects to feature functions)
│   └── utils/                         # Shared utilities for functions
│
└── supabase/
    └── migrations/                    # Database migrations
```

## Implementation Strategy

### 1. Feature Organization

Each feature (vertical slice) is self-contained with:
- Database schema and queries
- Netlify Functions for API endpoints
- UI components
- MCP tool definitions

### 2. MCP Protocol Integration

MCP standardizes how AI models interact with context and tools:
- Model: The AI engine (Claude, GPT, etc.)
- Context: The data and state the model needs
- Protocol: Standardized ways for the model to interact with tools and data

### 3. Netlify/Supabase Stack

- Netlify: Hosting, CI/CD, serverless functions
- Supabase: Database, authentication, real-time subscriptions
- Both are serverless, scaling automatically with demand

## Development Workflow

1. **Feature Planning**
   - Define a Feature Slice
   - Design the Data Model
   - Define MCP Tools

2. **Backend Implementation**
   - Create Supabase Schema
   - Implement Netlify Functions
   - Define MCP Tools

3. **Frontend Implementation**
   - Create UI Components
   - Implement Real-Time Subscriptions
   - Connect to MCP Functions

4. **Testing and Deployment**
   - Feature Testing
   - Netlify Deployment
   - Monitor Real Usage
