export function HeroSkeleton() {
  return (
    <div className="bg-gradient-to-r from-slate-200 to-slate-100 py-20 md:py-32 animate-pulse">
      <div className="container-app max-w-4xl">
        <div className="space-y-4">
          <div className="h-12 bg-slate-300 rounded-lg w-3/4"></div>
          <div className="h-6 bg-slate-300 rounded-lg w-full"></div>
          <div className="h-6 bg-slate-300 rounded-lg w-5/6"></div>
          <div className="flex gap-4 mt-8">
            <div className="h-12 bg-slate-300 rounded-lg w-40"></div>
            <div className="h-12 bg-slate-300 rounded-lg w-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesGridSkeleton() {
  return (
    <div className="py-16 animate-pulse">
      <div className="container-app">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 space-y-4">
              <div className="w-12 h-12 bg-slate-300 rounded-lg"></div>
              <div className="h-6 bg-slate-300 rounded-lg w-3/4"></div>
              <div className="h-4 bg-slate-300 rounded-lg w-full"></div>
              <div className="h-4 bg-slate-300 rounded-lg w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PricingGridSkeleton() {
  return (
    <div className="py-16 animate-pulse">
      <div className="container-app">
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 space-y-4">
              <div className="h-8 bg-slate-300 rounded-lg w-1/2"></div>
              <div className="h-4 bg-slate-300 rounded-lg w-full"></div>
              <div className="h-12 bg-slate-300 rounded-lg w-3/4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 bg-slate-300 rounded-lg w-full"></div>
                ))}
              </div>
              <div className="h-12 bg-slate-300 rounded-lg w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TrustedPartnersSkeleton() {
  return (
    <div className="py-16 animate-pulse">
      <div className="container-app">
        <div className="mb-12">
          <div className="h-10 bg-slate-300 rounded-lg w-1/2 mx-auto mb-4"></div>
          <div className="h-6 bg-slate-300 rounded-lg w-1/3 mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-300 rounded-lg h-24"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
