export class DialerScene {
    constructor(container) {
        this.container = container;
        this.loadCSS();
        this.loadHTML().then(() => {
            this.initializeElements();
            this.addEventListeners();
        });
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/scenes/dialer/dialer.css';
        document.head.appendChild(link);
        this.styleSheet = link;
    }

    async loadHTML() {
        const response = await fetch('/scenes/dialer/dialer.html');
        const html = await response.text();
        this.container.innerHTML = html;
    }

    initializeElements() {
        this.display = this.container.querySelector('.number-display');
        this.keypad = this.container.querySelector('.keypad');
        this.callButton = this.container.querySelector('.call-button');
        this.deleteButton = this.container.querySelector('.delete-button');
        this.emergencyHint = this.container.querySelector('.emergency-hint');
    }

    addEventListeners() {
        this.keypad.addEventListener('click', (e) => {
            const button = e.target.closest('.keypad-button');
            if (button) {
                const digit = button.dataset.digit;
                if (digit) {
                    this.addDigit(digit);
                }
            }
        });

        this.callButton.addEventListener('click', () => this.initiateCall());
        this.deleteButton.addEventListener('click', () => this.deleteDigit());

        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                this.addDigit(e.key);
            } else if (e.key === '*') {
                this.addDigit('*');
            } else if (e.key === '#') {
                this.addDigit('#');
            } else if (e.key === 'Backspace') {
                this.deleteDigit();
            } else if (e.key === 'Enter') {
                this.initiateCall();
            }
        });
    }

    addDigit(digit) {
        if (!this.display.value) {
            this.display.value = '';
        }
        if (this.display.value.length < 15) {
            this.display.value += digit;
            this.updateCallButton();
        }
    }

    deleteDigit() {
        this.display.value = this.display.value.slice(0, -1);
        this.updateCallButton();
    }

    updateCallButton() {
        const number = this.display.value;
        if (number === '110') {
            this.callButton.classList.add('emergency');
            this.emergencyHint.classList.remove('hidden');
        } else {
            this.callButton.classList.remove('emergency');
            this.emergencyHint.classList.add('hidden');
        }
    }

    initiateCall() {
        const number = this.display.value;
        if (number === '110') {
            // Load the call scene
            import('../call/call.js').then(module => {
                const CallScene = module.CallScene;
                window.app.currentScene = new CallScene(this.container);
                
                // Show direct call UI
                setTimeout(() => {
                    const activeCall = this.container.querySelector('.active-call');
                    const incomingCall = this.container.querySelector('.incoming-call');
                    if (activeCall && incomingCall) {
                        incomingCall.classList.add('hidden');
                        activeCall.classList.remove('hidden');
                        // Update caller name for emergency
                        const callerName = activeCall.querySelector('h1');
                        if (callerName) {
                            callerName.textContent = 'Notruf - Polizei';
                        }
                        // Start the call timer
                        window.app.currentScene.startCallTimer();
                    }
                }, 500);
            });
        }
    }

    cleanup() {
        if (this.styleSheet) {
            document.head.removeChild(this.styleSheet);
        }
        // Remove keyboard event listener
        document.removeEventListener('keydown', this.handleKeydown);
    }
} 