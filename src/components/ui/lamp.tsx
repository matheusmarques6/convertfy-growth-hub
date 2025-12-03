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
        "relative w-full flex flex-col items-center justify-center overflow-hidden bg-[#020617] py-20",
        className
      )}
    >
      {/* Lamp Light Effect - Centered */}
      <div className="relative w-full flex flex-col items-center justify-center">
        {/* Solid LED Light Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.5 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex justify-center"
        >
          <div 
            className="w-[50vw] max-w-[500px] min-w-[200px] h-[6px] rounded bg-[#00d4ff] animate-lamp-pulse"
            style={{
              boxShadow: '0 0 20px 5px rgba(0, 212, 255, 0.8), 0 0 60px 20px rgba(0, 212, 255, 0.4), 0 0 120px 50px rgba(0, 212, 255, 0.2)'
            }}
          />
        </motion.div>

        {/* Light Cone spreading downward */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[70vw] max-w-[700px] h-[350px] origin-top pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0, 212, 255, 0.3) 0%, rgba(0, 212, 255, 0.1) 40%, transparent 70%)',
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
