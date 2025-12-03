import { ShoppingCart, MessageCircle, Zap, Rocket, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

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
  const title1 = "Get started in";
  const title2 = "5 easy steps";

  const letterVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.04,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section id="how-it-works" className="py-24 bg-[#020617]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 shadow-soft mb-6"
          >
            <span className="text-sm font-medium text-white/90">
              Simple Process
            </span>
          </motion.div>
          
          {/* Animated Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            {/* First line - white */}
            <span className="block text-white mb-2">
              {title1.split("").map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={letterVariants}
                  className="inline-block"
                  style={{ display: char === " " ? "inline" : "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            
            {/* Second line - italic with gradient */}
            <span className="block italic">
              {title2.split("").map((char, i) => (
                <motion.span
                  key={i}
                  custom={i + title1.length}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={letterVariants}
                  className="inline-block bg-gradient-to-r from-primary via-[hsl(230,80%,70%)] to-secondary bg-clip-text text-transparent"
                  style={{ display: char === " " ? "inline" : "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg text-white/70 mt-6 max-w-xl mx-auto"
          >
            From setup to success in minutes. Our streamlined workflow gets you up and running fast,
            so you can focus on growing your business.
          </motion.p>
        </div>

        {/* Steps Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col lg:flex-row gap-8 items-center ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
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
                    <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-strong">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-primary to-transparent" />
                    )}
                  </div>

                  {/* Spacer for alignment */}
                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
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
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
