# Vertical Slice Architecture with MCP Protocol

This directory contains feature-based vertical slices for the PetPals application. Each feature is organized as a self-contained vertical slice that includes all the necessary components for that feature.

## Directory Structure

Each feature follows this structure:

```
/features
└── feature-name/
    ├── data/                  # Supabase schema and queries
    │   ├── schema.sql         # Database schema for this feature
    │   └── queries.ts         # Supabase queries for this feature
    ├── functions/             # Netlify Functions for this feature
    │   └── function-name.js   # Serverless function implementation
    ├── components/            # UI components for this feature
    │   └── Component.tsx      # React component
    ├── mcp/                   # MCP tools for this feature
    │   └── tools.ts           # MCP tool definitions
    └── types.ts               # TypeScript types for this feature
```

## Features

### Dogs

The Dogs feature allows users to:

- Create and manage dog profiles
- View and edit dog information
- Upload dog images
- View dog pedigrees

### Health Records

The Health Records feature allows users to:

- Create and manage health records for dogs
- Upload health record documents
- Track health history
- Categorize records by type (examinations, vaccinations, etc.)

### Nutrition

The Nutrition feature allows users to:

- Create and manage meal plans for dogs
- Track nutritional information
- Schedule feeding times
- Manage food items and ingredients

### Gallery

The Gallery feature allows users to:

- Upload and manage images
- Create and manage albums
- Share images publicly
- Tag and categorize images

### DNA Testing

The DNA Testing feature allows users to:

- Submit DNA test results from various providers
- View and analyze DNA test results
- Get AI-powered insights from DNA data

### Health Clearances

The Health Clearances feature allows users to:

- Submit health clearance certificates
- Track health clearance status
- Verify health clearances

### Stud Services

The Stud Services feature allows users to:

- List dogs for stud service
- Browse available studs
- Use AI-powered stud recommendations
- Communicate with stud owners via AI receptionist

### Marketplace

The Marketplace feature allows users to:

- Browse products by category
- View product details
- Add products to cart
- Complete purchases

## Development Workflow

1. **Feature Planning**
   - Define the feature scope
   - Design the data model
   - Define MCP tools

2. **Backend Implementation**
   - Create Supabase schema
   - Implement Netlify Functions
   - Define MCP tools

3. **Frontend Implementation**
   - Create UI components
   - Implement real-time subscriptions
   - Connect to MCP functions

4. **Testing and Deployment**
   - Feature testing
   - Netlify deployment
   - Monitor real usage

## Adding a New Feature

To add a new feature:

1. Create a new directory under `src/features`
2. Follow the directory structure above
3. Implement the necessary components
4. Create Netlify function entry points in `netlify/functions`
5. Register MCP tools in the MCP server

## MCP Protocol Integration

MCP (Model-Context-Protocol) standardizes how AI models interact with context and tools:

- Model: The AI engine (Claude, GPT, etc.)
- Context: The data and state the model needs
- Protocol: Standardized ways for the model to interact with tools and data

Each feature can define its own MCP tools in the `mcp` directory.
