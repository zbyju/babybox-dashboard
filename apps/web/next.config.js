const withPWA = require("next-pwa")({
  dest: "public",
});

const config = {
  output: "standlone",
};

// module.exports = withPWA({
//   // next.js config
// });

module.exports = config;
