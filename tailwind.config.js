/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#29ABE2",
          dark: "#1E95C9",
          light: "#7CCEF4",
        },
        secondary: {
          DEFAULT: "#FFDA63",
          dark: "#F0CB54",
          light: "#FFE68A",
        },
        accent: {
          DEFAULT: "#FF8C00",
          dark: "#E07D00",
          light: "#FFA94D",
        },
        success: {
          DEFAULT: "#8FBC8F",
          dark: "#2E8B57",
          light: "#A8D8A8",
        },
        info: {
          DEFAULT: "#6A3DE8",
          dark: "#5A2ED8",
          light: "#9B7EF2",
        },
      },
      backgroundImage: {
        // Two-color gradients
        "gradient-primary": "linear-gradient(135deg, #29ABE2 0%, #6A3DE8 100%)",
        "gradient-secondary": "linear-gradient(135deg, #FFDA63 0%, #FF8C00 100%)",
        "gradient-success": "linear-gradient(135deg, #8FBC8F 0%, #2E8B57 100%)",
        "gradient-info": "linear-gradient(135deg, #6A3DE8 0%, #29ABE2 100%)",
        
        // Three-color gradients
        "gradient-primary-3color": "linear-gradient(135deg, #7CCEF4 0%, #29ABE2 50%, #6A3DE8 100%)",
        "gradient-secondary-3color": "linear-gradient(135deg, #FFE68A 0%, #FFDA63 50%, #FF8C00 100%)",
        "gradient-success-3color": "linear-gradient(135deg, #A8D8A8 0%, #8FBC8F 50%, #2E8B57 100%)",
        "gradient-info-3color": "linear-gradient(135deg, #9B7EF2 0%, #6A3DE8 50%, #29ABE2 100%)",
        
        // Soft gradients for backgrounds
        "gradient-soft-blue": "linear-gradient(135deg, #E8F4FC 0%, #F5F9FD 100%)",
        "gradient-soft-purple": "linear-gradient(135deg, #F0F0FF 0%, #F8F8FF 100%)",
        "gradient-soft-yellow": "linear-gradient(135deg, #FFFAEB 0%, #FFF8E1 100%)",
        "gradient-soft-green": "linear-gradient(135deg, #F0F8F0 0%, #F5FAF5 100%)",
        
        // Card gradients
        "card-gradient-primary": "linear-gradient(135deg, rgba(41, 171, 226, 0.1) 0%, rgba(106, 61, 232, 0.1) 100%)",
        "card-gradient-secondary": "linear-gradient(135deg, rgba(255, 218, 99, 0.1) 0%, rgba(255, 140, 0, 0.1) 100%)",
        "card-gradient-success": "linear-gradient(135deg, rgba(143, 188, 143, 0.1) 0%, rgba(46, 139, 87, 0.1) 100%)",
        "card-gradient-info": "linear-gradient(135deg, rgba(106, 61, 232, 0.1) 0%, rgba(41, 171, 226, 0.1) 100%)",
      },
    },
  },
  plugins: [],
};
