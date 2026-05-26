export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden border border-slate-200 animate-pulse flex flex-col h-full">
      {/* Image */}
      <div className="h-48 bg-slate-300 rounded-lg"></div>

      {/* Content */}
      <div className="p-4 space-y-3 flex-1">
        <div className="h-3 bg-slate-300 rounded w-1/3"></div>
        <div className="h-5 bg-slate-300 rounded w-5/6"></div>
        <div className="h-3 bg-slate-300 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-300 rounded w-4/5"></div>
          <div className="h-3 bg-slate-300 rounded w-3/4"></div>
        </div>
        <div className="pt-2">
          <div className="h-8 bg-slate-300 rounded w-1/2"></div>
        </div>
        <div className="pt-4 space-y-2">
          <div className="h-10 bg-slate-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductListSkeleton() {
  return (
    <div className="card p-4 md:p-6 border border-slate-200 animate-pulse flex gap-4">
      {/* Image */}
      <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-slate-300 rounded-lg"></div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        <div className="h-3 bg-slate-300 rounded w-1/4"></div>
        <div className="h-5 bg-slate-300 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-300 rounded w-full"></div>
          <div className="h-3 bg-slate-300 rounded w-5/6"></div>
        </div>
        <div className="pt-2 flex gap-4">
          <div className="h-8 bg-slate-300 rounded w-1/3"></div>
          <div className="h-8 bg-slate-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
