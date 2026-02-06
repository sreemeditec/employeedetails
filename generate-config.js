const fs = require('fs');
const path = require('path');

// This script generates the firebase-config.js file from environment variables
const configPath = path.join(__dirname, 'assets', 'js', 'firebase-config.js');

const configContent = `
export const firebaseConfig = {
    apiKey: "${process.env.FIREBASE_API_KEY || ''}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN || ''}",
    projectId: "${process.env.FIREBASE_PROJECT_ID || ''}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET || ''}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID || ''}",
    appId: "${process.env.FIREBASE_APP_ID || ''}",
    measurementId: "${process.env.FIREBASE_MEASUREMENT_ID || ''}"
};
`;

fs.writeFileSync(configPath, configContent);
console.log('✅ Configuration generated successfully at assets/js/firebase-config.js');
