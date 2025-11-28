/* ========================================
   FUTURISTIC ANIMATION ENGINE
   ========================================
   Ultra-optimized, lightweight animation system
   Fits perfectly with ultra-compact mobile layout
   ======================================== */

class FuturisticAnimationEngine {
    constructor() {
        this.particles = [];
        this.nodes = [];
        this.beams = [];
        this.isRunning = false;
        this.animationFrame = null;
        this.lastFrameTime = 0;
        this.targetFPS = 30; // Reduced for performance
        this.frameInterval = 1000 / this.targetFPS;
        
        // Initialize animations
        this.init();
    }
    
    init() {
        // Only run on mobile view
        if (window.innerWidth > 768) return;
        
        this.createQuantumField();
        this.createNetworkNodes();
        this.createEnergyBeams();
        this.createCosmicParticles();
        this.createDataStreams();
        this.startAnimation();
    }
    
    /* ========================================
       QUANTUM FIELD ANIMATION
       ======================================== */
    createQuantumField() {
        const welcomePanel = document.querySelector('.mobile-welcome-panel');
        if (!welcomePanel) return;
        
        const container = document.createElement('div');
        container.className = 'futuristic-hero-bg';
        container.innerHTML = `
            <div class="quantum-field"></div>
            <div class="holo-grid"></div>
        `;
        
        const quantumField = container.querySelector('.quantum-field');
        
        // Create quantum particles (minimal count for performance)
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle futuristic-animation';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 4) + 's';
            quantumField.appendChild(particle);
        }
        
        welcomePanel.style.position = 'relative';
        welcomePanel.insertBefore(container, welcomePanel.firstChild);
    }
    
    /* ========================================
       NETWORK NODES FOR DASHBOARDS
       ======================================== */
    createNetworkNodes() {
        const dashboards = document.querySelectorAll('.mobile-seller-dashboard, .mobile-nyumba-section');
        
        dashboards.forEach(dashboard => {
            const container = document.createElement('div');
            container.className = 'futuristic-nyumba-bg';
            
            // Create network nodes
            for (let i = 0; i < 6; i++) {
                const node = document.createElement('div');
                node.className = 'network-node futuristic-animation';
                node.style.left = Math.random() * 90 + '%';
                node.style.top = Math.random() * 90 + '%';
                node.style.animationDelay = Math.random() * 2 + 's';
                container.appendChild(node);
            }
            
            // Create energy beams
            for (let i = 0; i < 3; i++) {
                const beam = document.createElement('div');
                beam.className = 'energy-beam futuristic-animation';
                beam.style.left = Math.random() * 100 + '%';
                beam.style.top = Math.random() * 100 + '%';
                beam.style.animationDelay = Math.random() * 3 + 's';
                container.appendChild(beam);
            }
            
            dashboard.style.position = 'relative';
            dashboard.insertBefore(container, dashboard.firstChild);
        });
    }
    
    /* ========================================
       COSMIC PARTICLES FOR FOOTER
       ======================================== */
    createCosmicParticles() {
        const footer = document.querySelector('.mobile-footer');
        if (!footer) return;
        
        const container = document.createElement('div');
        container.className = 'futuristic-footer-bg';
        
        // Create cosmic particles
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'cosmic-particle futuristic-animation';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 12 + 's';
            particle.style.animationDuration = (8 + Math.random() * 4) + 's';
            container.appendChild(particle);
        }
        
        // Create wave lines
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = 'wave-line futuristic-animation';
            wave.style.top = (20 + i * 15) + 'px';
            wave.style.animationDelay = i * 1.5 + 's';
            container.appendChild(wave);
        }
        
        footer.style.position = 'relative';
        footer.insertBefore(container, footer.firstChild);
    }
    
    /* ========================================
       DATA STREAMS FOR HEADER
       ======================================== */
    createDataStreams() {
        const header = document.querySelector('.mobile-header');
        if (!header) return;
        
        const container = document.createElement('div');
        container.className = 'futuristic-header-bg';
        
        // Create data streams
        for (let i = 0; i < 5; i++) {
            const stream = document.createElement('div');
            stream.className = 'data-stream futuristic-animation';
            stream.style.left = (10 + i * 15) + '%';
            stream.style.animationDelay = Math.random() * 2 + 's';
            stream.style.animationDuration = (1.5 + Math.random() * 1) + 's';
            container.appendChild(stream);
        }
        
        header.style.position = 'relative';
        header.appendChild(container);
    }
    
    /* ========================================
       NEON PULSES FOR BANNERS
       ======================================== */
    createNeonPulses() {
        const banners = document.querySelectorAll('.mobile-shop-banners .mobile-banner');
        
        banners.forEach(banner => {
            const container = document.createElement('div');
            container.className = 'futuristic-banner-bg';
            
            // Create neon pulses
            for (let i = 0; i < 4; i++) {
                const pulse = document.createElement('div');
                pulse.className = 'neon-pulse futuristic-animation';
                pulse.style.left = Math.random() * 90 + '%';
                pulse.style.top = Math.random() * 90 + '%';
                pulse.style.animationDelay = Math.random() * 3 + 's';
                container.appendChild(pulse);
            }
            
            banner.style.position = 'relative';
            banner.insertBefore(container, banner.firstChild);
        });
    }
    
    /* ========================================
       LIGHTWEIGHT CANVAS ANIMATION
       ======================================== */
    createCanvasAnimation(container, type) {
        const canvas = document.createElement('canvas');
        canvas.className = 'futuristic-canvas';
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        const ctx = canvas.getContext('2d');
        
        // Simple particle system
        const particles = [];
        const particleCount = 15; // Minimal for performance
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                // Draw particle with glow
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
                ctx.fill();
                
                // Add glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00ffff';
                ctx.fill();
                ctx.shadowBlur = 0;
            });
            
            // Draw connections between nearby particles
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const distance = Math.sqrt(
                        Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
                    );
                    
                    if (distance < 50) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 * (1 - distance / 50)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
        };
        
        // Throttled animation
        this.particles.push({ canvas, animate });
    }
    
    /* ========================================
       PERFORMANCE-OPTIMIZED ANIMATION LOOP
       ======================================== */
    startAnimation() {
        const animate = (currentTime) => {
            if (!this.isRunning) return;
            
            // Throttle to target FPS
            if (currentTime - this.lastFrameTime < this.frameInterval) {
                this.animationFrame = requestAnimationFrame(animate);
                return;
            }
            
            this.lastFrameTime = currentTime;
            
            // Animate canvas elements
            this.particles.forEach(({ canvas, animate }) => {
                if (canvas.parentElement) {
                    animate();
                }
            });
            
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        this.isRunning = true;
        this.animationFrame = requestAnimationFrame(animate);
    }
    
    /* ========================================
       CLEANUP AND OPTIMIZATION
       ======================================== */
    stopAnimation() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    // Handle visibility changes for performance
    handleVisibilityChange() {
        if (document.hidden) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    }
    
    // Handle resize events
    handleResize() {
        // Recreate canvas animations on resize
        this.particles.forEach(({ canvas }) => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
            }
        });
    }
}

/* ========================================
   INITIALIZATION AND EVENT HANDLERS
   ======================================== */

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on mobile view
    if (window.innerWidth <= 768) {
        const animationEngine = new FuturisticAnimationEngine();
        
        // Handle visibility changes for performance
        document.addEventListener('visibilitychange', () => {
            animationEngine.handleVisibilityChange();
        });
        
        // Handle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                animationEngine.handleResize();
            }, 250);
        });
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            animationEngine.stopAnimation();
        });
    }
});

// Handle dynamic content loading
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // Check if new animated sections were added
                    if (node.classList && node.classList.contains('mobile-welcome-panel')) {
                        // Reinitialize animations for new content
                        if (window.innerWidth <= 768) {
                            setTimeout(() => {
                                const engine = new FuturisticAnimationEngine();
                            }, 100);
                        }
                    }
                }
            });
        }
    });
});

// Start observing the entire document
observer.observe(document.body, {
    childList: true,
    subtree: true
});

/* ========================================
   FALLBACK FOR LOW-END DEVICES
   ======================================== */

// Disable animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    // Reduce animation complexity
    document.documentElement.style.setProperty('--target-fps', '15');
}

// Disable animations on battery saver mode
if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
        if (battery.level < 0.2) {
            // Disable heavy animations
            document.querySelectorAll('.futuristic-animation').forEach(el => {
                el.style.animation = 'none';
                el.style.opacity = '0.3';
            });
        }
    });
}

export default FuturisticAnimationEngine;
