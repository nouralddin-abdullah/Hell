import React from "react";
import { motion } from "framer-motion";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.main
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
    >
      {children}
    </motion.main>
  );
};

export default PageWrapper;
