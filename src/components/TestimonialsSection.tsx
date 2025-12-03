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
    <section id="testimonials" className="py-24" style={{ background: 'linear-gradient(180deg, #091C7D 0%, #0a0a1a 100%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-soft"
            style={{ backgroundColor: 'rgba(42, 63, 187, 0.1)', border: '1px solid rgba(42, 63, 187, 0.2)' }}
          >
            <Star className="w-4 h-4" style={{ color: '#5B3AF1', fill: '#5B3AF1' }} />
            <span className="text-sm font-medium text-white/90">Customer Success Stories</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Loved by
            <span className="block gradient-primary bg-clip-text text-transparent">10,000+ brands</span>
          </h2>
          <p className="text-lg text-gray-text">
            See how e-commerce businesses are growing revenue and recovering more sales with Convertfy CRM.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl p-8 shadow-soft hover:shadow-medium transition-smooth animate-fade-in"
              style={{ 
                backgroundColor: 'rgba(42, 63, 187, 0.1)', 
                border: '1px solid rgba(42, 63, 187, 0.2)',
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5" style={{ color: '#5B3AF1', fill: '#5B3AF1' }} />
                ))}
              </div>

              {/* Content */}
              <p className="text-white leading-relaxed mb-6">"{testimonial.content}"</p>

              {/* Metric Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">{testimonial.metric}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6" style={{ borderTop: '1px solid rgba(42, 63, 187, 0.3)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-soft" style={{ backgroundColor: '#5B3AF1' }}>
                  <span className="text-white font-bold">{testimonial.image}</span>
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-text">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in">
          {[
            { value: "10K+", label: "Active Brands" },
            { value: "$124M", label: "Revenue Recovered" },
            { value: "99.9%", label: "Deliverability" },
            { value: "4.9★", label: "Average Rating" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">{stat.value}</div>
              <div className="text-sm text-gray-text">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;