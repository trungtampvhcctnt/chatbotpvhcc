import React from 'react';

interface CchcLogoProps {
  className?: string;
  variant?: 'gold' | 'red' | 'white';
}

/**
 * Biểu trưng Cải cách Hành chính (5 bàn tay chụm lại hình ngôi sao)
 */
export const CchcLogo: React.FC<CchcLogoProps> = ({ 
  className = 'w-8 h-8', 
  variant = 'gold' 
}) => {
  const getColors = () => {
    switch (variant) {
      case 'red':
        return {
          bg: '#ef4444',
          star: '#b91c1c',
          hands: '#dc2626',
          stroke: '#991b1b'
        };
      case 'white':
        return {
          bg: 'transparent',
          star: '#ffffff',
          hands: '#ffffff',
          stroke: 'rgba(255,255,255,0.8)'
        };
      case 'gold':
      default:
        return {
          bg: '#b91c1c',
          star: '#facc15',
          hands: '#f59e0b',
          stroke: '#fbbf24'
        };
    }
  };

  const c = getColors();

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 5 Interlocking stylized hands forming a 5-point star */}
      <circle cx="50" cy="50" r="46" fill={c.bg} />
      
      {/* Central stylized star with interlocking hand arms */}
      <g stroke={c.stroke} strokeWidth="1.5" strokeLinejoin="round" fill={c.star}>
        {/* Hand 1 (Top) */}
        <path d="M50 14 L55 29 C58 27 63 29 65 33 L58 45 L50 41 L42 45 L35 33 C37 29 42 27 45 29 Z" />
        {/* Hand 2 (Top Right) */}
        <path d="M84 39 L71 47 C71 50 73 55 77 58 L66 69 L61 63 L61 53 L73 45 C75 42 75 37 71 34 Z" fill={c.hands} />
        {/* Hand 3 (Bottom Right) */}
        <path d="M71 85 L59 75 C56 76 52 79 51 84 L38 80 L40 72 L47 66 L52 76 C55 79 60 80 64 77 Z" />
        {/* Hand 4 (Bottom Left) */}
        <path d="M29 85 L36 71 C34 68 31 66 26 67 L19 55 L26 52 L36 55 L33 67 C32 71 34 76 38 78 Z" fill={c.hands} />
        {/* Hand 5 (Top Left) */}
        <path d="M16 39 L27 34 C31 37 31 42 33 45 L45 53 L45 63 L39 69 L28 58 C32 55 34 50 34 47 Z" />
      </g>

      {/* Central star center */}
      <polygon 
        points="50,33 54,43 65,43 56,50 59,60 50,54 41,60 44,50 35,43 46,43" 
        fill={variant === 'white' ? '#dc2626' : '#fef08a'} 
        stroke={c.stroke}
        strokeWidth="1"
      />
    </svg>
  );
};
