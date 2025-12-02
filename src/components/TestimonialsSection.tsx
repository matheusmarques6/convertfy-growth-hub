import { Star, TrendingUp } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "E-commerce Director",
    company: "Fashion Hub",
    image: "SC",
    content: "Convertfy helped us recover 37% more abandoned carts. The automation is incredible and the ROI speaks for itself.",
    metric: "+37% Cart Recovery",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Marketing Manager",
    company: "Tech Gadgets Co",
    image: "MR",
    content: "We increased customer LTV by 42% in just 3 months. The segmentation and targeting features are game-changing.",
    metric: "+42% LTV Growth",
    rating: 5,
  },
  {
    name: "Emma Thompson",
    role: "CEO",
    company: "Organic Beauty",
    image: "ET",
    content: "Best CRM investment we've made. Setup was quick, support is excellent, and results exceeded our expectations.",
    metric: "5x ROI",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-[#020617]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 shadow-soft">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-white/90">
              Customer Success Stories
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Loved by
            <span className="block gradient-primary bg-clip-text text-transparent">
              10,000+ brands
            </span>
          </h2>
          <p className="text-lg text-white/70">
            See how e-commerce businesses are growing revenue and recovering more sales with Convertfy CRM.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-2xl p-8 shadow-soft border border-white/10 hover:shadow-medium hover:border-primary/20 transition-smooth animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-white leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Metric Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">
                  {testimonial.metric}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold">
                    {testimonial.image}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-white/70">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <div className="text-sm text-white/70">Active Brands</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              $124M
            </div>
            <div className="text-sm text-white/70">Revenue Recovered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-sm text-white/70">Deliverability</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              4.9★
            </div>
            <div className="text-sm text-white/70">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
