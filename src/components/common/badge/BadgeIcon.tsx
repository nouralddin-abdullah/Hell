import React from 'react';
import { mightyBadge, goldBadge, silverBadge, bronzeBadge } from "../../../assets";

interface BadgeIconProps {
  badge: {
    _id: string;
    name: string;
    icon: string;
  };
  size?: number;
}

const BadgeIcon: React.FC<BadgeIconProps> = ({ badge, size = 25 }) => {
  // Map badge icon names to imported assets
  const getBadgeImage = (iconName: string) => {
    if (iconName.includes('mighty')) return mightyBadge;
    if (iconName.includes('gold')) return goldBadge;
    if (iconName.includes('silver')) return silverBadge;
    if (iconName.includes('bronze')) return bronzeBadge;
    
    // Default fallback based on badge name
    if (badge.name.toLowerCase().includes('mighty')) return mightyBadge;
    if (badge.name.toLowerCase().includes('gold')) return goldBadge;
    if (badge.name.toLowerCase().includes('silver')) return silverBadge;
    return bronzeBadge; // Default to bronze
  };

  return (
    <img
      src={getBadgeImage(badge.icon)}
      alt={badge.name}
      title={badge.name}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        marginLeft: '5px',
        verticalAlign: 'middle'
      }}
    />
  );
};

export default BadgeIcon;
