"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden bg-[#020617] w-full py-20",
        className
      )}
    >
      {/* Lamp Light Effect */}
      <div className="relative w-full flex flex-col items-center">
        {/* Horizontal Light Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.5 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div 
            className="w-[200px] sm:w-[300px] md:w-[400px] h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent animate-lamp-pulse"
            style={{
              boxShadow: '0 0 20px 5px rgba(0, 212, 255, 0.6), 0 0 60px 20px rgba(0, 212, 255, 0.4), 0 0 100px 40px rgba(0, 212, 255, 0.2)'
            }}
          />
        </motion.div>

        {/* Light Cone/Glow spreading downward - smooth gradient only */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="absolute top-0 w-[500px] sm:w-[600px] md:w-[800px] h-[300px] origin-top"
          style={{
            background: 'radial-gradient(ellipse 50% 100% at 50% 0%, rgba(0, 212, 255, 0.25) 0%, rgba(0, 212, 255, 0.08) 40%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 mt-8">
        {children}
      </div>
    </div>
  );
};
