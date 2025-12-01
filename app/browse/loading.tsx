export default function BrowseLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-12 bg-slate-200 rounded-lg w-64 mb-4"></div>
          <div className="h-6 bg-slate-200 rounded-lg w-96 max-w-full"></div>
        </div>

        {/* Search and Filters Skeleton */}
        <div className="bg-white rounded-lg border-2 border-slate-200 p-6 mb-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-12 bg-slate-200 rounded-lg"></div>
            <div className="h-12 bg-slate-200 rounded-lg"></div>
            <div className="h-12 bg-slate-200 rounded-lg"></div>
            <div className="h-12 bg-slate-200 rounded-lg"></div>
          </div>
        </div>

        {/* Results Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="flex gap-2 mt-4">
                  <div className="h-8 bg-slate-200 rounded flex-1"></div>
                  <div className="h-8 bg-slate-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-12 flex justify-center animate-pulse">
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-slate-200 rounded"></div>
            <div className="h-10 w-10 bg-slate-200 rounded"></div>
            <div className="h-10 w-10 bg-slate-200 rounded"></div>
            <div className="h-10 w-10 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
