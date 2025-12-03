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
        "relative w-full flex flex-col items-center justify-center overflow-hidden py-20",
        className
      )}
      style={{ backgroundColor: '#0a0a1a' }}
    >
      {/* Lamp Light Effect - Centered */}
      <div className="relative w-full flex flex-col items-center justify-center">
        {/* Solid LED Light Bar with gradient */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.5 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex justify-center"
        >
          <div 
            className="w-[50vw] max-w-[500px] min-w-[200px] h-[6px] rounded animate-lamp-pulse"
            style={{
              background: 'linear-gradient(90deg, #2A3FBB 0%, #5B3AF1 50%, #2A3FBB 100%)',
              boxShadow: '0 0 20px 5px rgba(91, 58, 241, 0.8), 0 0 60px 20px rgba(91, 58, 241, 0.4), 0 0 120px 50px rgba(91, 58, 241, 0.2)'
            }}
          />
        </motion.div>

        {/* Light Cone spreading downward */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[800px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 80% at 50% 0%, rgba(91, 58, 241, 0.25) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Content - Centered */}
      <div className="relative z-20 mt-12 w-full flex flex-col items-center justify-center text-center px-4">
        {children}
      </div>
    </div>
  );
};