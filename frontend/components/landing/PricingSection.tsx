// components/landing/PricingSection.tsx
export const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-muted">
      <h2 className="text-3xl font-bold text-center">Pricing</h2>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="border rounded-lg p-8 text-center bg-background">
          <h3 className="text-xl font-semibold">Starter</h3>
          <p className="mt-4 text-4xl font-bold">$99</p>
          <p className="mt-2 text-muted-foreground">per month</p>
          <button className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg">
            Get Started
          </button>
        </div>
        <div className="border rounded-lg p-8 text-center bg-background">
          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="mt-4 text-4xl font-bold">$299</p>
          <p className="mt-2 text-muted-foreground">per month</p>
          <button className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg">
            Get Started
          </button>
        </div>
        <div className="border rounded-lg p-8 text-center bg-background">
          <h3 className="text-xl font-semibold">Enterprise</h3>
          <p className="mt-4 text-2xl font-bold">Contact Us</p>
          <p className="mt-2 text-muted-foreground">for a custom quote</p>
          <button className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};
