import React from 'react';

export default function Mascot({ emotion = 'neutral', size = 44 }) {
  // Define SVG paths and properties for different emotions
  const emotions = {
    neutral: {
      leftEye: <circle cx="29" cy="33" r="6" fill="#0f766e" />,
      rightEye: <circle cx="51" cy="33" r="6" fill="#0f766e" />,
      mouth: <line x1="35" y1="46" x2="45" y2="46" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" />
    },
    happy: {
      // Curved eyes for happy emotion
      leftEye: <path d="M24 35 Q29 28 34 35" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" fill="none" />,
      rightEye: <path d="M46 35 Q51 28 56 35" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" fill="none" />,
      // Big smiling mouth
      mouth: <path d="M30 44 Q40 52 50 44" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    },
    sad: {
      leftEye: <circle cx="29" cy="34" r="5" fill="#0f766e" opacity="0.8" />,
      rightEye: <circle cx="51" cy="34" r="5" fill="#0f766e" opacity="0.8" />,
      // Pouting mouth for sad emotion
      mouth: <path d="M32 48 Q40 43 48 48" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    },
    thinking: {
      // Asymmetrical eyes indicating confusion or thinking
      leftEye: <circle cx="29" cy="32" r="6" fill="#0f766e" />,
      rightEye: <line x1="47" y1="33" x2="55" y2="33" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />,
      // Crooked mouth
      mouth: <line x1="32" y1="46" x2="40" y2="44" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" />
    }
  };

  // Fallback to neutral if an undefined emotion is passed
  const currentEmotion = emotions[emotion] || emotions.neutral;

  return (
    <div style={{ width: size, height: size, flexShrink: 0, transition: 'all 0.3s ease' }}>
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        {/* Top antenna */}
        <line x1="40" y1="8" x2="40" y2="18" stroke="#0f766e" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="40" cy="6" r="4" fill={emotion === 'happy' ? "#f59e0b" : "#0f766e"} transition="fill 0.3s ease"/>
        
        {/* Main body base */}
        <rect x="16" y="18" width="48" height="38" rx="12" fill="#ccfbf1" stroke="#0f766e" strokeWidth="2.5"/>
        
        {/* Dynamic eyes and mouth */}
        <g style={{ transition: 'all 0.3s ease' }}>
          {currentEmotion.leftEye}
          {currentEmotion.rightEye}
          {currentEmotion.mouth}
        </g>
        
        {/* Highlights (only show when eyes are full circles) */}
        {emotion === 'neutral' && (
          <>
            <circle cx="31" cy="31" r="2" fill="white"/>
            <circle cx="53" cy="31" r="2" fill="white"/>
          </>
        )}

        {/* Bottom chassis */}
        <rect x="24" y="56" width="32" height="16" rx="6" fill="#99f6e4" stroke="#0f766e" strokeWidth="2"/>
        <circle cx="40" cy="64" r="4" fill="#0f766e" opacity="0.6"/>
      </svg>
    </div>
  );
}