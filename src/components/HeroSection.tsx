// Removed unused imports
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { useScroll, useTransform } from "framer-motion";
import React from "react";

const HeroSection = () => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <section 
      id="home" 
      ref={ref}
      className="relative h-[300vh]"
      style={{ backgroundColor: '#020617' }}
    >
      {/* Google Gemini Effect - Neon Lines in Bottom Half */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Hero Content - Top Half */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 space-y-8 mb-24">
          {/* Title */}
          <h1 className="text-[64px] md:text-[72px] font-bold text-white leading-tight tracking-tight">
            All-in-One CRM Platform
          </h1>
          
          {/* Subtitle */}
          <p className="text-[18px] md:text-[20px] max-w-[620px] mx-auto leading-relaxed" style={{ color: '#C8D2FF' }}>
            Recover abandoned carts, increase LTV, automate your marketing — all in one place with intelligent automation
          </p>
          
          {/* CTA Button */}
          <button className="px-8 py-4 bg-white text-black font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 mt-4">
            Start Free Trial
          </button>
        </div>

        {/* Neon Lines - Bottom Half */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 z-10">
          <GoogleGeminiEffect
            pathLengths={[
              pathLengthFirst,
              pathLengthSecond,
              pathLengthThird,
              pathLengthFourth,
              pathLengthFifth,
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
