/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://designyourinvention.com',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    outDir: './out',
    exclude: [],
    robotsTxtOptions: {
        /* AI / generative search crawlers are allowlisted explicitly so the
         * brand can be read and cited by each engine. Blocking a crawler means
         * we cannot appear in that engine's answers. The wildcard policy below
         * already allows everyone; these named entries make the intent durable
         * and self-documenting if a default-deny is ever added upstream. */
        policies: [
            { userAgent: 'GPTBot', allow: '/' },
            { userAgent: 'OAI-SearchBot', allow: '/' },
            { userAgent: 'ChatGPT-User', allow: '/' },
            { userAgent: 'ClaudeBot', allow: '/' },
            { userAgent: 'anthropic-ai', allow: '/' },
            { userAgent: 'PerplexityBot', allow: '/' },
            { userAgent: 'Google-Extended', allow: '/' },
            { userAgent: 'Applebot-Extended', allow: '/' },
            { userAgent: '*', allow: '/' },
        ],
        additionalSitemaps: [],
    },
};
