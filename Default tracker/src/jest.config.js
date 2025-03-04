// jest.config.js
module.exports = {
  testEnvironment: 'jsdom', // Nécessaire pour tester les composants React
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest' // Transpile les fichiers avec Babel
  }
};
