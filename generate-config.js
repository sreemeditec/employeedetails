const fs = require('fs');
const path = require('path');

// Load .env locally if it exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value) process.env[key.trim()] = value.join('=').trim();
    });
}

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
    measurementId: "${process.env.FIREBASE_MEASUREMENT_ID || ''}",
    databaseURL: "${process.env.FIREBASE_DATABASE_URL || ''}"
};
`;

fs.writeFileSync(configPath, configContent);
console.log('✅ Configuration generated successfully at assets/js/firebase-config.js');
