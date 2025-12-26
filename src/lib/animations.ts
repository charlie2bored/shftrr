// Animation utilities for micro-interactions

export const hoverScale = "transform transition-transform duration-200 hover:scale-105 active:scale-95";

export const buttonPress = "transform transition-all duration-100 active:scale-95 active:brightness-110";

export const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-300";

export const slideInRight = "animate-in slide-in-from-right-4 duration-300";

export const slideInLeft = "animate-in slide-in-from-left-4 duration-300";

export const bounceIn = "animate-in zoom-in-95 bounce-in duration-500";

export const pulse = "animate-pulse";

export const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

// Custom keyframes for shimmer effect
export const shimmerKeyframes = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

// Button hover effects
export const buttonHover = `
  relative overflow-hidden transition-all duration-200
  hover:shadow-lg hover:shadow-white/10
  before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-700
  hover:before:translate-x-[100%]
`;

// Card hover effects
export const cardHover = `
  transition-all duration-300
  hover:shadow-xl hover:shadow-black/20
  hover:border-gray-500
  hover:-translate-y-1
`;

// Input focus effects
export const inputFocus = `
  transition-all duration-200
  focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
  focus:border-white
`;

