"use client";

import React from "react";
import { motion, useAnimation, type Variants } from "framer-motion";

const pathVariant: Variants = {
  normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    pathOffset: [1, 0],
  },
};

const circleVariant: Variants = {
  normal: {
    pathLength: 1,
    pathOffset: 0,
    scale: 1,
  },
  animate: {
    pathLength: [0, 1],
    pathOffset: [1, 0],
    scale: [0.5, 1],
  },
};

interface UserAnimatedProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
  isHovering?: boolean;
}

const UserAnimated = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  isHovering,
  ...props
}: UserAnimatedProps) => {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start(isHovering ? "animate" : "normal");
  }, [isHovering, controls]);

  return (
    <div
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <motion.circle
          cx="12"
          cy="8"
          r="5"
          animate={controls}
          variants={circleVariant}
          initial="normal"
        />
        <motion.path
          d="M20 21a8 8 0 0 0-16 0"
          variants={pathVariant}
          transition={{
            delay: 0.2,
            duration: 0.4,
          }}
          animate={controls}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export { UserAnimated };
