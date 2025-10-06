# Setup Guide

## Firebase Setup Instructions

This application is designed to work with Firebase for hosting and optional backend features.

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "adinkrarota-tarot")
4. Follow the setup wizard

### Step 2: Enable Firebase Services

#### Hosting
1. In the Firebase Console, go to "Hosting"
2. Click "Get started"
3. Follow the instructions to set up hosting

#### Firestore (Optional - for saving readings)
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your preferred location

### Step 3: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 4: Login to Firebase

```bash
firebase login
```

### Step 5: Initialize Firebase in Your Project

```bash
cd ADINKRAROTA-ATORARKNIDA
firebase init
```

When prompted:
- Select "Hosting" and "Firestore"
- Choose your existing project
- Set public directory to: `public`
- Configure as single-page app: Yes
- Set up automatic builds: No
- Don't overwrite index.html if prompted

### Step 6: Create Firebase Config File

Create a file at `public/js/firebase-config.js`:

```javascript
// Firebase Configuration
// Replace these values with your Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore reference
const db = firebase.firestore();
```

To find your config values:
1. Go to Firebase Console
2. Click the gear icon > Project settings
3. Scroll down to "Your apps"
4. Click the web icon (</>)
5. Copy your configuration object

### Step 7: Deploy to Firebase

```bash
firebase deploy
```

Your app will be live at: `https://YOUR_PROJECT_ID.firebaseapp.com`

## Local Development

For local development without Firebase:

### Option 1: Simple HTTP Server (Python)

```bash
cd public
python3 -m http.server 8000
```

Visit: http://localhost:8000

### Option 2: Node.js http-server

```bash
npm install -g http-server
cd public
http-server -p 8000
```

Visit: http://localhost:8000

### Option 3: Firebase Local Emulator

```bash
firebase serve
```

Visit: http://localhost:5000

## Optional Features

### Saving User Readings

To enable saving readings to Firestore:

1. Add Firebase Authentication:
```bash
firebase init authentication
```

2. Enable email/password or Google sign-in in Firebase Console

3. Add authentication UI to your app

4. Use the Firestore rules provided in `firestore.rules`

### Custom Domain

1. In Firebase Console, go to Hosting
2. Click "Add custom domain"
3. Follow the instructions to verify and configure your domain

## Troubleshooting

### Port Already in Use

If port 8000 is in use, try another port:
```bash
python3 -m http.server 8080
```

### Firebase Deploy Fails

- Ensure you're logged in: `firebase login`
- Check you're in the correct directory
- Verify `firebase.json` is properly configured

### Data Not Loading

- Check browser console for errors
- Verify JSON files are in the correct location
- Ensure file paths are correct (relative to public directory)

### CORS Issues

If running locally, you may encounter CORS issues when loading JSON files. Solutions:
- Use a proper HTTP server (not just opening index.html in browser)
- Use Firebase emulators: `firebase serve`
- Configure your server to allow CORS

## Performance Optimization

### Enable Caching

In `firebase.json`, the hosting configuration includes cache headers:
```json
"headers": [{
  "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css)",
  "headers": [{
    "key": "Cache-Control",
    "value": "max-age=31536000"
  }]
}]
```

### Compress Assets

Firebase automatically compresses assets, but you can pre-compress:
```bash
# Install compression tool
npm install -g terser

# Compress JavaScript
terser public/js/app.js -o public/js/app.min.js -c -m

# Update HTML to use .min.js files
```

## Security

### Firestore Rules

The provided `firestore.rules` ensure:
- Anyone can read tarot cards and symbols
- Only authenticated users can save readings
- Users can only access their own readings

### API Keys

- Never commit your `firebase-config.js` with real API keys to public repositories
- Add to `.gitignore`: `public/js/firebase-config.js`
- Use environment variables in production

## Next Steps

1. Customize the design in `public/css/style.css`
2. Add card images to `public/assets/`
3. Enhance 3D interactions with Three.js
4. Add user authentication for saving readings
5. Create admin interface for managing content
6. Add social sharing features
7. Implement progressive web app (PWA) features

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Three.js Documentation](https://threejs.org/docs/)
- [Adinkra Symbols Reference](https://www.adinkra.org/)
