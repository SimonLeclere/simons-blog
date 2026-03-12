import fs from "node:fs";
import path from "node:path";

// Scan MDX posts and components for external image hostnames
function getImageHostnames() {
    const hostnames = new Set([
        "avatars.githubusercontent.com", // GitHub avatars (author cards)
        "www.google.com",                // Google favicon service (bookmarks)
    ]);

    const postsDir = path.join(process.cwd(), "src/content/posts");
    if (fs.existsSync(postsDir)) {
        for (const file of fs.readdirSync(postsDir).filter(f => f.endsWith(".mdx"))) {
            const content = fs.readFileSync(path.join(postsDir, file), "utf8");
            for (const match of content.matchAll(/https?:\/\/([^/\s"')]+)/g)) {
                hostnames.add(match[1]);
            }
        }
    }

    return [...hostnames].map(hostname => ({ protocol: "https", hostname }));
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: getImageHostnames(),
    },

    async redirects() {
        return [
            {
                source: '/',
                destination: '/blog',
                permanent: true,
            }
        ]
    },

    async headers() {
        return [
            {
                source: "/feed.xml",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, HEAD, OPTIONS",
                    },
                ],
            },
        ];
    },
};
export default nextConfig;
