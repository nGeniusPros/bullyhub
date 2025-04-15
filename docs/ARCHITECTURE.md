# PetPals Architecture

## Vertical Slice Architecture

PetPals follows a Vertical Slice Architecture, which organizes code by features rather than technical layers. This approach provides several benefits:

1. **Cohesion**: Related code is kept together, making it easier to understand and modify.
2. **Isolation**: Features are isolated from each other, reducing the risk of unintended side effects.
3. **Scalability**: New features can be added without affecting existing ones.
4. **Maintainability**: Changes to a feature are localized to that feature's directory.

## Project Structure

```
src/
├── app/                  # Next.js app router pages
├── components/           # Shared UI components
├── features/             # Feature-specific code
│   ├── dogs/             # Dogs feature
│   │   ├── components/   # UI components for the dogs feature
│   │   ├── data/         # Data access and queries
│   │   ├── functions/    # Netlify serverless functions
│   │   ├── mcp/          # MCP tools for AI integration
│   │   └── __tests__/    # Tests for the dogs feature
│   ├── health-records/   # Health Records feature
│   ├── nutrition/        # Nutrition feature
│   ├── gallery/          # Gallery feature
│   └── ...               # Other features
├── lib/                  # Shared utilities and libraries
└── types/                # Global TypeScript types
```

## Features

Each feature directory contains everything related to that feature:

- **components/**: UI components specific to the feature
- **data/**: Data access and queries
- **functions/**: Netlify serverless functions
- **mcp/**: MCP tools for AI integration
- **__tests__/**: Tests for the feature

## API Routes

API routes are organized by feature rather than in a central location. Each feature has its own API routes in the `functions/` directory.

For example, the Dogs feature has the following API routes:

- `dogs.js`: Get all dogs, create a new dog
- `dog-by-id.js`: Get, update, or delete a specific dog
- `dog-pedigree.js`: Get a dog's pedigree
- `dog-upload-image.js`: Upload an image for a dog

## Data Access

Data access is handled through feature-specific query functions in the `data/` directory. These functions provide a clean interface for accessing the database and encapsulate the implementation details.

For example, the Dogs feature has the following query functions:

- `getAllDogs()`: Get all dogs for the current user
- `getDogById(id)`: Get a dog by ID
- `createDog(dog)`: Create a new dog
- `updateDog(id, dog)`: Update a dog
- `deleteDog(id)`: Delete a dog
- `uploadDogImage(id, file)`: Upload an image for a dog
- `removeDogImage(id)`: Remove an image for a dog

## Testing

Each feature has its own tests in the `__tests__/` directory. These tests cover:

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test the interaction between components
- **API Tests**: Test the API routes

## Netlify Functions

Netlify functions are organized by feature in the `netlify/functions/` directory. Each function is a thin wrapper around the feature-specific implementation in the `src/features/*/functions/` directory.

For example, the `dog-by-id.js` function in `netlify/functions/` imports the implementation from `src/features/dogs/functions/dog-by-id.js`.

## MCP Protocol

MCP (Machine Comprehension Protocol) tools are organized by feature in the `mcp/` directory. These tools provide AI-powered functionality specific to each feature.

## Benefits of Vertical Slice Architecture

1. **Easier to understand**: Developers can focus on a single feature without having to understand the entire codebase.
2. **Easier to modify**: Changes to a feature are localized to that feature's directory.
3. **Easier to test**: Features can be tested in isolation.
4. **Easier to deploy**: Features can be deployed independently.
5. **Easier to scale**: New features can be added without affecting existing ones.
6. **Easier to maintain**: Related code is kept together, making it easier to understand and modify.

## Implementation Details

### Component Migration

Components are located with their related functionality in the feature directory. For example, the `DogProfileImageUpload` component is located in `src/features/dogs/components/` rather than in a central `components/` directory.

### API Route Migration

API routes are implemented as Netlify functions in the feature directory. For example, the `dog-by-id.js` function is implemented in `src/features/dogs/functions/dog-by-id.js` and exposed through `netlify/functions/dog-by-id.js`.

### Data Access Migration

Data access is handled through feature-specific query functions in the `data/` directory. For example, the `getDogById` function is implemented in `src/features/dogs/data/queries.ts`.

### Testing Migration

Tests are located with their related functionality in the feature directory. For example, the tests for the `DogProfileImageUpload` component are located in `src/features/dogs/__tests__/DogProfileImageUpload.test.tsx`.

## Conclusion

Vertical Slice Architecture provides a clean, maintainable, and scalable approach to organizing code. By organizing code by feature rather than technical layer, we can more easily understand, modify, test, and deploy our application.
