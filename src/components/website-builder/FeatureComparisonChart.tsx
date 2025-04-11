import React from "react";

interface Template {
  id: string;
  name: string;
  description: string;
}

interface FeatureComparisonChartProps {
  templates: Template[];
}

/**
 * Displays a feature comparison chart for the available website templates.
 * TODO: Populate with real feature data for each template.
 */
const FeatureComparisonChart: React.FC<FeatureComparisonChartProps> = ({ templates }) => {
  return (
    <div className="overflow-x-auto my-6">
      <div className="bg-card-gradient-primary rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300 mb-4">
        <table className="min-w-full rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b text-left text-gray-900 font-semibold">Template</th>
            <th className="px-4 py-2 border-b text-gray-900 font-semibold">Key Features</th>
          </tr>
        </thead>
          <tbody className="bg-white/80">
            {templates.map((tpl, index) => (
              <tr key={tpl.id} className={index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"}>
                <td className="px-4 py-3 font-semibold border-t border-gray-100">{tpl.name}</td>
                <td className="px-4 py-3 border-t border-gray-100">{tpl.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-muted-foreground mt-2 text-center">
        [Feature comparison chart will be expanded with detailed features for each template.]
      </div>
    </div>
  );
};

export default FeatureComparisonChart;
