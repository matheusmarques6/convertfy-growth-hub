import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
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
    >
      {/* Background Gradient - Furthest Back */}
      <div className="absolute inset-0 gradient-hero -z-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 gradient-glow -z-20 animate-glow" />

      {/* Google Gemini Effect - Scroll-Driven Animation with CRM Content */}
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
        title="All-in-One CRM Platform"
        description="Recover abandoned carts, increase LTV, automate your marketing — scroll to see the magic"
      />
      
      {/* Original Hero Content - Below Animation */}
      <div className="sticky top-0 h-screen flex items-center z-20 pointer-events-none">
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="group">
              Start Free Trial
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-smooth" />
            </Button>
            <Button variant="outline" size="xl" className="group">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Detailed Hero Content Section - After Animation */}
      <div className="relative bg-background py-20 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 shadow-soft">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-accent-foreground">
                  #1 CRM for E-commerce Growth
                </span>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">Cancel anytime</span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">Trusted by 10,000+ e-commerce brands</p>
                <div className="flex items-center gap-8 opacity-60">
                  <div className="text-2xl font-bold">Shopify</div>
                  <div className="text-2xl font-bold">WooCommerce</div>
                  <div className="text-2xl font-bold">Magento</div>
                </div>
              </div>
            </div>

            {/* Right Column - Dashboard Mockup */}
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden shadow-strong border border-border bg-card">
                {/* Mockup Header */}
                <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center text-sm text-muted-foreground font-medium">
                    Dashboard Overview
                  </div>
                </div>
                
                {/* Mockup Content */}
                <div className="p-6 bg-gradient-to-br from-background to-accent/20 space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card rounded-xl p-4 shadow-soft border border-border">
                      <div className="text-sm text-muted-foreground mb-1">Cart Recovery</div>
                      <div className="text-2xl font-bold text-success">+37%</div>
                    </div>
                    <div className="bg-card rounded-xl p-4 shadow-soft border border-border">
                      <div className="text-sm text-muted-foreground mb-1">Revenue</div>
                      <div className="text-2xl font-bold text-primary">$124K</div>
                    </div>
                  </div>
                  
                  {/* Chart Placeholder */}
                  <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
                    <div className="space-y-3">
                      <div className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full" />
                      <div className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full w-4/5" />
                      <div className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full w-3/5" />
                      <div className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -top-6 -right-6 bg-success text-success-foreground rounded-2xl p-4 shadow-strong animate-bounce">
                <div className="text-sm font-medium">+42% LTV</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
