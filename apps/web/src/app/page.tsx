import { OutfitInput } from '@/components/outfit-input';
import { HeroSection } from '@/components/hero-section';
import { RecentAnalyses } from '@/components/recent-analyses';
import { TrendingNow } from '@/components/trending-now';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Outfit Input Section */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Analyze Your Outfit
            </h2>
            <p className="text-lg text-muted-foreground">
              Describe your outfit or upload a photo to get instant AI-powered style analysis
            </p>
          </div>
          <OutfitInput />
        </section>

        {/* Recent Analyses */}
        <section>
          <RecentAnalyses />
        </section>

        {/* Trending Now */}
        <section>
          <TrendingNow />
        </section>
      </main>
    </div>
  );
}