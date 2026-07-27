import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/ui/Container';
import { CareersHero } from '@/components/sections/CareersHero';
import { RoleCard } from '@/components/sections/RoleCard';
import { CareersGeneralCta } from '@/components/sections/CareersGeneralCta';
import { SITE_URL } from '@/lib/constants';
import careersData from '@/data/careers.json';
import type { CareersData, Role } from '@/types/careers';

const careers = careersData as CareersData;

export const metadata: Metadata = buildMetadata({
    title: careers.meta.title,
    description: careers.meta.description,
    path: careers.meta.path,
    ogKey: 'careers',
});

function buildItemListSchema(activeRoles: Role[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Open Roles',
        itemListElement: activeRoles.map((role, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_URL}/careers/${role.slug}/`,
            name: role.title,
        })),
    };
}

export default function CareersPage() {
    const activeRoles = careers.roles.filter((role) => role.active);

    return (
        <main id="main-content">
            <CareersHero hero={careers.hero} />

            <section className="pb-12 sm:pb-16 lg:pb-20">
                <Container>
                    <div className="space-y-8">
                        {activeRoles.map((role) => (
                            <RoleCard key={role.slug} role={role} />
                        ))}
                    </div>
                </Container>
            </section>

            <CareersGeneralCta cta={careers.generalCta} />

            {activeRoles.length > 0 ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(buildItemListSchema(activeRoles)),
                    }}
                />
            ) : null}
        </main>
    );
}
