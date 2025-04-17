// Type definitions for Next.js page props in App Router

// Define the expected structure for page component props
interface PageComponentProps<T extends Record<string, string> = Record<string, string>> {
  params: T;
  searchParams?: Record<string, string | string[]>;
}

// Export for use in page components
export { PageComponentProps };
