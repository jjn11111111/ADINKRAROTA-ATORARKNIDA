// Firebase Configuration Example
// Copy this file to firebase-config.js and replace with your actual values

// To get your config:
// 1. Go to Firebase Console: https://console.firebase.google.com/
// 2. Select your project
// 3. Click the gear icon > Project settings
// 4. Scroll to "Your apps" section
// 5. Click the web icon (</>)
// 6. Copy the configuration

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};

// Uncomment these lines when you have added Firebase SDK to your HTML
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// Get Firestore reference (if using Firestore)
// const db = firebase.firestore();

// Get Auth reference (if using Authentication)
// const auth = firebase.auth();

// Export for use in other modules
// export { firebaseConfig, db, auth };
