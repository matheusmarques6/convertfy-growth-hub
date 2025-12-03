import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Case Studies", href: "#testimonials" },
      { label: "Integrations", href: "#" },
    ],
    Company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Press Kit", href: "#" },
    ],
    Resources: [
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Community", href: "#" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "GDPR", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer 
      className="text-white py-16"
      style={{ 
        backgroundColor: '#0a0a1a',
        borderTop: '1px solid rgba(42, 63, 187, 0.3)'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-soft"
                style={{ backgroundColor: '#5B3AF1' }}
              >
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold">Convertfy CRM</span>
            </div>
            <p className="text-sm text-gray-text mb-6 max-w-sm">
              The all-in-one CRM platform for e-commerce businesses. 
              Recover more sales, increase LTV, and automate your marketing.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-smooth"
                    style={{ 
                      backgroundColor: 'rgba(42, 63, 187, 0.2)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(91, 58, 241, 0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(42, 63, 187, 0.2)'}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-text hover:text-white transition-smooth"
                      style={{ }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#5B3AF1'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#707279'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="pt-8 mb-8" style={{ borderTop: '1px solid rgba(42, 63, 187, 0.3)' }}>
          <div className="max-w-md">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Subscribe to our newsletter
            </h4>
            <p className="text-sm text-gray-text mb-4">
              Get the latest updates, tips, and best practices delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-white placeholder:text-gray-text focus:outline-none transition-smooth"
                style={{ 
                  backgroundColor: 'rgba(42, 63, 187, 0.2)',
                  border: '1px solid rgba(42, 63, 187, 0.3)'
                }}
              />
              <button 
                className="px-6 py-2 text-white font-semibold rounded-lg shadow-medium hover:shadow-strong transition-smooth whitespace-nowrap"
                style={{ backgroundColor: '#5B3AF1' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-text" style={{ borderTop: '1px solid rgba(42, 63, 187, 0.3)' }}>
          <p>
            © {currentYear} Convertfy CRM. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a 
              href="#" 
              className="hover:text-white transition-smooth"
              onMouseEnter={(e) => e.currentTarget.style.color = '#5B3AF1'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#707279'}
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="hover:text-white transition-smooth"
              onMouseEnter={(e) => e.currentTarget.style.color = '#5B3AF1'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#707279'}
            >
              Terms
            </a>
            <a 
              href="#" 
              className="hover:text-white transition-smooth"
              onMouseEnter={(e) => e.currentTarget.style.color = '#5B3AF1'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#707279'}
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;