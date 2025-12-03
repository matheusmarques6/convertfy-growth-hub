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

        {/* Light Cone/Glow spreading downward */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="absolute top-0 w-[300px] sm:w-[450px] md:w-[600px] h-[250px] origin-top"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 212, 255, 0.3) 0%, rgba(0, 212, 255, 0.1) 30%, transparent 100%)',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
          }}
        />

        {/* Soft ambient glow */}
        <div 
          className="absolute top-0 w-[400px] sm:w-[500px] md:w-[700px] h-[200px] opacity-40"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(0, 212, 255, 0.4) 0%, transparent 70%)',
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
