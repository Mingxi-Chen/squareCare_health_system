const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://yunjiaapp-c337d89ea438.herokuapp.com/?',
  },
})