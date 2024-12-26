export class CallScene {
    constructor(container) {
        this.container = container;
        this.callDuration = 0;
        this.callTimer = null;
        this.loadCSS();
        this.loadHTML().then(() => {
            this.initializeElements();
            this.addEventListeners();
        });
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/scenes/call/call.css';
        document.head.appendChild(link);
        this.styleSheet = link;
    }

    async loadHTML() {
        const response = await fetch('/scenes/call/call.html');
        const html = await response.text();
        this.container.innerHTML = html;
    }

    initializeElements() {
        this.incomingCall = this.container.querySelector('.incoming-call');
        this.activeCall = this.container.querySelector('.active-call');
        this.callTimer = this.container.querySelector('.active-call .caller-info p');
        this.acceptButton = this.container.querySelector('.accept-call');
        this.declineButton = this.container.querySelector('.decline-call');
        this.endCallButton = this.container.querySelector('.end-call');
        this.controlButtons = this.container.querySelectorAll('.control-button');
    }

    addEventListeners() {
        this.acceptButton.addEventListener('click', () => this.acceptCall());
        this.declineButton.addEventListener('click', () => this.endCall());
        this.endCallButton.addEventListener('click', () => this.endCall());
        
        this.controlButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.classList.toggle('active');
            });
        });
    }

    acceptCall() {
        this.incomingCall.classList.add('hidden');
        this.activeCall.classList.remove('hidden');
        this.startCallTimer();
    }

    startCallTimer() {
        this.callDuration = 0;
        this.updateCallTimer();
        this.timer = setInterval(() => {
            this.callDuration++;
            this.updateCallTimer();
        }, 1000);
    }

    updateCallTimer() {
        const minutes = Math.floor(this.callDuration / 60);
        const seconds = this.callDuration % 60;
        this.callTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    endCall() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        // Return to menu using the global app instance
        if (window.app) {
            window.app.showMenu();
        }
    }

    cleanup() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        if (this.styleSheet) {
            document.head.removeChild(this.styleSheet);
        }
    }
} 