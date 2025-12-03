/**
 * Music Player Application
 * A comprehensive HTML5 audio player with playlist management,
 * volume control, and responsive design.
 */

class MusicPlayer {
    constructor() {
        // DOM Elements
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.progressSlider = document.getElementById('progressSlider');
        this.progress = document.getElementById('progress');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.songTitle = document.getElementById('songTitle');
        this.artistName = document.getElementById('artistName');
        this.albumName = document.getElementById('albumName');
        this.albumArt = document.getElementById('albumArt');
        this.playlistBtn = document.getElementById('playlistBtn');
        this.addSongBtn = document.getElementById('addSongBtn');
        this.playlistSidebar = document.getElementById('playlistSidebar');
        this.playlistItems = document.getElementById('playlistItems');
        this.closePlaylistBtn = document.getElementById('closePlaylistBtn');
        this.overlay = document.getElementById('overlay');
        this.menuBtn = document.getElementById('menuBtn');
        this.playingIndicator = document.getElementById('playingIndicator');

        // Player State
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
        this.isShuffle = false;
        this.playlist = [];
        this.shuffledIndices = [];

        // Initialize
        this.init();
    }

    /**
     * Initialize the player
     */
    init() {
        // Load default playlist
        this.loadDefaultPlaylist();

        // Event Listeners
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.progressSlider.addEventListener('input', (e) => this.seek(e.target.value));
        this.playlistBtn.addEventListener('click', () => this.togglePlaylist());
        this.addSongBtn.addEventListener('click', () => this.addSongUI());
        this.closePlaylistBtn.addEventListener('click', () => this.togglePlaylist());
        this.overlay.addEventListener('click', () => this.togglePlaylist());
        this.menuBtn.addEventListener('click', () => this.togglePlaylist());

        // Audio Events
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioPlayer.addEventListener('ended', () => this.handleTrackEnd());
        this.audioPlayer.addEventListener('play', () => this.onPlay());
        this.audioPlayer.addEventListener('pause', () => this.onPause());

        // Set initial volume
        this.audioPlayer.volume = this.volumeSlider.value / 100;

        // Load first track
        if (this.playlist.length > 0) {
            this.loadTrack(0);
        }

        // Render playlist
        this.renderPlaylist();
    }

    /**
     * Load default playlist with free music from online sources
     * All songs are from Creative Commons/Free Music sources
     */
    loadDefaultPlaylist() {
        this.playlist = [
            {
                title: 'Sunny',
                artist: 'Bensound',
                album: 'Royalty Free Music',
                duration: 264,
                src: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
                cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'
            },
            {
                title: 'Ukulele',
                artist: 'Bensound',
                album: 'Royalty Free Music',
                duration: 128,
                src: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3',
                cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop'
            },
            {
                title: 'Ambient',
                artist: 'Bensound',
                album: 'Royalty Free Music',
                duration: 146,
                src: 'https://www.bensound.com/bensound-music/bensound-ambient.mp3',
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
            },
            {
                title: 'Electronica',
                artist: 'Bensound',
                album: 'Royalty Free Music',
                duration: 182,
                src: 'https://www.bensound.com/bensound-music/bensound-electronica.mp3',
                cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop'
            },
            {
                title: 'Happiness',
                artist: 'Bensound',
                album: 'Royalty Free Music',
                duration: 138,
                src: 'https://www.bensound.com/bensound-music/bensound-happiness.mp3',
                cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop'
            }
        ];
    }

    /**
     * Load a track
     */
    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;

        this.currentTrackIndex = index;
        const track = this.playlist[index];

        // Update audio source
        this.audioPlayer.src = track.src;

        // Update UI
        this.songTitle.textContent = track.title;
        this.artistName.textContent = track.artist;
        this.albumName.textContent = track.album;
        this.albumArt.src = track.cover;
        this.albumArt.alt = track.title;

        // Reset progress
        this.progressSlider.value = 0;
        this.progress.style.width = '0%';
        this.currentTimeEl.textContent = '0:00';

        // Update playlist UI
        this.renderPlaylist();
    }

    /**
     * Toggle play/pause
     */
    togglePlay() {
        if (this.isPlaying) {
            this.audioPlayer.pause();
        } else {
            if (this.audioPlayer.src) {
                this.audioPlayer.play();
            }
        }
    }

    /**
     * Handle play event
     */
    onPlay() {
        this.isPlaying = true;
        this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.playingIndicator.style.opacity = '1';
    }

    /**
     * Handle pause event
     */
    onPause() {
        this.isPlaying = false;
        this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.playingIndicator.style.opacity = '0';
    }

    /**
     * Next track
     */
    nextTrack() {
        if (this.isShuffle) {
            this.currentTrackIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        }
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) {
            this.audioPlayer.play();
        }
    }

    /**
     * Previous track
     */
    previousTrack() {
        if (this.audioPlayer.currentTime > 3) {
            // If more than 3 seconds played, restart current track
            this.audioPlayer.currentTime = 0;
        } else {
            // Go to previous track
            this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
            this.loadTrack(this.currentTrackIndex);
            if (this.isPlaying) {
                this.audioPlayer.play();
            }
        }
    }

    /**
     * Toggle repeat mode
     */
    toggleRepeat() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        const icons = ['redo', 'redo', 'redo'];
        const tooltips = ['Repeat Off', 'Repeat All', 'Repeat One'];

        this.repeatBtn.classList.toggle('active', this.repeatMode > 0);
        this.repeatBtn.title = tooltips[this.repeatMode];

        if (this.repeatMode === 2) {
            this.repeatBtn.innerHTML = '<i class="fas fa-redo"></i><span style="font-size: 10px; position: absolute; bottom: 5px; right: 5px;">1</span>';
        } else {
            this.repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        }
    }

    /**
     * Toggle shuffle mode
     */
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
        this.shuffleBtn.title = this.isShuffle ? 'Shuffle On' : 'Shuffle Off';
    }

    /**
     * Set volume
     */
    setVolume(value) {
        this.audioPlayer.volume = value / 100;
    }

    /**
     * Seek to a specific time
     */
    seek(value) {
        const time = (value / 100) * this.audioPlayer.duration;
        this.audioPlayer.currentTime = time;
    }

    /**
     * Update progress bar
     */
    updateProgress() {
        const percent = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100 || 0;
        this.progress.style.width = percent + '%';
        this.progressSlider.value = percent;
        this.currentTimeEl.textContent = this.formatTime(this.audioPlayer.currentTime);
    }

    /**
     * Update duration display
     */
    updateDuration() {
        this.durationEl.textContent = this.formatTime(this.audioPlayer.duration);
        this.progressSlider.max = 100;
    }

    /**
     * Format time in MM:SS format
     */
    formatTime(time) {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    /**
     * Handle track end
     */
    handleTrackEnd() {
        if (this.repeatMode === 2) {
            // Repeat one
            this.audioPlayer.currentTime = 0;
            this.audioPlayer.play();
        } else {
            // Go to next track
            this.nextTrack();
        }
    }

    /**
     * Toggle playlist sidebar
     */
    togglePlaylist() {
        this.playlistSidebar.classList.toggle('active');
        this.overlay.classList.toggle('active');
    }

    /**
     * Render playlist items
     */
    renderPlaylist() {
        this.playlistItems.innerHTML = '';

        this.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item' + (index === this.currentTrackIndex ? ' active' : '');
            li.innerHTML = `
                <div class="playlist-item-title">${track.title}</div>
                <div class="playlist-item-artist">${track.artist}</div>
            `;
            li.addEventListener('click', () => {
                this.loadTrack(index);
                this.audioPlayer.play();
                this.togglePlaylist();
            });
            this.playlistItems.appendChild(li);
        });
    }

    /**
     * Add song UI (placeholder for file upload)
     */
    addSongUI() {
        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.addSongFromFile(file);
            }
        });
        fileInput.click();
    }

    /**
     * Add song from file
     */
    addSongFromFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const audio = new Audio();
            audio.onloadedmetadata = () => {
                const song = {
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    artist: 'Unknown Artist',
                    album: 'My Music',
                    duration: audio.duration,
                    src: e.target.result,
                    cover: 'https://via.placeholder.com/300?text=Album'
                };
                this.playlist.push(song);
                this.renderPlaylist();
                alert('Song added successfully!');
            };
            audio.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Initialize Music Player when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    const player = new MusicPlayer();
    // Make player globally accessible for debugging
    window.musicPlayer = player;
});
