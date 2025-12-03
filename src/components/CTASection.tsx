import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto">
          {/* Background Glow Effect */}
          <div 
            className="absolute inset-0 rounded-3xl -z-10 animate-glow"
            style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)' }}
          />
          
          {/* CTA Card */}
          <div 
            className="relative rounded-3xl p-12 md:p-16 shadow-strong overflow-hidden"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl -z-10" style={{ background: '#3B82F6' }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10 rounded-full blur-3xl -z-10" style={{ background: '#818CF8' }} />
            
            <div className="relative z-10 text-center space-y-8 animate-fade-in">
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-soft"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
              >
                <Sparkles className="w-4 h-4" style={{ color: '#3B82F6' }} />
                <span className="text-sm font-medium text-text-secondary">Start your 14-day free trial</span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Ready to grow your
                  <span className="block" style={{ color: '#3B82F6' }}>e-commerce business?</span>
                </h2>
                <p className="text-xl text-text-body max-w-2xl mx-auto">
                  Join 10,000+ brands using Convertfy to recover abandoned carts, 
                  increase customer lifetime value, and automate their marketing.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
                  14-day free trial
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
                  Cancel anytime
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button 
                  size="lg" 
                  className="group text-white px-8 py-6 text-lg hover:opacity-90"
                  style={{ backgroundColor: '#25D366' }}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-smooth" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-white px-8 py-6 text-lg"
                  style={{ borderColor: 'rgba(59, 130, 246, 0.3)', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Schedule a Demo
                </Button>
              </div>

              {/* Bottom Note */}
              <p className="text-sm text-text-secondary pt-4">
                Questions? Our team is here to help.{" "}
                <button className="font-semibold hover:underline underline-offset-4 transition-smooth" style={{ color: '#60A5FA' }}>
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