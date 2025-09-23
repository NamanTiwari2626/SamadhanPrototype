"use client";

import React from "react";
import { motion, useAnimation, type Variants } from "framer-motion";

const fileVariants: Variants = {
  normal: {
    scale: 1,
    rotate: 0,
  },
  animate: {
    scale: [1, 1.05, 1],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const lineVariants: Variants = {
  normal: {
    scaleX: 1,
    opacity: 1,
  },
  animate: {
    scaleX: [1, 0.8, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

interface FileTextAnimatedProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
  isHovering?: boolean;
}

const FileTextAnimated = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  isHovering,
  ...props
}: FileTextAnimatedProps) => {
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
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          variants={fileVariants}
          animate={controls}
          initial="normal"
        />
        <motion.polyline
          points="14,2 14,8 20,8"
          variants={fileVariants}
          animate={controls}
          initial="normal"
        />
        <motion.line
          x1="16"
          y1="13"
          x2="8"
          y2="13"
          variants={lineVariants}
          animate={controls}
          initial="normal"
        />
        <motion.line
          x1="16"
          y1="17"
          x2="8"
          y2="17"
          variants={lineVariants}
          animate={controls}
          initial="normal"
        />
        <motion.polyline
          points="10,9 9,9 8,9"
          variants={lineVariants}
          animate={controls}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export { FileTextAnimated };
