/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Strona główna -> domyślny język
      { source: '/', destination: '/pl', permanent: false },
    ];
  },
  async rewrites() {
    return [
      // Niezależny, statyczny deck inwestorski Moniter.asia (public/moniter/index.html)
      { source: '/moniter', destination: '/moniter/index.html' },
    ];
  },
};

export default nextConfig;
