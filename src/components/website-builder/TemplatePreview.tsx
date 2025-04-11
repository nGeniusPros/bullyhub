import React from "react";

interface TemplatePreviewProps {
  templateId: string;
}

/**
 * Renders a responsive preview of the selected website template.
 * TODO: Implement live preview with real data and device toggles.
 */
const TemplatePreview: React.FC<TemplatePreviewProps> = ({ templateId }) => {
  return (
    <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded mb-2">
      <span className="text-muted-foreground">
        [Preview for <b>{templateId}</b> template will appear here]
      </span>
    </div>
  );
};

export default TemplatePreview;
