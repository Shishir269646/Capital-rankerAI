// components/landing/FeaturesSection.tsx
export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20">
      <h2 className="text-3xl font-bold text-center">Features</h2>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold">AI-Powered Scoring</h3>
          <p className="mt-2 text-muted-foreground">
            Leverage artificial intelligence to score deals and founders.
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold">Intelligent Deal Sourcing</h3>
          <p className="mt-2 text-muted-foreground">
            Discover new investment opportunities with our smart sourcing tools.
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold">Portfolio Management</h3>
          <p className="mt-2 text-muted-foreground">
            Track and manage your portfolio companies with ease.
          </p>
        </div>
      </div>
    </section>
  );
};
