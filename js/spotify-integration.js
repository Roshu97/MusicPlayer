/**
 * Spotify Integration Module - SAFE FOR FRONTEND
 * Communicates with secure backend only
 * No tokens exposed to client
 */

class SpotifyIntegration {
    constructor(musicPlayer) {
        this.player = musicPlayer;
        this.apiUrl = 'http://localhost:3000/api'; // Backend URL
        this.setupUI();
    }

    /**
     * Add Spotify search UI to the player
     */
    setupUI() {
        // Create search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'spotify-search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input 
                    type="text" 
                    id="spotifySearchInput" 
                    class="search-input"
                    placeholder="Search Spotify music..."
                >
                <button id="spotifySearchBtn" class="search-btn">
                    <i class="fas fa-search"></i> Search
                </button>
            </div>
            <div id="spotifyResults" class="spotify-results" style="display:none;">
                <h3>Search Results</h3>
                <ul id="resultsListSpotify" class="results-list"></ul>
            </div>
        `;

        // Insert after add song button
        const addSongBtn = document.getElementById('addSongBtn');
        if (addSongBtn) {
            addSongBtn.parentElement.appendChild(searchContainer);
        }

        // Setup event listeners
        document.getElementById('spotifySearchBtn').addEventListener('click', 
            () => this.searchMusic()
        );
        document.getElementById('spotifySearchInput').addEventListener('keypress', 
            (e) => e.key === 'Enter' && this.searchMusic()
        );
    }

    /**
     * Search Spotify (calls secure backend)
     */
    async searchMusic() {
        const query = document.getElementById('spotifySearchInput').value.trim();

        if (!query || query.length < 2) {
            alert('Please enter a song name');
            return;
        }

        try {
            // Call backend (never expose token to frontend)
            const response = await fetch(
                `${this.apiUrl}/search/${encodeURIComponent(query)}`
            );

            if (!response.ok) {
                throw new Error(`Search failed: ${response.statusText}`);
            }

            const tracks = await response.json();

            if (tracks.length === 0) {
                alert('No tracks found');
                return;
            }

            // Display results
            this.displayResults(tracks);

        } catch (error) {
            console.error('Search error:', error);
            alert('Search failed: ' + error.message);
        }
    }

    /**
     * Display search results
     */
    displayResults(tracks) {
        const resultsList = document.getElementById('resultsListSpotify');
        const resultsDiv = document.getElementById('spotifyResults');

        resultsList.innerHTML = '';

        tracks.forEach(track => {
            const li = document.createElement('li');
            li.className = 'result-item';
            li.innerHTML = `
                <div class="result-info">
                    <img src="${track.cover || 'assets/default-album.svg'}" 
                         alt="Cover" class="result-cover">
                    <div class="result-text">
                        <strong>${track.title}</strong><br>
                        <span>${track.artist}</span><br>
                        <small>${track.album}</small>
                    </div>
                </div>
                <button class="add-track-btn">
                    <i class="fas fa-plus"></i>
                </button>
            `;

            // Add to playlist on click
            li.querySelector('.add-track-btn').addEventListener('click', () => {
                this.addToPlaylist(track);
            });

            resultsList.appendChild(li);
        });

        resultsDiv.style.display = 'block';
    }

    /**
     * Add track to player playlist
     */
    addToPlaylist(track) {
        const song = {
            title: track.title,
            artist: track.artist,
            album: track.album,
            duration: track.duration || 0,
            src: track.preview,  // Use 30-second preview
            cover: track.cover || 'assets/default-album.svg'
        };

        // Check if preview available
        if (!track.preview) {
            alert('No preview available for this track');
            return;
        }

        // Add to playlist
        this.player.playlist.push(song);
        this.player.renderPlaylist();

        alert(`Added: ${track.title} by ${track.artist}`);
    }

    /**
     * Load featured playlists
     */
    async loadFeaturedPlaylists() {
        try {
            const response = await fetch(`${this.apiUrl}/playlists`);
            const playlists = await response.json();
            console.log('Featured playlists:', playlists);
            return playlists;
        } catch (error) {
            console.error('Failed to load playlists:', error);
            return [];
        }
    }

    /**
     * Load top tracks
     */
    async loadTopTracks() {
        try {
            const response = await fetch(`${this.apiUrl}/top-tracks`);
            const tracks = await response.json();
            console.log('Top tracks:', tracks);
            return tracks;
        } catch (error) {
            console.error('Failed to load top tracks:', error);
            return [];
        }
    }
}

// Initialize Spotify integration when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (typeof musicPlayer !== 'undefined') {
        window.spotifyIntegration = new SpotifyIntegration(musicPlayer);
    }
});
