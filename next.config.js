/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        DATAVERSE_KEY: process.env.DATAVERSE_KEY,
    },
}

module.exports = nextConfig
