import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { guides } from "@/lib/data/guides";
import AdPlaceholder from "@/components/ads/AdPlaceholder";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
    props: Props
): Promise<Metadata> {
  const params = await props.params;
  const guide = guides.find(g => g.slug === params.slug);

  if (!guide) {
    return {
      title: "Guide Not Found | ABI Builder"
    };
  }

  // Pre-defined SEO data for specific guides
  const isEconomyGuide = guide.slug === "season-5-economy-guide";

  const title = isEconomyGuide 
    ? "How To Earn Koen Without Playing The Game (Barter Trades) | Arena Breakout: Infinite Market Guide"
    : `${guide.title} | ABI Builder`;

  const description = isEconomyGuide
    ? "Learn the best market trading, contact barters, and arbitrage strategies in Arena Breakout: Infinite. Stop going broke and make millions of Koen passively without entering raids."
    : guide.description;

  const keywords = isEconomyGuide
    ? [
        "Arena Breakout Infinite", "ABI S5", "Arena Breakout Infinite Season 5", "Arena S5", 
        "ABI Season 5 economy", "Arena Breakout Season 5 Koen", "ABI S5 Market", 
        "Arena Breakout Infinite S5 guide", "ABI S5 Barter Trades", "Deke Vinson S5", 
        "Arena Breakout Infinite Koen making", "ABI market guide", "Arena Breakout Infinite passive income",
        "how to make Koen fast", "ABI market trading", "Deke Vinson trades", "ABI economy guide", 
        "passive income Arena Breakout", "best barter trades ABI", "Arena Breakout Koen guide", 
        "make money Arena Breakout Infinite", "ABI contact barters", "earn koen without playing", 
        "Season 5 economy", "ABI Season 5", "market arbitrage", "Koen making guide", 
        "dark zone wealth", "ABI barter trades", "Arena Breakout Infinite S5 market",
        "ABI S5 money guide", "Arena Breakout S5 guide", "ABI marketplace guide"
      ]
    : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: guide.title, // OG Title as requested
      description: isEconomyGuide 
        ? "Master the market and contact trades to print Koen passively. The ultimate guide to wealth in the Dark Zone."
        : description,
      type: "article",
      images: guide.thumbnailUrl ? [{ url: guide.thumbnailUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: isEconomyGuide 
        ? "Master the market and contact trades to print Koen passively. The ultimate guide to wealth in the Dark Zone."
        : description,
      images: guide.thumbnailUrl ? [guide.thumbnailUrl] : [],
    }
  };
}

export default async function GuideDetailPage(props: Props) {
  const params = await props.params;
  const guide = guides.find(g => g.slug === params.slug);

  if (!guide) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="mb-8 font-sans">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-6 text-white leading-tight">
            {guide.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            {guide.description}
          </p>

          {guide.thumbnailUrl && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden glass border border-white/10 mb-8">
              <Image
                src={guide.thumbnailUrl}
                alt={guide.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          )}
        </header>

        {/* Content Section */}
        <div className="prose prose-invert prose-lg max-w-none space-y-6 font-sans">
          {guide.content.split("<!-- AD -->").map((htmlChunk: string, index: number, array: string[]) => (
            <div key={index} className="contents">
              <div dangerouslySetInnerHTML={{ __html: htmlChunk }} className="space-y-6" />
              
              {index < array.length - 1 && (
                <div className="py-6 my-8 flex justify-center w-full">
                  <AdPlaceholder format="horizontal" text="SPONSORED SPOT" />
                </div>
              )}
            </div>
          ))}
        </div>

      </article>
    </main>
  );
}
