"use client";

import React from "react";
import { motion, useAnimation, type Variants } from "framer-motion";

const ringVariants: Variants = {
  normal: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

const centerVariants: Variants = {
  normal: {
    scale: 1,
  },
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

interface TargetAnimatedProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
  isHovering?: boolean;
}

const TargetAnimated = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  isHovering,
  ...props
}: TargetAnimatedProps) => {
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
          cy="12"
          r="10"
          variants={ringVariants}
          animate={controls}
          initial="normal"
        />
        <motion.circle
          cx="12"
          cy="12"
          r="6"
          variants={ringVariants}
          animate={controls}
          initial="normal"
        />
        <motion.circle
          cx="12"
          cy="12"
          r="2"
          variants={centerVariants}
          animate={controls}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export { TargetAnimated };
