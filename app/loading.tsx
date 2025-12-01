export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Skeleton */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 h-[600px]">
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center space-y-6 animate-pulse">
            <div className="h-16 bg-slate-700 rounded-lg w-[600px] max-w-full mx-auto"></div>
            <div className="h-8 bg-slate-700 rounded-lg w-[400px] max-w-full mx-auto"></div>
            <div className="flex gap-4 justify-center mt-8">
              <div className="h-12 bg-slate-700 rounded-lg w-32"></div>
              <div className="h-12 bg-slate-700 rounded-lg w-32"></div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 rounded-lg w-64 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Rooms Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 rounded-lg w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
                <div className="h-48 bg-slate-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-8 bg-slate-200 rounded flex-1"></div>
                    <div className="h-8 bg-slate-200 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Themes Skeleton */}
      <div className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 rounded-lg w-64 mx-auto mb-12"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg border-2 border-slate-200 p-6">
                  <div className="h-40 bg-slate-200 rounded mb-4"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Grid Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 rounded-lg w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
                <div className="h-40 bg-slate-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
