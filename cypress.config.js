const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
     on("task",{
      saveToken(token) {
        global.token = token
        return null
      },
      getToken() {
        return global.token
      }
    })
    },
    video: false,
    screenshotOnRunFailure: false,
    experimentalStudio:true
  },
});
