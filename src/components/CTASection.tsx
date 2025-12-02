import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-accent/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto">
          {/* Background Glow Effect */}
          <div className="absolute inset-0 gradient-glow rounded-3xl -z-10 animate-glow" />
          
          {/* CTA Card */}
          <div className="relative bg-card rounded-3xl p-12 md:p-16 shadow-strong border border-border overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 gradient-primary opacity-10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl -z-10" />
            
            <div className="relative z-10 text-center space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 shadow-soft">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-accent-foreground">
                  Start your 14-day free trial
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Ready to grow your
                  <span className="block gradient-primary bg-clip-text text-transparent">
                    e-commerce business?
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join 10,000+ brands using Convertfy to recover abandoned carts, 
                  increase customer lifetime value, and automate their marketing.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  14-day free trial
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  Cancel anytime
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button variant="hero" size="xl" className="group">
                  Start Free Trial
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-smooth" />
                </Button>
                <Button variant="outline" size="xl">
                  Schedule a Demo
                </Button>
              </div>

              {/* Bottom Note */}
              <p className="text-sm text-muted-foreground pt-4">
                Questions? Our team is here to help.{" "}
                <button className="text-primary font-semibold hover:underline underline-offset-4 transition-smooth">
                  Contact us
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
