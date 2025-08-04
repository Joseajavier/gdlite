import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

const FaceIdIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <rect x="3" y="3" width="18" height="18" rx="4" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="12" r="3.5" stroke={color} strokeWidth="2" />
    <path d="M8 16c.667-1.333 2-2 4-2s3.333.667 4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="9.5" cy="10.5" r=".5" fill={color} />
    <circle cx="14.5" cy="10.5" r=".5" fill={color} />
  </svg>
);

export default FaceIdIcon;
