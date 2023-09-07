/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint:{
    ignoreDuringBuilds:true
  },
  swcMinify: false,
  i18n:{
    locales:['amh','orm','tgr','eng'],
    defaultLocale:'eng'
  },
  output:"standalone"
}

module.exports = nextConfig