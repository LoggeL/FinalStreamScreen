export class GPSScene {
    constructor(container) {
        this.container = container;
        this.isGlitching = false;
        this.streamDuration = 0;
        this.updateInterval = null;
        this.glitchTimeout = null;
        this.glitchIntensity = 0;
        this.jumpCount = 0;
        this.maxJumps = 0;
        this.rapidJumpCount = 0;
        this.signalQuality = 1.0; // 1.0 = perfect, 0.0 = lost
        
        // Base coordinates (Berlin)
        this.baseLocation = {
            lat: 52.5200,
            lng: 13.4050
        };
        
        this.loadCSS();
        this.loadHTML().then(() => {
            this.initializeElements();
            this.startLocationUpdates();
        });
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/scenes/gps/gps.css';
        document.head.appendChild(link);
        this.styleSheet = link;
    }

    async loadHTML() {
        const response = await fetch('/scenes/gps/gps.html');
        const html = await response.text();
        this.container.innerHTML = html;
    }

    initializeElements() {
        this.latElement = this.container.querySelector('.coordinates .lat');
        this.lngElement = this.container.querySelector('.coordinates .lng');
        this.locationMarker = this.container.querySelector('.location-marker');
        this.accuracyCircle = this.container.querySelector('.accuracy-circle');
        this.errorMessage = this.container.querySelector('.error-message');
        this.signalWarning = this.container.querySelector('.signal-warning');
        this.signalStrength = this.container.querySelectorAll('.signal-strength .bar');
        this.signalStrengthContainer = this.container.querySelector('.signal-strength');
        this.mapContainer = this.container.querySelector('.map-container');
        this.gpsView = this.container.querySelector('.gps-view');
    }

    startLocationUpdates() {
        // Update location more frequently for smoother jumps
        this.updateInterval = setInterval(() => this.updateLocation(), 100);
        
        // Start glitch cycle
        this.startGlitchCycle();
    }

    updateLocation() {
        if (this.isGlitching) {
            // Update signal quality based on glitch progress
            const jumpProgress = this.jumpCount / this.maxJumps;
            this.signalQuality = Math.max(0, 1 - (jumpProgress * 1.2));
            
            // Generate random offset during glitch (larger variation based on intensity)
            const maxOffset = 0.1 * this.glitchIntensity * (1 + jumpProgress);
            const latOffset = (Math.random() - 0.5) * maxOffset;
            const lngOffset = (Math.random() - 0.5) * maxOffset;
            
            const newLat = this.baseLocation.lat + latOffset;
            const newLng = this.baseLocation.lng + lngOffset;
            
            // Update coordinates display with glitch effect
            this.latElement.textContent = `${newLat.toFixed(4)}°N`;
            this.lngElement.textContent = `${newLng.toFixed(4)}°O`;
            
            // Enhanced erratic movement with rapid jumps
            this.jumpCount++;
            this.rapidJumpCount = (this.rapidJumpCount + 1) % 5; // Cycle through 5 rapid jump positions
            
            const jumpProgress2 = Math.min(1, jumpProgress * 1.5);
            const baseMaxOffset = 100 * this.glitchIntensity;
            const jumpIntensity = Math.min(4, 1 + (jumpProgress2 * 3));
            
            // Calculate rapid jump offset
            const rapidJumpOffset = Math.sin(this.rapidJumpCount * Math.PI / 2.5) * 20 * jumpProgress2;
            
            // Exponentially increase jump distance as we approach error
            const maxPixelOffset = baseMaxOffset * jumpIntensity;
            const xOffset = (Math.random() - 0.5) * maxPixelOffset + rapidJumpOffset;
            const yOffset = (Math.random() - 0.5) * maxPixelOffset + rapidJumpOffset;
            
            // Add micro-movements based on rapid jump count
            const microJump = Math.sin(this.rapidJumpCount * 1.5) * 15 * jumpIntensity;
            const finalX = xOffset + microJump;
            const finalY = yOffset + microJump;
            
            this.locationMarker.style.transform = `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px))`;
            
            // Update signal strength indication
            this.updateSignalStrength();
            
            // Show warning or error based on signal quality
            if (this.signalQuality < 0.2) {
                this.errorMessage.classList.remove('hidden');
                this.signalWarning.classList.add('hidden');
            } else if (this.signalQuality < 0.5) {
                this.errorMessage.classList.add('hidden');
                this.signalWarning.classList.remove('hidden');
            } else {
                this.errorMessage.classList.add('hidden');
                this.signalWarning.classList.add('hidden');
            }

            // Add glitching class to enable CSS animations
            this.gpsView.classList.add('glitching');
        } else {
            this.jumpCount = 0;
            this.rapidJumpCount = 0;
            this.signalQuality = 1.0;
            
            // Normal state
            this.latElement.textContent = `${this.baseLocation.lat.toFixed(4)}°N`;
            this.lngElement.textContent = `${this.baseLocation.lng.toFixed(4)}°O`;
            this.locationMarker.style.transform = 'translate(-50%, -50%)';
            this.errorMessage.classList.add('hidden');
            this.signalWarning.classList.add('hidden');
            
            // Reset signal strength
            this.updateSignalStrength();
            
            // Remove glitching class
            this.gpsView.classList.remove('glitching');
        }
    }

    updateSignalStrength() {
        // Update signal strength bars based on signal quality
        this.signalStrength.forEach((bar, index) => {
            const barThreshold = (index + 1) / this.signalStrength.length;
            const heightMultiplier = this.signalQuality >= barThreshold ? 1 : 
                                   Math.max(0, this.signalQuality * 2 - barThreshold);
            bar.style.height = `${12 * heightMultiplier}px`;
        });

        // Update signal strength indicator class
        if (this.signalQuality < 0.3) {
            this.signalStrengthContainer.classList.add('very-weak');
            this.signalStrengthContainer.classList.remove('weak');
        } else if (this.signalQuality < 0.6) {
            this.signalStrengthContainer.classList.add('weak');
            this.signalStrengthContainer.classList.remove('very-weak');
        } else {
            this.signalStrengthContainer.classList.remove('weak', 'very-weak');
        }
    }

    startGlitchCycle() {
        const startGlitch = () => {
            this.isGlitching = true;
            this.glitchIntensity = Math.random() * 0.7 + 0.3; // Random intensity between 0.3 and 1.0
            this.jumpCount = 0;
            this.maxJumps = Math.floor(Math.random() * 20) + 30; // Random number of jumps between 30-50
            
            // Glitch for 3-5 seconds
            const glitchDuration = 3000 + Math.random() * 2000;
            
            this.glitchTimeout = setTimeout(() => {
                this.isGlitching = false;
                
                // Wait 2-6 seconds before next glitch
                const waitDuration = 2000 + Math.random() * 4000;
                this.glitchTimeout = setTimeout(startGlitch, waitDuration);
            }, glitchDuration);
        };
        
        // Start first glitch after 1-2 seconds
        this.glitchTimeout = setTimeout(startGlitch, 1000 + Math.random() * 1000);
    }

    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.glitchTimeout) {
            clearTimeout(this.glitchTimeout);
        }
        if (this.styleSheet) {
            document.head.removeChild(this.styleSheet);
        }
    }
} 