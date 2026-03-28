import { Header } from "@/components/header";

export default function Loading() {
  return (
    <>
      <Header showSearch={false} />
      <main className="pt-20 md:pt-28 pb-12 px-4 md:px-6 max-w-7xl mx-auto min-h-screen animate-pulse">
        {/* Fund Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-surface-container-highest rounded" />
            <div className="h-10 md:h-12 w-64 md:w-96 bg-surface-container-highest rounded" />
          </div>
          <div className="h-10 w-40 bg-surface-container-highest rounded-lg" />
        </header>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-container-lowest p-4 md:p-6 rounded-xl">
              <div className="h-3 w-24 bg-surface-container-highest rounded mb-4" />
              <div className="h-8 w-32 bg-surface-container-highest rounded mb-2" />
              <div className="h-3 w-20 bg-surface-container-highest rounded" />
            </div>
          ))}
        </div>

        {/* Chart + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 items-start">
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl h-80" />
          <div className="bg-surface-container-high p-6 rounded-xl">
            <div className="h-5 w-40 bg-surface-container-highest rounded mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-16 bg-surface-container-highest rounded" />
                  <div className="h-4 w-24 bg-surface-container-highest rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
