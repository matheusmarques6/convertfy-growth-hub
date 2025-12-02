import { Mail, Zap, BarChart3, Calendar, Shield, Boxes } from "lucide-react";

const features = [
  {
    icon: Mail,
    title: "Email & SMS Automation",
    description: "Create intelligent flows for cart abandonment, post-purchase engagement, and re-activation campaigns.",
    color: "text-primary",
  },
  {
    icon: Boxes,
    title: "E-commerce Integrations",
    description: "Seamlessly connect with Shopify, WooCommerce, Magento, and custom stores via powerful APIs.",
    color: "text-secondary",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Visualize recovered revenue, LTV growth, conversion rates, and campaign performance in real-time.",
    color: "text-success",
  },
  {
    icon: Calendar,
    title: "Campaign Management",
    description: "Schedule sends, segment audiences, and manage multi-channel campaigns from one unified interface.",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Enterprise-grade security with GDPR compliance, data encryption, and 99.9% deliverability rates.",
    color: "text-secondary",
  },
  {
    icon: Zap,
    title: "Fast Onboarding",
    description: "Get started in minutes with intuitive UI, pre-built templates, and dedicated support team.",
    color: "text-success",
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
              Powerful Features
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Everything you need to
            <span className="block gradient-primary bg-clip-text text-transparent">
              grow your business
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our all-in-one platform combines powerful automation, deep analytics, and seamless integrations
            to help you maximize revenue and customer lifetime value.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            Want to see how it all works together?
          </p>
          <button className="text-primary font-semibold hover:underline underline-offset-4 transition-smooth">
            Explore full feature list →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
