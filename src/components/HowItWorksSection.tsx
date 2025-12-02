import { Database, Wand2, Send, LineChart, Repeat } from "lucide-react";

const steps = [
  {
    icon: Database,
    number: "01",
    title: "Connect Your Store",
    description: "Integrate your e-commerce platform in seconds. Import your data and sync your customer database automatically.",
  },
  {
    icon: Wand2,
    number: "02",
    title: "Build Campaigns",
    description: "Create email and SMS automation flows with our intuitive drag-and-drop builder or use pre-built templates.",
  },
  {
    icon: Send,
    number: "03",
    title: "Schedule & Trigger",
    description: "Set up automated triggers based on customer behavior or schedule campaigns for optimal engagement.",
  },
  {
    icon: LineChart,
    number: "04",
    title: "Monitor Results",
    description: "Track real-time performance metrics, conversion rates, and revenue impact directly in your dashboard.",
  },
  {
    icon: Repeat,
    number: "05",
    title: "Optimize & Scale",
    description: "Use AI-powered insights to refine your strategy, test variants, and continuously improve your results.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-accent/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 shadow-soft">
            <span className="text-sm font-medium text-accent-foreground">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Get started in
            <span className="block gradient-primary bg-clip-text text-transparent">
              5 easy steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From setup to success in minutes. Our streamlined workflow gets you up and running fast,
            so you can focus on growing your business.
          </p>
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
                      <div className="text-6xl font-bold text-primary/10 mb-2">
                        {step.number}
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed max-w-md">
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
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center p-8 rounded-2xl bg-card border border-border shadow-soft">
            <div className="text-left">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Ready to get started?
              </h3>
              <p className="text-muted-foreground">
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
