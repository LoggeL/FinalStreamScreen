export class PhonebookScene {
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
        link.href = '/scenes/phonebook/phonebook.css';
        document.head.appendChild(link);
        this.styleSheet = link;
    }

    async loadHTML() {
        const response = await fetch('/scenes/phonebook/phonebook.html');
        const html = await response.text();
        this.container.innerHTML = html;
    }

    initializeElements() {
        this.searchInput = this.container.querySelector('.search-input input');
        this.contactsList = this.container.querySelector('.contacts-list');
        this.tabButtons = this.container.querySelectorAll('.tab-item');
        this.callButtons = this.container.querySelectorAll('.call-button');
        this.sections = this.container.querySelectorAll('.section');
    }

    addEventListeners() {
        // Search functionality
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Tab switching
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button));
        });

        // Call buttons
        this.callButtons.forEach(button => {
            button.addEventListener('click', (e) => this.initiateCall(e));
        });
    }

    handleSearch(query) {
        query = query.toLowerCase();
        let hasResults = false;

        // Hide all sections initially
        this.sections.forEach(section => {
            section.style.display = 'none';
        });

        this.sections.forEach(section => {
            const contacts = section.querySelectorAll('.contact-item');
            let sectionHasResults = false;

            contacts.forEach(contact => {
                const name = contact.querySelector('.contact-name').textContent.toLowerCase();
                if (name.includes(query)) {
                    contact.style.display = 'flex';
                    sectionHasResults = true;
                    hasResults = true;
                } else {
                    contact.style.display = 'none';
                }
            });

            if (sectionHasResults) {
                section.style.display = 'block';
            }
        });

        // Always show favorites section if no query
        if (!query) {
            this.sections[0].style.display = 'block';
        }
    }

    switchTab(selectedTab) {
        this.tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        selectedTab.classList.add('active');

        // Clear search when switching tabs
        this.searchInput.value = '';
        this.handleSearch('');
    }

    async initiateCall(e) {
        const contactItem = e.target.closest('.contact-item');
        if (contactItem && contactItem.dataset.contact === 'hannah') {
            const { CallScene } = await import('../call/call.js');
            window.sceneManager.currentScene = new CallScene(this.container, true);
        }
    }

    cleanup() {
        if (this.styleSheet) {
            document.head.removeChild(this.styleSheet);
        }
    }
} 