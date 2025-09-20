import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import CursorBlinker from "./CursorBlinker";
export default function TextAnim() {
  const baseText = "Welcome to Name"; // If `text` is undefined, it will default to an empty string.
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => baseText.slice(0, latest));

  // Ensure this runs only on the client side
  useEffect(() => {
    const controls = animate(count, baseText.length, {
      type: "tween",
      duration: 4,
      ease: "easeInOut",
    });

    // Cleanup the animation on component unmount
    return () => controls.stop();
  }, [baseText]); // Added baseText as a dependency

  return (
    <span>
      <motion.span>{displayText}</motion.span>
      <CursorBlinker />
    </span>
  );
}
