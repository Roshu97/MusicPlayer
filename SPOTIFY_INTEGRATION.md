# Spotify Integration Guide - Secure Implementation

## ⚠️ SECURITY FIRST

### Your Token is Exposed!
If you shared your real token above, **REVOKE IT IMMEDIATELY**:
1. Go to https://developer.spotify.com/dashboard
2. Click on your app
3. Regenerate access token
4. Update your code

### Why Tokens Must Be Secret
- ❌ Tokens grant access to your account
- ❌ Can be used to modify your data
- ❌ Can create unwanted playlists
- ❌ Can change your settings
- ❌ Visible in browser history/source code

---

## ✅ Secure Spotify Integration (3 Methods)

### Method 1: Backend Token Generation (MOST SECURE) ⭐

**Architecture:**
```
Your Music Player (Frontend)
    ↓ requests song data
Backend Server (Node.js/Python)
    ↓ has API credentials
Spotify API
    ↓ returns encrypted token
Backend
    ↓ sends data to frontend
Your Music Player
    ↓ plays songs (no token exposed)
```

**Why This Works:**
- ✅ Token never exposed to client
- ✅ Credentials stored on server
- ✅ Frontend only gets song data
- ✅ Secure and professional

**Backend Example (Node.js):**
```javascript
const express = require('express');
const axios = require('axios');
const app = express();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Get access token (backend only)
async function getSpotifyToken() {
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(
                    `${CLIENT_ID}:${CLIENT_SECRET}`
                ).toString('base64')
            }
        }
    );
    return response.data.access_token;
}

// Get top tracks (backend only)
app.get('/api/top-tracks', async (req, res) => {
    const token = await getSpotifyToken();
    
    const response = await axios.get(
        'https://api.spotify.com/v1/me/top/tracks?limit=5',
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    
    // Only send safe data to frontend
    const tracks = response.data.items.map(track => ({
        title: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        preview: track.preview_url,  // 30-second preview
        cover: track.album.images[0]?.url,
        id: track.id
    }));
    
    res.json(tracks);
});

app.listen(3000);
```

**Frontend (Safe):**
```javascript
// Frontend - NO TOKEN HERE!
async function loadSpotifyTracks() {
    try {
        const response = await fetch('/api/top-tracks');
        const tracks = await response.json();
        
        this.playlist = tracks;
        this.renderPlaylist();
    } catch (error) {
        console.error('Error loading Spotify tracks:', error);
    }
}
```

---

### Method 2: OAuth Flow (OFFICIAL SPOTIFY METHOD) ⭐⭐

**Architecture:**
```
User clicks "Login with Spotify"
    ↓
Spotify Login Page
    ↓
User authorizes your app
    ↓
Spotify redirects with auth code
    ↓
Your backend exchanges code for token
    ↓
Token stored securely
    ↓
Frontend can play Spotify songs
```

**Setup:**

1. **Register Your App** at https://developer.spotify.com/dashboard
2. **Set Redirect URI** to `http://localhost:3000/callback`
3. **Get Client ID and Secret**

**Implement OAuth:**
```javascript
// Backend
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/callback'
});

// Step 1: Redirect to Spotify login
app.get('/login', (req, res) => {
    const scopes = ['user-top-read', 'streaming', 'user-read-email'];
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authorizeURL);
});

// Step 2: Handle callback
app.get('/callback', async (req, res) => {
    const { code } = req.query;
    
    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        
        // Store token securely
        session.access_token = data.body['access_token'];
        session.refresh_token = data.body['refresh_token'];
        
        res.redirect('/');
    } catch (err) {
        console.error('Spotify auth failed:', err);
    }
});
```

**Frontend (Safe):**
```html
<!-- Login button -->
<a href="/login">
    <button class="spotify-login">
        <i class="fab fa-spotify"></i> Login with Spotify
    </button>
</a>
```

---

### Method 3: Client Credentials Flow (For Public Data)

**Best For:**
- Public playlists
- Browse Spotify catalog
- No user authentication needed
- Search functionality

**Only shows 30-second previews** (not full songs)

---

## 📊 Comparison

| Method | Security | Setup | Previews | Full Songs | Best For |
|--------|----------|-------|----------|-----------|----------|
| **Backend + Client ID** | ⭐⭐⭐⭐⭐ | Medium | ❌ | ❌ | Public data |
| **OAuth + Refresh Token** | ⭐⭐⭐⭐⭐ | Hard | ❌ | ✅ | User playlists |
| **Token in Frontend** | ❌❌❌ | Easy | ✅ | ✅ | NOT SECURE |

---

## 🎵 Spotify Preview URLs (Legal Workaround)

Spotify provides **30-second preview URLs** legally:

```javascript
{
    title: 'Song Name',
    artist: 'Artist',
    album: 'Album',
    preview: 'https://p.scdn.co/mp3-preview/abc123...',  // 30 seconds
    cover: 'https://i.scdn.co/image/abc123...'
}
```

**This is:**
- ✅ Legal (Spotify's official feature)
- ✅ No preview URL = no audio available
- ✅ Works with public data
- ✅ Free for developers

---

## 🔧 Safe Implementation for Your Music Player

### Step 1: Add Backend (Node.js)

Create `server.js`:
```javascript
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Get token (secure on backend)
async function getSpotifyToken() {
    const auth = Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
    ).toString('base64');
    
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Auth error:', error);
        throw error;
    }
}

// Search Spotify (safe endpoint)
app.get('/api/search/:query', async (req, res) => {
    try {
        const token = await getSpotifyToken();
        
        const response = await axios.get(
            `https://api.spotify.com/v1/search`,
            {
                params: {
                    q: req.params.query,
                    type: 'track',
                    limit: 10
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        // Extract only safe data
        const tracks = response.data.tracks.items.map(track => ({
            title: track.name,
            artist: track.artists[0]?.name,
            album: track.album.name,
            preview: track.preview_url,  // 30-sec preview
            cover: track.album.images[0]?.url,
            id: track.id
        }));
        
        res.json(tracks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

### Step 2: Create `.env` File

```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

### Step 3: Update Frontend

```javascript
// Add to MusicPlayer class
async searchSpotify(query) {
    try {
        const response = await fetch(`/api/search/${query}`);
        const tracks = await response.json();
        
        // Add to playlist
        this.playlist.push(...tracks);
        this.renderPlaylist();
    } catch (error) {
        console.error('Search failed:', error);
    }
}

// Add search button to HTML
// <input type="text" id="spotifySearch" placeholder="Search Spotify...">
// <button id="searchBtn">Search</button>

// Event listener
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('spotifySearch').value;
    player.searchSpotify(query);
});
```

---

## 📦 Setup Instructions

### 1. Install Dependencies
```bash
npm install express axios cors dotenv
```

### 2. Create .env
```
SPOTIFY_CLIENT_ID=paste_your_client_id
SPOTIFY_CLIENT_SECRET=paste_your_client_secret
```

### 3. Run Server
```bash
node server.js
```

### 4. Start Music Player
- Open `http://localhost:3000`
- Search for songs
- Preview available previews
- Build your playlist

---

## ⚠️ Important Limitations

### What Works
✅ Search songs  
✅ Get song metadata  
✅ Get preview URLs (30 seconds)  
✅ Get cover art  
✅ List playlists  

### What Doesn't Work
❌ Play full songs (requires Premium)  
❌ Direct streaming (Spotify Premium only)  
❌ Access private data (without OAuth)  
❌ Modify user playlists (without OAuth)  

### Spotify Premium Requirement
To play **full songs** directly from Spotify, you need:
- Spotify Premium account
- Web Playback SDK integration
- Complex OAuth flow with refresh tokens

---

## 🎯 Recommended Setup for Your Project

**For Your Current Music Player (NO BACKEND):**
```javascript
// Use free music sources + Spotify metadata
// ✅ Bensound for audio
// ✅ Spotify API for metadata
// ❌ NO Spotify playback

loadDefaultPlaylist() {
    this.playlist = [
        {
            title: 'Sunny',
            artist: 'Bensound',
            album: 'Royalty Free',
            src: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
            spotifyId: 'spotify:track:id'  // Link to Spotify
        }
        // Mix free + Spotify metadata
    ];
}
```

**For Full Spotify Integration (WITH BACKEND):**
- Set up Node.js backend
- Store Client ID/Secret securely
- Provide Spotify search
- Play 30-second previews
- Complement with free music

---

## ✅ Do's and Don'ts

### ✅ DO
- ✅ Use backend for credentials
- ✅ Store secrets in .env
- ✅ Use OAuth for user data
- ✅ Request only needed permissions
- ✅ Show attribution to Spotify

### ❌ DON'T
- ❌ Put tokens in frontend code
- ❌ Commit .env to git
- ❌ Share tokens publicly
- ❌ Hardcode credentials
- ❌ Try to bypass DRM
- ❌ Ignore Terms of Service

---

## 📚 Resources

- **Spotify Web API**: https://developer.spotify.com/documentation/web-api
- **Authorization Guide**: https://developer.spotify.com/documentation/web-api/concepts/authorization
- **Node.js Client**: https://github.com/thelinmichael/spotify-web-api-node
- **API Reference**: https://developer.spotify.com/documentation/web-api/reference/

---

## 🎵 Summary

**Your Music Player can integrate Spotify:**
- ✅ Search functionality
- ✅ Metadata (title, artist, album, cover)
- ✅ 30-second previews (free tier)
- ✅ Full songs (Spotify Premium + Web Playback SDK)

**But must do it securely:**
- ✅ Backend for credentials
- ✅ Never expose tokens
- ✅ Use official APIs
- ✅ Respect Terms of Service

**Best approach:**
→ **Mix free music + Spotify metadata**  
→ **Works for everyone**  
→ **No Spotify Premium needed**  

---

**Never share your API tokens publicly! 🔒**
