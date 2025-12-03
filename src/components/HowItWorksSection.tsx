import { ShoppingCart, MessageCircle, Zap, Rocket, BarChart3 } from "lucide-react";
import { ElegantShape } from "@/components/ui/elegant-shape";

const steps = [
  {
    icon: ShoppingCart,
    number: "01",
    title: "Connect Your Store",
    description: "Integrate Shopify, WooCommerce, or Nuvemshop in seconds. Import your customers and orders automatically.",
  },
  {
    icon: MessageCircle,
    number: "02",
    title: "Link Your WhatsApp",
    description: "Connect your WhatsApp Business number via official Meta Cloud API. Verified, secure, and ban-free.",
  },
  {
    icon: Zap,
    number: "03",
    title: "Build Your Flows",
    description: "Create cart recovery, order updates, and broadcast campaigns with our drag-and-drop builder. No coding required.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Go Live & Send",
    description: "Launch automated messages or send broadcasts to thousands. Reach customers in 180+ countries instantly.",
  },
  {
    icon: BarChart3,
    number: "05",
    title: "Track & Scale",
    description: "Monitor delivery rates, conversions, and revenue recovered in real-time. Optimize and grow with data.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#020617]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Floating Shapes */}
        <div className="relative text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in overflow-hidden py-8">
          {/* Floating Shapes - positioned around the header */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <ElegantShape
              delay={0.3}
              width={300}
              height={70}
              rotate={12}
              gradient="from-indigo-500/[0.15]"
              className="left-[-15%] md:left-[-5%] top-[10%]"
            />
            <ElegantShape
              delay={0.5}
              width={250}
              height={60}
              rotate={-15}
              gradient="from-rose-500/[0.15]"
              className="right-[-10%] md:right-[0%] top-[60%]"
            />
            <ElegantShape
              delay={0.4}
              width={150}
              height={40}
              rotate={-8}
              gradient="from-violet-500/[0.15]"
              className="left-[5%] md:left-[10%] bottom-[5%]"
            />
            <ElegantShape
              delay={0.6}
              width={120}
              height={35}
              rotate={20}
              gradient="from-amber-500/[0.15]"
              className="right-[10%] md:right-[15%] top-[5%]"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 shadow-soft">
              <span className="text-sm font-medium text-white/90">
                Simple Process
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4">
              Get started in
              <span className="block gradient-primary bg-clip-text text-transparent">
                5 easy steps
              </span>
            </h2>
            <p className="text-lg text-white/70 mt-4">
              From setup to success in minutes. Our streamlined workflow gets you up and running fast,
              so you can focus on growing your business.
            </p>
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row gap-8 items-center animate-fade-in ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Step Content */}
                  <div className={`flex-1 ${isEven ? "lg:text-right" : "lg:text-left"}`}>
                    <div className="inline-block">
                      <div className="text-6xl font-bold text-primary/30 mb-2">
                        {step.number}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed max-w-md">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Step Icon */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-strong group-hover:shadow-glow transition-smooth">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-primary to-transparent" />
                    )}
                  </div>

                  {/* Spacer for alignment */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center animate-fade-in">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 shadow-soft">
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                Ready to get started?
              </h3>
              <p className="text-white/70">
                Join thousands of brands already using Convertfy
              </p>
            </div>
            <button className="px-8 py-4 gradient-primary text-white font-semibold rounded-lg shadow-medium hover:shadow-strong transition-smooth whitespace-nowrap">
              Start Free Trial →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
