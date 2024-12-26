export class ChatScene {
    constructor(container) {
        this.container = container;
        this.messageInterval = null;
        this.slowMode = false;
        this.subsOnly = false;
        
        this.loadCSS();
        this.loadHTML().then(() => {
            this.initializeElements();
            this.addEventListeners();
            this.startMessageGeneration();
        });

        // Chat message templates
        this.messageTemplates = [
            "Wow, die Aussicht ist ja der Wahnsinn! 😍",
            "Wie lange wanderst du schon, Jenny?",
            "Pass auf den steilen Abhang auf!",
            "Der Schwarzwald ist einfach wunderschön",
            "Hast du genug Wasser dabei?",
            "Die Vögel im Hintergrund 🎵",
            "Wie viele Kilometer noch bis zum Gipfel?",
            "Die Luft muss dort oben so frisch sein",
            "Siehst du schon das Tal?",
            "Mach mal ein Foto vom Ausblick!",
            "Gibt es dort auch Wildschweine? 🐗",
            "Der Wald sieht so mystisch aus",
            "Die Wanderroute sieht anspruchsvoll aus",
            "Nimm uns mit zum Wasserfall!",
            "Perfektes Wetter zum Wandern heute"
        ];

        this.usernames = [
            "Wanderfreund94", "Bergsteiger_Tim", "Naturliebhaber", 
            "Schwarzwald_Fan", "WaldEntdecker", "BergZiege", 
            "Wandersmann", "NaturFreundin", "Berg_und_Tal", 
            "WaldLäufer"
        ];
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/scenes/chat/chat.css';
        document.head.appendChild(link);
        this.styleSheet = link;
    }

    async loadHTML() {
        const response = await fetch('/scenes/chat/chat.html');
        const html = await response.text();
        this.container.innerHTML = html;
    }

    initializeElements() {
        this.chatMessages = this.container.querySelector('#chatMessages');
        this.messageInput = this.container.querySelector('#messageInput');
        this.sendButton = this.container.querySelector('.send-button');
        this.controlButtons = this.container.querySelectorAll('.control-button');
    }

    addEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        this.controlButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleControl(button));
        });
    }

    startMessageGeneration() {
        this.messageInterval = setInterval(() => {
            if (!this.slowMode) {
                this.generateRandomMessage();
            }
        }, 3000);

        // In slow mode, generate messages less frequently
        setInterval(() => {
            if (this.slowMode) {
                this.generateRandomMessage();
            }
        }, 8000);
    }

    generateRandomMessage() {
        const username = this.usernames[Math.floor(Math.random() * this.usernames.length)];
        const message = this.messageTemplates[Math.floor(Math.random() * this.messageTemplates.length)];
        const isSubscriber = Math.random() > 0.5;
        const isModerator = Math.random() > 0.8;

        if (this.subsOnly && !isSubscriber && !isModerator) return;

        this.addMessageToChat(username, message, isSubscriber, isModerator);
    }

    addMessageToChat(username, message, isSubscriber = false, isModerator = false) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        
        let badges = '';
        if (isModerator) {
            badges += '<span class="badge moderator">MOD</span>';
        }
        if (isSubscriber) {
            badges += '<span class="badge subscriber">SUB</span>';
        }

        messageElement.innerHTML = `
            ${badges}
            <span class="username">${username}:</span>
            <span class="message">${message}</span>
        `;

        this.chatMessages.appendChild(messageElement);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        // Keep only last 50 messages
        while (this.chatMessages.children.length > 50) {
            this.chatMessages.removeChild(this.chatMessages.firstChild);
        }
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (message) {
            this.addMessageToChat('Streamer', message, true, true);
            this.messageInput.value = '';
        }
    }

    toggleControl(button) {
        button.classList.toggle('active');
        
        if (button.title === 'Slow Mode') {
            this.slowMode = !this.slowMode;
        } else if (button.title === 'Nur Abonnenten') {
            this.subsOnly = !this.subsOnly;
        } else if (button.title === 'Chat löschen') {
            this.chatMessages.innerHTML = '';
            button.classList.remove('active');
        }
    }

    cleanup() {
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
        }
        if (this.styleSheet) {
            document.head.removeChild(this.styleSheet);
        }
    }
} 