import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

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
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const handleStartTrial = () => {
    if (isAuthenticated) {
      logout();
    }
    navigate('/register');
  };

  return (
    <section id="pricing" className="py-24" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-soft"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}
          >
            <span className="text-sm font-medium text-text-secondary">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Choose the perfect plan
            <span className="block" style={{ color: '#3B82F6' }}>
              for your business
            </span>
          </h2>
          <p className="text-lg text-text-body">
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
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                border: plan.popular ? '2px solid #3B82F6' : '1px solid rgba(59, 130, 246, 0.2)',
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-medium text-white"
                    style={{ backgroundColor: '#3B82F6' }}
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
                <p className="text-sm text-text-secondary mb-6">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-text-secondary">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* CTA Button - WhatsApp Green */}
              <Button
                size="lg"
                className="w-full mb-8 text-white hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}
                onClick={handleStartTrial}
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
                      <Check className="w-5 h-5" style={{ color: '#22C55E' }} />
                    </div>
                    <span className="text-sm text-text-body flex-1">
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
          <p className="text-text-secondary mb-4">
            Have questions about pricing or features?
          </p>
          <button className="font-semibold hover:underline underline-offset-4 transition-smooth" style={{ color: '#60A5FA' }}>
            View pricing FAQ →
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
