    /** @type {import('next').NextConfig} */
    const nextConfig = {
      reactStrictMode: true,
      ssr: false, // Disable SSR to prevent WagmiProvider errors during build
    };
    export default nextConfig;
  