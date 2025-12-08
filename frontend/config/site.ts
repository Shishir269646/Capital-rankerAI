export const siteConfig = {
    name: "Capital Ranker",
    description: "AI-powered investment decision platform for venture capitalists",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ogImage: "/og-image.png",
    links: {
        twitter: "https://twitter.com/capitalranker",
        github: "https://github.com/capitalranker",
        linkedin: "https://linkedin.com/company/capitalranker",
    },
    creator: "Capital Ranker Team",
};

export type SiteConfig = typeof siteConfig;