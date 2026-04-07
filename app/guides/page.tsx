import { Metadata } from "next";
import { guides } from "@/lib/data/guides";
import GuideCard from "@/components/GuideCard";
import AdPlaceholder from "@/components/ads/AdPlaceholder";

export const metadata: Metadata = {
  title: "Guides | ABI Builder",
  description: "Browse comprehensive guides for Arena Breakout Infinite, from mission walkthroughs to economy strategies.",
};

export default function GuidesPage() {
  const guidesList = guides; // Using renamed data source

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-6">
          
          {/* Sidebar Area - Currently hidden/disabled for future use */}
          {/* 
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 glass-elevated rounded-2xl p-6 max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
              // TODO: Add filtering/sorting sidebar later
              <h2 className="text-xl font-bold mb-4">Filters</h2>
              <p className="text-sm text-text-secondary">Categories and sorting will appear here.</p>
            </div>
          </aside>
          */}

          <div className="flex-1">
            {/* Top Ad Banner */}
            <AdPlaceholder
              format="horizontal"
              className="mb-8"
              text="SPONSORED SPOT"
            />

            <div className="mb-8">
              <h1 className="font-display font-bold text-4xl mb-2">
                All <span className="text-gradient">Guides</span>
              </h1>
              <p className="text-text-secondary">
                Showing <span className="font-medium text-white">{guidesList.length}</span> latest guides and articles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guidesList.length > 0 ? (
                <>
                  {guidesList.slice(0, 6).map((guide) => (
                    <GuideCard
                      key={guide.id}
                      guide={guide}
                    />
                  ))}
                  
                  {guidesList.length > 6 && (
                    <div className="col-span-full py-2">
                      <AdPlaceholder format="horizontal" text="SPONSORED SPOT" />
                    </div>
                  )}

                  {guidesList.slice(6).map((guide) => (
                    <GuideCard
                      key={guide.id}
                      guide={guide}
                    />
                  ))}
                </>
              ) : (
                <div className="col-span-full text-center py-20 text-text-secondary">No guides available.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
