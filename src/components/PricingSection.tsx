import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for small businesses getting started",
    features: [
      "Up to 5,000 contacts",
      "Email & SMS campaigns",
      "Basic automation flows",
      "Real-time analytics",
      "Email support",
      "1 user account",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    description: "For growing businesses that need more power",
    features: [
      "Up to 25,000 contacts",
      "Advanced automation",
      "A/B testing",
      "Custom segments",
      "Priority support",
      "5 user accounts",
      "API access",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large teams with custom requirements",
    features: [
      "Unlimited contacts",
      "White-label options",
      "Dedicated account manager",
      "Custom SLA",
      "Advanced security",
      "Unlimited users",
      "Custom development",
      "Training & onboarding",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24" style={{ background: 'linear-gradient(180deg, #091C7D 0%, #0a0a1a 100%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-soft"
            style={{ 
              backgroundColor: 'rgba(42, 63, 187, 0.1)',
              border: '1px solid rgba(42, 63, 187, 0.2)'
            }}
          >
            <span className="text-sm font-medium text-white/90">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Choose the perfect plan
            <span className="block gradient-primary bg-clip-text text-transparent">
              for your business
            </span>
          </h2>
          <p className="text-lg text-gray-text">
            All plans include 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 shadow-soft transition-smooth animate-fade-in ${
                plan.popular
                  ? "scale-105 lg:scale-110"
                  : "hover:shadow-medium"
              }`}
              style={{ 
                backgroundColor: 'rgba(42, 63, 187, 0.1)',
                border: plan.popular ? '2px solid #FAD469' : '1px solid rgba(42, 63, 187, 0.2)',
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-medium"
                    style={{ backgroundColor: '#FAD469', color: '#0a0a1a' }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-text mb-6">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-text">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                size="lg"
                className={`w-full mb-8 text-white`}
                style={{ backgroundColor: '#5B3AF1' }}
              >
                {plan.cta}
              </Button>

              {/* Features List */}
              <div className="space-y-4">
                <div className="text-sm font-semibold text-white mb-4">
                  What's included:
                </div>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                    <span className="text-sm text-gray-text flex-1">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="mt-16 text-center animate-fade-in">
          <p className="text-gray-text mb-4">
            Have questions about pricing or features?
          </p>
          <button className="font-semibold hover:underline underline-offset-4 transition-smooth" style={{ color: '#5B3AF1' }}>
            View pricing FAQ →
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;