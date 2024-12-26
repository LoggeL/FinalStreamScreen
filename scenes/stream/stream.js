export class StreamScene {
    constructor(container) {
        this.container = container;
        this.isLive = false;
        this.streamDuration = 0;
        this.streamInterval = null;
        
        this.loadCSS();
        this.loadHTML().then(() => {
            this.initializeElements();
            this.addEventListeners();
        });
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/scenes/stream/stream.css';
        document.head.appendChild(link);
        this.styleSheet = link;
    }

    async loadHTML() {
        const response = await fetch('/scenes/stream/stream.html');
        const html = await response.text();
        this.container.innerHTML = html;
    }

    initializeElements() {
        this.statusIndicator = this.container.querySelector('.status-indicator');
        this.statusText = this.container.querySelector('.status-text');
        this.streamStats = this.container.querySelector('.stream-stats');
        this.streamDurationElement = this.container.querySelector('.stream-duration');
        this.goLiveButton = this.container.querySelector('.go-live-button');
        this.settingsButtons = this.container.querySelectorAll('.settings-button');
    }

    addEventListeners() {
        this.goLiveButton.addEventListener('click', () => this.toggleLiveState());
        
        this.settingsButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleSetting(button));
        });
    }

    toggleLiveState() {
        this.isLive = !this.isLive;
        
        if (this.isLive) {
            this.startStream();
        } else {
            this.stopStream();
        }
    }

    startStream() {
        this.statusIndicator.classList.remove('offline');
        this.statusIndicator.classList.add('live');
        this.statusText.textContent = 'Live';
        this.streamStats.classList.remove('hidden');
        this.goLiveButton.classList.add('live');
        this.goLiveButton.querySelector('span').textContent = 'Stream beenden';
        
        this.streamDuration = 0;
        this.updateStreamDuration();
        this.streamInterval = setInterval(() => this.updateStreamDuration(), 1000);
    }

    stopStream() {
        this.statusIndicator.classList.remove('live');
        this.statusIndicator.classList.add('offline');
        this.statusText.textContent = 'Offline';
        this.streamStats.classList.add('hidden');
        this.goLiveButton.classList.remove('live');
        this.goLiveButton.querySelector('span').textContent = 'Live gehen';
        
        clearInterval(this.streamInterval);
    }

    updateStreamDuration() {
        this.streamDuration++;
        const hours = Math.floor(this.streamDuration / 3600);
        const minutes = Math.floor((this.streamDuration % 3600) / 60);
        const seconds = this.streamDuration % 60;
        
        this.streamDurationElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    toggleSetting(button) {
        button.classList.toggle('active');
        
        // Handle specific setting toggles
        if (button.title === 'Mikrofon') {
            const icon = button.querySelector('i');
            if (button.classList.contains('active')) {
                icon.classList.remove('fa-microphone');
                icon.classList.add('fa-microphone-slash');
            } else {
                icon.classList.remove('fa-microphone-slash');
                icon.classList.add('fa-microphone');
            }
        }
    }

    cleanup() {
        if (this.streamInterval) {
            clearInterval(this.streamInterval);
        }
        if (this.styleSheet) {
            document.head.removeChild(this.styleSheet);
        }
    }
} 