import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection, HERO_STATS, PRODUCT_STATS } from '@/components/sections/StatsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { DemoVideoSection } from '@/components/sections/DemoVideoSection';
import { ImportSection } from '@/components/sections/ImportSection';
import { SearchSection } from '@/components/sections/SearchSection';
import { AiDraftingSection } from '@/components/sections/AiDraftingSection';
import { ComplianceSection } from '@/components/sections/ComplianceSection';
import { SecuritySection } from '@/components/sections/SecuritySection';
import { PricingSection } from '@/components/sections/PricingSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { HomeJsonLd } from '@/components/seo/HomeJsonLd';

export default function HomePage() {
    return (
        <main id="main-content">
            <HomeJsonLd />
            <HeroSection />
            <StatsSection stats={HERO_STATS} variant="cards" />
            <FeaturesSection />
            <DemoVideoSection />
            <ImportSection />
            <SearchSection />
            <AiDraftingSection />
            <ComplianceSection />
            <StatsSection
                stats={PRODUCT_STATS}
                variant="cards"
                numberFont="display"
            />
            <SecuritySection />
            <PricingSection />
            <FaqSection />
            <CtaSection />
        </main>
    );
}
