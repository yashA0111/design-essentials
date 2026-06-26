"use client";

import { motion } from "framer-motion";
import { pageVariants } from "@/components/animations/pageVariants";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}
