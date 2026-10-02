import React from 'react';

interface RobotAvatarProps {
  className?: string;
  size?: number;
}

export const RobotAvatar: React.FC<RobotAvatarProps> = ({ 
  className = 'w-12 h-12',
  size = 48
}) => {
  return (
    <div 
      className={`relative rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 shadow-md border-2 border-white ring-2 ring-red-500/20 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full p-0.5"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Antennas / Earphones */}
        <circle cx="16" cy="46" r="6" fill="#64748b" />
        <circle cx="84" cy="46" r="6" fill="#64748b" />
        <rect x="18" y="42" width="6" height="8" rx="2" fill="#94a3b8" />
        <rect x="76" y="42" width="6" height="8" rx="2" fill="#94a3b8" />

        {/* Head Shell */}
        <rect x="22" y="20" width="56" height="52" rx="24" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        
        {/* Cap / Visor Top Band */}
        <path d="M26 36 C34 26 66 26 74 36" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="23" r="3.5" fill="#f59e0b" />

        {/* Dark Visor Screen */}
        <rect x="28" y="34" width="44" height="26" rx="12" fill="#0f172a" />

        {/* Visor shine */}
        <path d="M33 39 Q 50 35 67 39" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Friendly Glowing Eyes with Periodic Blinking Animation */}
        <defs>
          <style>{`
            @keyframes aiSvgBlink {
              0%, 80%, 86%, 92%, 100% {
                transform: scaleY(1);
                opacity: 1;
              }
              83%, 89% {
                transform: scaleY(0.08);
                opacity: 0.6;
              }
            }
            @keyframes aiSvgGlow {
              0%, 100% {
                filter: drop-shadow(0 0 1.5px #38bdf8);
              }
              50% {
                filter: drop-shadow(0 0 5px #7dd3fc);
              }
            }
            .ai-svg-eyes-wrap {
              animation: aiSvgGlow 3.5s ease-in-out infinite;
            }
            .ai-svg-eye-l {
              transform-origin: 40px 47px;
              animation: aiSvgBlink 4s ease-in-out infinite;
            }
            .ai-svg-eye-r {
              transform-origin: 60px 47px;
              animation: aiSvgBlink 4s ease-in-out infinite;
            }
          `}</style>
        </defs>

        <g className="ai-svg-eyes-wrap">
          <g className="ai-svg-eye-l">
            <ellipse cx="40" cy="47" rx="4.5" ry="5.5" fill="#38bdf8" />
            <circle cx="41.5" cy="45" r="1.5" fill="#ffffff" />
          </g>
          <g className="ai-svg-eye-r">
            <ellipse cx="60" cy="47" rx="4.5" ry="5.5" fill="#38bdf8" />
            <circle cx="61.5" cy="45" r="1.5" fill="#ffffff" />
          </g>
        </g>

        {/* Cute Smile / mouth */}
        <path d="M46 54 Q 50 57 54 54" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Cheeks blush */}
        <circle cx="33" cy="51" r="2" fill="#f43f5e" opacity="0.8" />
        <circle cx="67" cy="51" r="2" fill="#f43f5e" opacity="0.8" />

        {/* Body collar */}
        <path d="M34 72 L42 86 L58 86 L66 72 Z" fill="#b91c1c" />
        <path d="M46 72 L50 80 L54 72 Z" fill="#fbbf24" />
        <circle cx="50" cy="74" r="1.5" fill="#ffffff" />
      </svg>
    </div>
  );
};
