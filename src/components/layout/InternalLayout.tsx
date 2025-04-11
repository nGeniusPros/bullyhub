import React from "react";

/**
 * Minimal layout for internal app pages.
 * No marketing header or footer. Just a container for content.
 */
const InternalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">{children}</div>
    </div>
  );
};

export default InternalLayout;
