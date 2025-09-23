"use client";

import React from "react";
import { motion, useAnimation, type Variants } from "framer-motion";

const pathVariants: Variants = {
  normal: {
    translateX: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 13,
    },
  },
  animate: {
    translateX: [-6, 0],
    transition: {
      delay: 0.1,
      type: "spring",
      stiffness: 200,
      damping: 13,
    },
  },
};

interface UsersAnimatedProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
  isHovering?: boolean; // allow parent-driven hover
}

const UsersAnimated = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  isHovering,
  ...props
}: UsersAnimatedProps) => {
  const controls = useAnimation();
  const [selfHovering, setSelfHovering] = React.useState(false);
  const effectiveHovering = isHovering !== undefined ? isHovering : selfHovering;

  React.useEffect(() => {
    controls.start(effectiveHovering ? "animate" : "normal");
  }, [effectiveHovering, controls]);

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
      onMouseEnter={isHovering === undefined ? () => controls.start("animate") : undefined}
      onMouseLeave={isHovering === undefined ? () => controls.start("normal") : undefined}
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <motion.path
          d="M22 21v-2a4 4 0 0 0-3-3.87"
          variants={pathVariants}
          animate={controls}
          initial="normal"
        />
        <motion.path
          d="M16 3.13a4 4 0 0 1 0 7.75"
          variants={pathVariants}
          animate={controls}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export { UsersAnimated };


