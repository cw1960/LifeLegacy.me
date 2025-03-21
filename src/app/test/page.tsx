export default function TestPage() {
  return (
    <div className="container-md py-16">
      <div className="card mb-10">
        <h1 className="text-3xl font-bold mb-6">Component Showcase</h1>
        <p className="text-slate-600 mb-6">
          This page demonstrates the styling components and design system available in our application.
        </p>
      </div>

      {/* Buttons Section */}
      <section className="card mb-10">
        <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Primary Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-primary btn-sm">Small</button>
              <button className="btn btn-primary btn-md">Medium</button>
              <button className="btn btn-primary btn-lg">Large</button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Secondary Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-secondary btn-sm">Small</button>
              <button className="btn btn-secondary btn-md">Medium</button>
              <button className="btn btn-secondary btn-lg">Large</button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Outline Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-outline btn-sm">Small</button>
              <button className="btn btn-outline btn-md">Medium</button>
              <button className="btn btn-outline btn-lg">Large</button>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className="card mb-10">
        <h2 className="text-2xl font-semibold mb-6">Typography</h2>
        
        <div className="space-y-6">
          <div>
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4 className="text-xl font-semibold">Heading 4</h4>
            <h5 className="text-lg font-semibold">Heading 5</h5>
            <h6 className="text-base font-semibold">Heading 6</h6>
          </div>
          
          <div>
            <p className="text-xl mb-3">Large paragraph text for important information.</p>
            <p className="mb-3">Standard paragraph text for general content. The interface uses generous spacing and clean typography to create a comfortable reading experience.</p>
            <p className="text-sm text-slate-500">Small text for less important information.</p>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section className="card">
        <h2 className="text-2xl font-semibold mb-6">Form Elements</h2>
        
        <div className="space-y-6 max-w-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input type="text" id="name" className="input" placeholder="Enter your name" />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" id="email" className="input" placeholder="Enter your email" />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea id="message" rows={4} className="input" placeholder="Enter your message"></textarea>
          </div>
          
          <div className="flex justify-end">
            <button className="btn btn-primary btn-md">Submit</button>
          </div>
        </div>
      </section>
    </div>
  );
} 