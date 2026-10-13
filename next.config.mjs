/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // The public site is the calculator. "/" is the unfinished dashboard mock, so send visitors to /price.
    return [{ source: '/', destination: '/price', permanent: false }]
  },
}

export default nextConfig
