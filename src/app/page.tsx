export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-slate-100 opacity-80" />
        <div className="container-lg relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-4xl md:text-5xl font-bold text-balance">
              Digital Estate Planning
              <span className="block text-primary-600 mt-2">Made Conversational</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 mb-10 text-balance leading-relaxed">
              Protect your legacy and secure your family's future through our 
              intuitive and compassionate estate planning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <a href="/onboarding" className="btn btn-primary btn-lg shadow-sm hover:shadow-md transition-all">
                Get Started
              </a>
              <a href="/dashboard" className="btn btn-outline btn-lg hover:bg-slate-50 transition-all">
                View Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container-lg">
          <h2 className="text-center mb-16 text-3xl font-bold text-slate-900">How LifeLegacy Works</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, i) => (
              <div key={i} className="card p-8 flex flex-col items-center text-center rounded-xl shadow-sm hover:shadow-md transition-all bg-white border border-slate-100">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="container-lg">
          <h2 className="text-center mb-16 text-3xl font-bold text-slate-900">What Our Clients Say</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="card p-8 rounded-xl shadow-sm bg-white border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {testimonial.initial}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 italic leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600 text-white">
        <div className="container-md text-center">
          <h2 className="text-white mb-6 text-3xl font-bold">Ready to Secure Your Legacy?</h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of clients who have simplified their estate planning process
            and gained peace of mind for their families.
          </p>
          <a href="/onboarding" className="btn bg-white text-primary-700 hover:bg-primary-50 btn-lg shadow-sm hover:shadow-md transition-all">
            Start Your Plan Today
          </a>
        </div>
      </section>
    </>
  );
}

// Sample data for features
const features = [
  {
    icon: <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>,
    title: "Conversational Planning",
    description: "Answer simple questions in natural language and we'll guide you through the estate planning process."
  },
  {
    icon: <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    title: "Secure & Confidential",
    description: "Your information is protected with enterprise-grade security and encryption protocols."
  },
  {
    icon: <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
    title: "Digital Asset Protection",
    description: "Include digital assets in your estate plan with our comprehensive digital asset inventory system."
  }
];

// Sample testimonials
const testimonials = [
  {
    initial: "JD",
    name: "Jane Doe",
    role: "Business Owner",
    quote: "LifeLegacy made the overwhelming process of estate planning simple and straightforward. The conversational approach was refreshing and less intimidating than traditional methods."
  },
  {
    initial: "JS",
    name: "John Smith",
    role: "Retired Professional",
    quote: "After putting off estate planning for years, I was able to complete my will and trust in a matter of hours with LifeLegacy. The peace of mind is priceless."
  }
];
