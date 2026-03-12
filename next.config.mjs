/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            { protocol: "https", hostname: "avatars.githubusercontent.com" },
            { protocol: "https", hostname: "www.mobileread.com" },
            { protocol: "https", hostname: "openweathermap.org" },
            { protocol: "https", hostname: "www.google.com" },
        ],
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
