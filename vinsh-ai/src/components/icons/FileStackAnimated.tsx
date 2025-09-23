"use client";

import React from "react";
import { motion, useAnimation, type Variants } from "framer-motion";

interface FileStackProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
  isHovering?: boolean;
}

const pathVariants: Variants = {
  normal: {
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  animate: {
    x: -4,
    y: 4,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

const bottomPathVariants: Variants = {
  normal: {
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  animate: {
    x: 4,
    y: -4,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

const FileStackAnimated = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "currentColor",
  isHovering,
  ...props
}: FileStackProps) => {
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
        <motion.g variants={pathVariants} animate={controls} initial="normal">
          <path d="M21 7h-3a2 2 0 0 1-2-2V2" />
          <path d="M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17Z" />
        </motion.g>
        <path d="M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15" />
        <motion.path
          d="M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11"
          variants={bottomPathVariants}
          animate={controls}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export { FileStackAnimated };
