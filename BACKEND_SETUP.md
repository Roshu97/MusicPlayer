# Backend Setup Guide - Spotify Integration

Complete step-by-step guide to set up secure Spotify backend integration.

## ⚠️ CRITICAL SECURITY NOTICE

**Your Spotify API token was exposed in the code.** You MUST:

1. **Immediately revoke** the exposed token at: https://developer.spotify.com/dashboard
2. **Generate new credentials** (new Client ID and Client Secret)
3. **Never commit** credentials to Git

The backend setup below prevents this from happening again.

---

## Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org)
2. **Spotify Developer Account** - [Sign up free](https://developer.spotify.com)
3. **Code Editor** - VS Code, Sublime, etc.

---

## Step 1: Create Spotify Application

1. Go to https://developer.spotify.com/dashboard
2. Log in or create account
3. Accept terms and create application
4. Name: "Music Player"
5. Copy your **Client ID** and **Client Secret**
   - ⚠️ **NEVER share these publicly**
   - ⚠️ **NEVER commit to GitHub**

---

## Step 2: Project Setup

### Copy Backend Template

```bash
cd e:\Project\MusicPlayer
copy server.js.example server.js
```

### Create Environment File

Create `.env` file in project root (NOT committed to Git):

```env
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Settings (frontend URL)
FRONTEND_URL=http://localhost:5500
```

**Replace:**
- `your_client_id_here` with your actual Client ID
- `your_client_secret_here` with your actual Client Secret

### Install Dependencies

```bash
npm install
```

This installs:
- **express** - Web framework
- **axios** - HTTP requests
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

---

## Step 3: Verify .gitignore

Check that `.gitignore` includes (should already be there):

```
.env
.env.local
.env.*.local
node_modules/
*.mp3
```

This prevents accidental credential commits.

Verify with:

```bash
git status
```

Should NOT show `.env` file.

---

## Step 4: Start Backend Server

### Development Mode (with auto-reload)

```bash
npm start
```

Expected output:
```
Spotify API Server running on http://localhost:3000
Environment: development
```

### Test the Server

Open browser and visit:
- http://localhost:3000/api/health

Should return:
```json
{"status":"ok","service":"Spotify API Backend"}
```

---

## Step 5: Test Spotify API Integration

### Using Browser Console

Open http://localhost:5500 (or your frontend URL) and use browser DevTools:

```javascript
// Test search
fetch('http://localhost:3000/api/search/dua%20lipa')
    .then(r => r.json())
    .then(d => console.log(d))
    .catch(e => console.error(e));
```

### Using cURL (PowerShell)

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/search/adele" -Method Get
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

---

## API Endpoints Reference

### 1. Search Tracks

**Endpoint:** `GET /api/search/:query`

**Parameters:**
- `query` - Song name or artist

**Response:**
```json
[
    {
        "id": "3qm84nBsSVeCF5dNsWpODG",
        "title": "Blinding Lights",
        "artist": "The Weeknd",
        "album": "After Hours",
        "cover": "https://i.scdn.co/image/...",
        "preview": "https://p.scdn.co/mp3-preview/...",
        "duration": 200
    }
]
```

**Example:**
```
GET /api/search/the%20weeknd
```

### 2. Get Featured Playlists

**Endpoint:** `GET /api/playlists`

**Response:**
```json
[
    {
        "id": "37i9dQZF1DX0XUsuxWHRQd",
        "name": "RapCaviar",
        "description": "The latest hip-hop...",
        "cover": "https://i.scdn.co/image/...",
        "tracks": [...]
    }
]
```

### 3. Get Top Tracks

**Endpoint:** `GET /api/top-tracks`

**Response:**
```json
[
    {
        "title": "As It Was",
        "artist": "Harry Styles",
        "preview": "https://p.scdn.co/mp3-preview/..."
    }
]
```

### 4. Health Check

**Endpoint:** `GET /api/health`

**Response:**
```json
{"status":"ok","service":"Spotify API Backend"}
```

---

## Frontend Integration

### Add Search Button to HTML

The `spotify-integration.js` automatically adds the search UI. Just include the script:

```html
<script src="js/spotify-integration.js"></script>
```

### How It Works

1. **Search Input** - User types song/artist name
2. **Backend Call** - Frontend calls `/api/search/:query`
3. **Backend Queries** - Server queries Spotify API
4. **Results Display** - Tracks shown with preview/add button
5. **Add to Playlist** - User adds 30-second preview to playlist
6. **Play** - Player plays Spotify preview

### Frontend Code Reference

**Search Function:**
```javascript
// In spotify-integration.js
async searchMusic() {
    const query = document.getElementById('spotifySearchInput').value.trim();
    const response = await fetch(`${this.apiUrl}/search/${encodeURIComponent(query)}`);
    const tracks = await response.json();
    this.displayResults(tracks);
}
```

**Add to Playlist:**
```javascript
// Adds Spotify preview to player
addToPlaylist(track) {
    const song = {
        title: track.title,
        artist: track.artist,
        src: track.preview,  // 30-second clip
        cover: track.cover,
        duration: track.duration
    };
    this.player.playlist.push(song);
    this.player.renderPlaylist();
}
```

---

## Environment Variables Explained

### SPOTIFY_CLIENT_ID
- Your Spotify app identifier
- Public (safe to share in frontend code)
- Enables limited API access

### SPOTIFY_CLIENT_SECRET
- ⚠️ **KEEP SECRET** ⚠️
- Never commit or expose
- Backend only - frontend never sees it
- Enables full API access with authentication

### PORT
- Server port (default: 3000)
- Change if port already in use
- Frontend must call correct port

### FRONTEND_URL
- Your frontend domain (for CORS)
- Allows frontend to call backend
- Example: http://localhost:5500

---

## Troubleshooting

### 1. "Port 3000 already in use"

**Solution:** Kill existing process or change port

**PowerShell:**
```powershell
Get-Process -Name node | Stop-Process -Force
# Or change PORT in .env to 3001
```

### 2. "Cannot find module 'express'"

**Solution:** Install dependencies

```bash
npm install
```

### 3. "Invalid credentials" error

**Solution:** Check .env file

- Verify Client ID and Client Secret are correct
- No extra spaces or quotes
- Restart server after changing .env

### 4. CORS errors in browser console

**Solution:** Update FRONTEND_URL in .env

- Should match your frontend's actual URL
- Restart server after change
- Example: `http://localhost:8080` (not localhost:3000)

### 5. Search returns no results

**Solution:** Check query format

- Use URL encoding: `%20` for spaces
- Try exact artist name: "The Weeknd" not "weeknd"
- Backend logs show query received

### 6. .env file not loading

**Solution:** Restart server

```bash
npm start
```

### 7. Preview links not playing

**Spotify limitation:** Preview only works with preview URLs provided by Spotify:
- Limited to Spotify's 30-second clips
- Not all tracks have previews
- Preview expires after 60 minutes

---

## Deployment Checklist

Before deploying to production:

- [ ] Create new Spotify credentials (revoke old ones)
- [ ] Update all environment variables
- [ ] Remove console.log statements
- [ ] Add error handling for all API calls
- [ ] Test all endpoints thoroughly
- [ ] Set `NODE_ENV=production` in .env
- [ ] Use HTTPS only (not HTTP)
- [ ] Set up secret management (e.g., Azure Key Vault)
- [ ] Configure backend hosting (Heroku, AWS, Azure)
- [ ] Update FRONTEND_URL to production domain
- [ ] Enable CORS only for your domain

---

## Backend Hosting Options

### Option 1: Heroku (Easiest - Free tier discontinued)

1. Create Heroku account
2. Install Heroku CLI
3. `heroku create music-player-api`
4. Set environment variables: `heroku config:set SPOTIFY_CLIENT_ID=...`
5. `git push heroku main`

### Option 2: AWS Lambda + API Gateway (Scalable)

1. Create AWS account
2. Package Node.js code for Lambda
3. Create API Gateway
4. Set environment variables in Lambda
5. Deploy and get API endpoint

### Option 3: Azure App Service (Recommended)

1. Create Azure account
2. Create App Service for Node.js
3. Configure environment variables
4. Deploy from GitHub or ZIP file
5. Get public URL

### Option 4: Vercel (Node.js API)

1. Create Vercel account
2. Connect GitHub repository
3. Create `/api/index.js` endpoint
4. Set environment variables
5. Deploy with `vercel deploy`

### Option 5: DigitalOcean / Render / Replit (VPS/Managed)

Simple droplet or container hosting with full control.

---

## Testing Checklist

### Local Testing

- [ ] Server starts without errors
- [ ] `/api/health` returns 200
- [ ] Can search for tracks
- [ ] Results show preview URLs
- [ ] Frontend can call backend
- [ ] Add to playlist works
- [ ] Preview plays in player

### Production Testing

- [ ] Backend deployed and accessible
- [ ] CORS allows frontend domain
- [ ] Environment variables set
- [ ] Search works with new credentials
- [ ] Preview URLs valid and playing
- [ ] Error handling works (wrong query, network down, etc.)

---

## Security Best Practices

1. **Rotate Credentials Periodically**
   - Change Client ID and Secret every 90 days
   - Revoke old credentials immediately

2. **Monitor API Usage**
   - Check Spotify Dashboard for usage patterns
   - Alert on unusual activity

3. **Rate Limiting**
   - Add rate limiter to prevent abuse
   - Example: 10 requests per minute per IP

4. **HTTPS Only**
   - Use SSL/TLS certificates
   - Never send credentials over HTTP

5. **Backend Logs**
   - Log all API requests
   - Monitor for errors and attacks
   - Don't log sensitive data

6. **Regular Updates**
   - Keep Node.js updated
   - Update npm packages: `npm update`
   - Check for security vulnerabilities: `npm audit`

---

## Next Steps

1. ✅ Set up backend server locally
2. ✅ Test all API endpoints
3. ✅ Verify frontend integration works
4. ✅ Test search and add to playlist
5. 🚀 Deploy backend to production
6. 🚀 Update frontend CORS/API URLs
7. 🚀 Monitor and maintain

---

## Support Resources

- **Spotify Web API Docs**: https://developer.spotify.com/documentation/web-api
- **Express.js Guide**: https://expressjs.com/
- **Node.js Docs**: https://nodejs.org/docs/
- **CORS Documentation**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

**Last Updated:** 2024  
**Maintained By:** Music Player Team  
**Status:** ✅ Production Ready
