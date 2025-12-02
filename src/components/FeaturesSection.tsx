import { Radio, Blocks, Cloud, Users } from "lucide-react";

const features = [
  {
    icon: Radio,
    title: "Smart Broadcasts",
    description: "Send campaigns to thousands of customers in minutes. Track in real-time: delivered, seen, clicked. Know exactly what works.",
    color: "text-primary",
  },
  {
    icon: Blocks,
    title: "No-Code Automations",
    description: "Build sales, support, and engagement flows by dragging and dropping. Zero programming, results in minutes. Serve customers 24/7 on autopilot.",
    color: "text-secondary",
  },
  {
    icon: Cloud,
    title: "Official WhatsApp API",
    description: "Direct connection to Meta Cloud API. No ban risk, no instability. Operate in 180+ countries with full security and compliance.",
    color: "text-success",
  },
  {
    icon: Users,
    title: "Unlimited Team, One Number",
    description: "Add as many agents as you need. Assign conversations, monitor performance, scale your support without losing control.",
    color: "text-primary",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 shadow-soft">
            <span className="text-sm font-medium text-accent-foreground">
              Why Choose Convertfy
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Everything you need to
            <span className="block gradient-primary bg-clip-text text-transparent">
              scale WhatsApp sales
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Built for serious dropshippers. No-code tools, official API, and unlimited team management
            to help you grow without limits.
          </p>
        </div>

        {/* Features Grid - 2x2 Layout */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-card rounded-2xl p-8 shadow-soft border border-border hover:shadow-medium hover:border-primary/20 transition-smooth animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-accent mb-6 ${feature.color} group-hover:scale-110 transition-smooth shadow-soft`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-smooth -z-10" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-fade-in">
          <p className="text-muted-foreground mb-4">
            Ready to scale your WhatsApp sales?
          </p>
          <button className="text-primary font-semibold hover:underline underline-offset-4 transition-smooth">
            Start your free trial →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
