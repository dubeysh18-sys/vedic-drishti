import React from "react";

interface LotusIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function LotusIcon({
  className = "w-4 h-4 text-current",
  ...props
}: LotusIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Central Petal */}
      <path
        d="M12 3.5C10.5 7.5 10 11.5 12 17.5C14 11.5 13.5 7.5 12 3.5Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      {/* Left Inner Petal */}
      <path
        d="M12 17.5C9.2 14 7.5 10.2 8.8 6.2C10.6 8 11.6 12 12 17.5Z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      {/* Right Inner Petal */}
      <path
        d="M12 17.5C14.8 14 16.5 10.2 15.2 6.2C13.4 8 12.4 12 12 17.5Z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      {/* Left Outer Petal */}
      <path
        d="M12 17.5C7.8 16 4.5 13.5 5.5 9.8C7.8 10.2 10.2 13 12 17.5Z"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {/* Right Outer Petal */}
      <path
        d="M12 17.5C16.2 16 19.5 13.5 18.5 9.8C16.2 10.2 13.8 13 12 17.5Z"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {/* Lotus Calyx / Base Curves */}
      <path d="M7.5 19.5C10 20.8 14 20.8 16.5 19.5" strokeWidth="1.25" />
      <path d="M9.5 21.5C11 22.2 13 22.2 14.5 21.5" strokeWidth="1" />
    </svg>
  );
}
