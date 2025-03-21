import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-slate-100 opacity-80 animate-gradient" />
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-4xl md:text-5xl font-bold text-balance">
              Digital Estate Planning
              <span className="block text-primary-600 mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">For Professionals</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 mb-10 text-balance leading-relaxed">
              Elevate your practice by offering comprehensive digital estate planning 
              as a value-added service to your clients. Perfect for Estate Attorneys, 
              Insurance Agents, and Financial Planners.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link 
                href="/auth/register" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 hover:translate-y-[-2px] h-12 px-8 py-3 text-base shadow-md hover:shadow-lg transition-all duration-300"
              >
                Get Started
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
              <Link 
                href="/auth/login" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 hover:translate-y-[-2px] h-12 px-8 py-3 text-base shadow-sm hover:shadow-md transition-all duration-300"
              >
                Login
                <i className="fas fa-sign-in-alt ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Why Professionals Choose LifeLegacy
            </h2>
            <p className="text-xl text-slate-600">
              Our platform helps financial professionals enhance their service offerings
              and create additional value for their clients.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col items-center text-center rounded-xl hover:border-primary-200 hover:transform hover:scale-105">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">What Professionals Say</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-lg border border-slate-200 bg-white p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-xl">
                    {testimonial.initial}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-screen-md mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-white mb-6 text-3xl font-bold">Enhance Your Professional Services</h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join professionals who differentiate their practice, increase client retention, 
            and create additional revenue streams with our digital estate planning platform.
          </p>
          <Link 
            href="/auth/register" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-primary-700 hover:bg-primary-50 h-12 px-8 py-3 text-base shadow-sm hover:shadow-md transition-all duration-300"
          >
            Start Your Professional Account
          </Link>
        </div>
      </section>
    </div>
  );
}

// Sample data for features
const features = [
  {
    icon: <i className="fas fa-handshake text-2xl"></i>,
    title: "Client Differentiation",
    description: "Stand out from competitors by offering modern digital estate planning as a complementary service to your existing practice."
  },
  {
    icon: <i className="fas fa-shield-alt text-2xl"></i>,
    title: "White-Labeled Solution",
    description: "Offer a secure platform under your own brand with custom domains, logos, and personalized client experiences."
  },
  {
    icon: <i className="fas fa-chart-line text-2xl"></i>,
    title: "Revenue Opportunities",
    description: "Create additional revenue streams with flexible pricing options that integrate seamlessly with your current service offerings."
  }
];

// Sample testimonials
const testimonials = [
  {
    initial: "JB",
    name: "Jennifer Brown",
    role: "Estate Attorney",
    quote: "LifeLegacy has transformed how I serve my clients. The digital estate planning tools complement my legal services perfectly and provide an additional revenue stream for my practice."
  },
  {
    initial: "RM",
    name: "Robert Miller",
    role: "Financial Advisor",
    quote: "My clients appreciate the comprehensive approach to legacy planning. This platform has helped me retain clients and attract new ones looking for modern financial planning services."
  }
];
