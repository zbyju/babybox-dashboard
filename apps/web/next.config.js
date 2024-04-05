/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest : "public",
  disable : process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  reactStrictMode : true,
  env : {
    NEXT_PUBLIC_URL_SNAPSHOT_HANDLER : process.env
                                         .NEXT_PUBLIC_URL_SNAPSHOT_HANDLER,
    NEXT_PUBLIC_URL_BABYBOX_SERVICE : process.env
                                        .NEXT_PUBLIC_URL_BABYBOX_SERVICE,
    NEXT_PUBLIC_URL_USER_SERVICE : process.env.NEXT_PUBLIC_URL_USER_SERVICE,
  }

});
