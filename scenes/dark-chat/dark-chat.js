export class DarkChatScene {
    constructor(container) {
        this.container = container;
        this.messageInterval = null;
        this.glitchInterval = null;
        
        // Mysterious usernames
        this.usernames = [
            'Waldgeist', 'Schattenwanderer', 'Nebelstimme', 'Dunkelwanderer',
            'Irrlicht', 'Nachtwächter', 'Höhlenstimme', 'Nebelbote'
        ];
        
        // Mysterious messages trying to lead astray
        this.messages = [
            'Der alte Pfad birgt Geheimnisse...',
            'Hier unten ist es viel interessanter...',
            'Die Schatten kennen den wahren Weg...',
            'Folge dem Flüstern der Steine...',
            'Der Nebel zeigt dir neue Wege...',
            'Die verlassenen Tunnel rufen...',
            'Vertraue den alten Zeichen...',
            'Im Dunkeln liegt die Wahrheit...',
            'Die Markierungen täuschen...',
            'Hörst du die Stimmen aus der Tiefe?',
            'Der Berggeist kennt Abkürzungen...',
            'Dieser Weg ist zu gewöhnlich für dich...',
            'Die alten Minen bergen Schätze...',
            'Das Echo weist dir den Weg...'
        ];
        
        // Glitch text patterns
        this.glitchPatterns = [
            '⟒⋏⏁⎎⟒⍀⋏⟒ ⎅⟟☊⊑...',
            '⎎⍜⌰☌⟒ ⎍⋏⌇...',
            '⎅⟒⍀ ⍙⟒☌...',
            '⋔⟒⊑⍀ ⏁⟟⟒⎎⟒⍀...',
            '⎅⟟⟒ ⌇☊⊑⏃⏁⏁⟒⋏...'
        ];
        
        this.loadCSS();
        this.loadHTML().then(() => {
            this.initializeElements();
            this.startMessageCycle();
            this.startGlitchEffects();
        });
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/scenes/dark-chat/dark-chat.css';
        document.head.appendChild(link);
        this.styleSheet = link;
    }

    async loadHTML() {
        const response = await fetch('/scenes/dark-chat/dark-chat.html');
        const html = await response.text();
        this.container.innerHTML = html;
    }

    initializeElements() {
        this.chatMessages = this.container.querySelector('.chat-messages');
        this.glitchOverlay = this.container.querySelector('.glitch-overlay');
        this.statusDot = this.container.querySelector('.status-dot');
        this.viewerCount = this.container.querySelector('.viewer-count');
    }

    startMessageCycle() {
        // Add new mysterious message every 8-15 seconds
        this.messageInterval = setInterval(() => {
            if (Math.random() < 0.85) { // 85% chance for normal message
                this.addMessage();
            } else { // 15% chance for glitch message
                this.addGlitchMessage();
            }
            
            // Randomly update viewer count
            this.updateViewerCount();
        }, 8000 + Math.random() * 7000);
    }

    startGlitchEffects() {
        // Add subtle glitch effects every 20-30 seconds
        this.glitchInterval = setInterval(() => {
            this.triggerGlitchEffect();
        }, 20000 + Math.random() * 10000);
    }

    addMessage() {
        const message = document.createElement('div');
        message.className = 'message';
        
        const timestamp = this.getTimestamp();
        const username = this.usernames[Math.floor(Math.random() * this.usernames.length)];
        const content = this.messages[Math.floor(Math.random() * this.messages.length)];
        
        message.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <span class="username ${Math.random() < 0.5 ? 'mysterious' : 'shadow'}">${username}</span>
            <span class="content">${content}</span>
        `;
        
        this.chatMessages.appendChild(message);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        // Randomly add glitch effect to message
        if (Math.random() < 0.1) {
            setTimeout(() => {
                message.style.transform = 'translate(-1px, 1px)';
                setTimeout(() => {
                    message.style.transform = 'none';
                }, 100);
            }, Math.random() * 1000);
        }
    }

    addGlitchMessage() {
        const message = document.createElement('div');
        message.className = 'message system glitch-text';
        
        const timestamp = this.getTimestamp();
        const content = this.glitchPatterns[Math.floor(Math.random() * this.glitchPatterns.length)];
        
        message.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <span class="content">${content}</span>
        `;
        
        this.chatMessages.appendChild(message);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    getTimestamp() {
        const date = new Date();
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    updateViewerCount() {
        // Randomly fluctuate viewer count between 10-15
        const viewers = 10 + Math.floor(Math.random() * 6);
        this.viewerCount.textContent = `${viewers} Zuschauer`;
    }

    triggerGlitchEffect() {
        // Add temporary glitch class to create visual distortion
        this.container.classList.add('glitching');
        
        // Random glitch duration between 200-500ms
        setTimeout(() => {
            this.container.classList.remove('glitching');
        }, 200 + Math.random() * 300);
        
        // Randomly glitch the status dot
        if (Math.random() < 0.3) {
            this.statusDot.style.backgroundColor = '#ff4444';
            setTimeout(() => {
                this.statusDot.style.backgroundColor = '#45454a';
            }, 150);
        }
    }

    cleanup() {
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
        }
        if (this.glitchInterval) {
            clearInterval(this.glitchInterval);
        }
        if (this.styleSheet) {
            document.head.removeChild(this.styleSheet);
        }
    }
} 