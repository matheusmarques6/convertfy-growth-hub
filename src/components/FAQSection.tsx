import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What platforms does Convertfy integrate with?",
    answer: "Convertfy seamlessly integrates with all major e-commerce platforms including Shopify, WooCommerce, Magento, BigCommerce, and custom stores via our API. We also connect with popular marketing tools, analytics platforms, and payment processors.",
  },
  {
    question: "How long does setup and onboarding take?",
    answer: "Most businesses are up and running within 15-30 minutes. Our streamlined onboarding process guides you through connecting your store, importing contacts, and setting up your first campaign. Our support team is available to help if needed.",
  },
  {
    question: "What kind of support do you provide?",
    answer: "All plans include email support with response times under 24 hours. Professional and Enterprise plans receive priority support with faster response times. Enterprise customers get a dedicated account manager and custom SLA agreements.",
  },
  {
    question: "Can I migrate from another CRM platform?",
    answer: "Absolutely! We provide free migration assistance to help you transfer your contacts, campaign history, and automation workflows from your existing platform. Our team will work with you to ensure a smooth transition with zero data loss.",
  },
  {
    question: "What are your deliverability rates and security measures?",
    answer: "We maintain a 99.9% deliverability rate through dedicated IP pools, sender authentication, and compliance best practices. All data is encrypted at rest and in transit. We're GDPR compliant, SOC 2 certified, and follow industry-leading security standards.",
  },
  {
    question: "Are there any usage limits or additional fees?",
    answer: "Each plan includes specified contact limits and email/SMS sends. Additional contacts or sends can be purchased as needed. There are no hidden fees, setup costs, or long-term contracts. You can upgrade, downgrade, or cancel anytime.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 shadow-soft">
            <span className="text-sm font-medium text-accent-foreground">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Frequently asked
            <span className="block gradient-primary bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto animate-fade-in">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border shadow-soft hover:shadow-medium transition-smooth px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-accent border border-border shadow-soft">
            <h3 className="text-xl font-bold text-foreground">
              Still have questions?
            </h3>
            <p className="text-muted-foreground max-w-md">
              Our team is here to help. Get in touch and we'll respond within 24 hours.
            </p>
            <button className="px-6 py-3 gradient-primary text-white font-semibold rounded-lg shadow-medium hover:shadow-strong transition-smooth">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
