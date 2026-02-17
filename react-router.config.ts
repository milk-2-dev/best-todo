import type { Config } from "@react-router/dev/config";

const MODE = process.env.NODE_ENV

console.log(`RR Config Running in ${MODE} mode`)
console.log(`RR Project_id is ${process.env.APPWRITE_PROJECT_ID} `)

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
} satisfies Config;
