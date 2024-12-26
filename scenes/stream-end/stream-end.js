export class StreamEndScene {
    constructor(container) {
        this.container = container;
        this.isGlitching = false;
        this.streamDuration = 7200 + Math.floor(Math.random() * 1800); // ~2 hours + random 0-30 minutes
        this.viewerCount = 1337;
        this.updateInterval = null;
        
        this.loadCSS();
        this.loadHTML().then(() => {
            this.initializeElements();
            this.addEventListeners();
            this.startUpdates();
            this.updateStreamInfo(); // Initial update
        });
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/scenes/stream-end/stream-end.css';
        document.head.appendChild(link);
        this.styleSheet = link;
    }

    async loadHTML() {
        const response = await fetch('/scenes/stream-end/stream-end.html');
        const html = await response.text();
        this.container.innerHTML = html;
    }

    initializeElements() {
        this.endButton = this.container.querySelector('.end-stream-button');
        this.confirmationOverlay = this.container.querySelector('.confirmation-overlay');
        this.cancelButton = this.container.querySelector('.cancel-button');
        this.confirmButton = this.container.querySelector('.confirm-button');
        this.glitchOverlay = this.container.querySelector('.glitch-overlay');
        this.reactivationMessage = this.container.querySelector('.reactivation-message');
        this.streamDurationElement = this.container.querySelector('.stream-duration span');
        this.viewerCountElement = this.container.querySelector('.viewer-count span');
    }

    addEventListeners() {
        this.endButton.addEventListener('click', () => this.showConfirmation());
        this.cancelButton.addEventListener('click', () => this.hideConfirmation());
        this.confirmButton.addEventListener('click', () => this.attemptEndStream());
    }

    startUpdates() {
        // Update stream duration every second
        this.updateInterval = setInterval(() => {
            this.streamDuration++;
            this.updateStreamInfo();
        }, 1000);

        // Randomly update viewer count
        setInterval(() => {
            this.viewerCount += Math.floor(Math.random() * 21) - 10; // -10 to +10
            this.updateStreamInfo();
        }, 5000);
    }

    updateStreamInfo() {
        // Update duration
        const hours = Math.floor(this.streamDuration / 3600);
        const minutes = Math.floor((this.streamDuration % 3600) / 60);
        const seconds = this.streamDuration % 60;
        this.streamDurationElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update viewer count
        this.viewerCountElement.textContent = `${this.viewerCount.toLocaleString()} Zuschauer`;
    }

    showConfirmation() {
        this.confirmationOverlay.classList.remove('hidden');
    }

    hideConfirmation() {
        this.confirmationOverlay.classList.add('hidden');
    }

    attemptEndStream() {
        this.hideConfirmation();
        this.endButton.classList.add('glitching');
        
        // Show glitch overlay after a short delay
        setTimeout(() => {
            this.glitchOverlay.classList.remove('hidden');
            
            // Show reactivation message after glitch
            setTimeout(() => {
                this.glitchOverlay.classList.add('hidden');
                this.endButton.classList.remove('glitching');
                this.reactivationMessage.classList.remove('hidden');
                
                // Hide reactivation message after a few seconds
                setTimeout(() => {
                    this.reactivationMessage.classList.add('hidden');
                }, 3000);
            }, 2000);
        }, 500);
    }

    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.styleSheet) {
            document.head.removeChild(this.styleSheet);
        }
    }
} 