// Import scenes
const scenes = {
    'incoming-call': () => import('./scenes/call/call.js').then(m => m.CallScene),
    'stream-control': () => import('./scenes/stream/stream.js').then(m => m.StreamScene),
    'phonebook': () => import('./scenes/phonebook/phonebook.js').then(m => m.PhonebookScene),
    'gps': () => import('./scenes/gps/gps.js').then(m => m.GPSScene),
    'dialer': () => import('./scenes/dialer/dialer.js').then(m => m.DialerScene),
    'dark-chat': () => import('./scenes/dark-chat/dark-chat.js').then(m => m.DarkChatScene),
    'stream-chat': () => import('./scenes/chat/chat.js').then(m => m.ChatScene),
    'stream-end': () => import('./scenes/stream-end/stream-end.js').then(m => m.StreamEndScene)
};

class App {
    constructor() {
        this.currentScene = null;
        this.menuView = document.querySelector('.menu-view');
        this.sceneView = document.querySelector('.scene-view');
        this.fullscreenButton = document.querySelector('.fullscreen-button');
        
        this.init();
        this.initFullscreen();
    }

    init() {
        // Simple click handler for scene cards
        document.querySelectorAll('.scene-card').forEach(card => {
            card.addEventListener('click', () => {
                const scene = card.dataset.scene;
                this.loadScene(scene);
            });
        });
    }

    initFullscreen() {
        if (this.fullscreenButton) {
            this.fullscreenButton.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Update button icon when fullscreen state changes
        document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenButton());
    }

    async toggleFullscreen() {
        try {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                // Enter fullscreen
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    await document.documentElement.webkitRequestFullscreen();
                }
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                }
            }
        } catch (err) {
            console.error('Error toggling fullscreen:', err);
        }
    }

    updateFullscreenButton() {
        const icon = this.fullscreenButton.querySelector('i');
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            icon.classList.remove('fa-expand');
            icon.classList.add('fa-compress');
        } else {
            icon.classList.remove('fa-compress');
            icon.classList.add('fa-expand');
        }
    }

    async loadScene(sceneName) {
        // Clean up current scene if it exists
        if (this.currentScene && this.currentScene.cleanup) {
            this.currentScene.cleanup();
        }

        // Hide menu and show scene view
        this.menuView.classList.add('hidden');
        this.sceneView.classList.remove('hidden');

        try {
            // Load the scene class dynamically
            const SceneClass = await scenes[sceneName]();
            this.currentScene = new SceneClass(this.sceneView.querySelector('.call-screen'));
        } catch (error) {
            console.error('Error loading scene:', error);
            this.showMenu();
        }
    }

    showMenu() {
        // Clean up current scene if it exists
        if (this.currentScene && this.currentScene.cleanup) {
            this.currentScene.cleanup();
        }

        // Show menu and hide scene view
        this.menuView.classList.remove('hidden');
        this.sceneView.classList.add('hidden');
        this.currentScene = null;
    }
}

// Initialize app
const app = new App();
window.app = app;

// Status bar time update
function updateStatusBarTime() {
    const timeElement = document.querySelector('.status-bar .time');
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
}

// Handle screen orientation
function handleOrientation() {
    if (window.screen && window.screen.orientation) {
        window.screen.orientation.lock('portrait').catch(() => {
            // Silently fail if orientation locking is not supported
        });
    }
}

// Update time every minute
setInterval(updateStatusBarTime, 60000);
updateStatusBarTime(); // Initial update

// Initial orientation handling
handleOrientation(); 