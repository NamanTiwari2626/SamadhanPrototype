"use client";

import React from "react";
import { motion, useAnimation, type Variants } from "framer-motion";

const capVariants: Variants = {
  normal: {
    y: 0,
    rotate: 0,
  },
  animate: {
    y: [-2, 2, -2],
    rotate: [-1, 1, -1],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const tasselVariants: Variants = {
  normal: {
    rotate: 0,
  },
  animate: {
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

interface GraduationCapAnimatedProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
  isHovering?: boolean;
}

const GraduationCapAnimated = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  isHovering,
  ...props
}: GraduationCapAnimatedProps) => {
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
        <motion.path
          d="M22 10v6M2 10l10-5 10 5-10 5z"
          variants={capVariants}
          animate={controls}
          initial="normal"
        />
        <motion.path
          d="M6 12v5c3 3 9 3 12 0v-5"
          variants={capVariants}
          animate={controls}
          initial="normal"
        />
        <motion.path
          d="M12 5v7"
          variants={tasselVariants}
          animate={controls}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export { GraduationCapAnimated };
