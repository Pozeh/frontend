/* EcoLoop Kenya - Futuristic Animation System - JavaScript */
/* Lightweight, Performance-Optimized Animations with Automatic Method Selection */

class FuturisticAnimationSystem {
    constructor(options = {}) {
        this.options = {
            performanceMode: 'balanced', // low, balanced, high
            enableParticles: true,
            enableCanvas: true,
            enableSVG: true,
            enableCSS: true,
            maxParticles: 30,
            animationSpeed: 1.0,
            ...options
        };
        
        this.containers = new Map();
        this.animations = new Map();
        this.performance = this.detectPerformance();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    // Automatic performance detection
    detectPerformance() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        // Check WebGL support
        const hasWebGL = !!gl;
        
        // Check device memory (if available)
        const memory = navigator.deviceMemory || 4;
        
        // Check hardware concurrency
        const cores = navigator.hardwareConcurrency || 4;
        
        // Check screen size
        const pixelRatio = window.devicePixelRatio || 1;
        const screenSize = window.innerWidth * window.innerHeight * pixelRatio;
        
        // Determine performance tier
        if (memory >= 8 && cores >= 8 && screenSize >= 1920 * 1080 && hasWebGL) {
            return 'high';
        } else if (memory >= 4 && cores >= 4 && screenSize >= 1280 * 720) {
            return 'balanced';
        } else {
            return 'low';
        }
    }
    
    init() {
        // Apply performance settings
        this.options.performanceMode = this.performance;
        
        // Setup global animation controller
        this.setupGlobalController();
        
        // Setup scroll performance optimization
        this.setupScrollOptimization();
        
        // Initialize all animation containers
        this.initializeContainers();
        
        // Start animation loop
        this.startAnimationLoop();
    }
    
    setupScrollOptimization() {
        // Optimize animations during scroll for smooth performance
        let isScrolling = false;
        let scrollTimeout;
        
        const handleScroll = () => {
            if (!isScrolling) {
                // Reduce animation intensity during scroll
                document.querySelectorAll('.futuristic-particles, .futuristic-geometric, .futuristic-waves').forEach(el => {
                    el.style.animationPlayState = 'paused';
                    el.style.opacity = '0.3';
                });
                
                isScrolling = true;
            }
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Resume animations after scroll ends
                document.querySelectorAll('.futuristic-particles, .futuristic-geometric, .futuristic-waves').forEach(el => {
                    el.style.animationPlayState = 'running';
                    el.style.opacity = '';
                });
                
                isScrolling = false;
            }, 150);
        };
        
        // Throttled scroll handler for performance
        let ticking = false;
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
                setTimeout(() => { ticking = false; }, 100);
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    setupGlobalController() {
        // Create global animation controller
        this.controller = {
            fps: 60,
            frameCount: 0,
            lastTime: performance.now(),
            deltaTime: 0,
            
            update: (currentTime) => {
                this.controller.frameCount++;
                this.controller.deltaTime = currentTime - this.controller.lastTime;
                this.controller.fps = Math.round(1000 / this.controller.deltaTime);
                this.controller.lastTime = currentTime;
            }
        };
    }
    
    initializeContainers() {
        // Find all containers with futuristic classes
        const containers = document.querySelectorAll('.futuristic-container, .futuristic-header, .futuristic-welcome, .futuristic-product, .futuristic-modal, .futuristic-footer');
        
        containers.forEach(container => {
            this.setupContainer(container);
        });
    }
    
    setupContainer(container) {
        const id = container.id || `futuristic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        container.id = id;
        
        const containerType = this.detectContainerType(container);
        const animationMethod = this.selectAnimationMethod(containerType);
        
        this.containers.set(id, {
            element: container,
            type: containerType,
            method: animationMethod,
            animations: []
        });
        
        // Initialize animation based on method
        this.initializeAnimation(id, animationMethod);
    }
    
    detectContainerType(container) {
        if (container.classList.contains('futuristic-header')) return 'header';
        if (container.classList.contains('futuristic-welcome')) return 'welcome';
        if (container.classList.contains('futuristic-product')) return 'product';
        if (container.classList.contains('futuristic-modal')) return 'modal';
        if (container.classList.contains('futuristic-footer')) return 'footer';
        return 'general';
    }
    
    selectAnimationMethod(containerType) {
        if (this.isReducedMotion) return 'css';
        
        const methods = {
            header: this.performance === 'high' ? 'canvas' : 'css',
            welcome: this.performance === 'high' ? 'canvas' : 'svg',
            product: 'css',
            modal: 'css',
            footer: 'css',
            general: this.performance === 'low' ? 'css' : 'svg'
        };
        
        return methods[containerType] || 'css';
    }
    
    initializeAnimation(containerId, method) {
        const container = this.containers.get(containerId);
        if (!container) return;
        
        switch (method) {
            case 'canvas':
                this.initCanvasAnimation(containerId);
                break;
            case 'svg':
                this.initSVGAnimation(containerId);
                break;
            case 'css':
                this.initCSSAnimation(containerId);
                break;
        }
    }
    
    // Canvas Animation System
    initCanvasAnimation(containerId) {
        const container = this.containers.get(containerId);
        const element = container.element;
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.className = 'futuristic-canvas';
        
        // Set canvas size
        const rect = element.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Add to container
        element.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Create animation based on container type
        let animation;
        switch (container.type) {
            case 'header':
                animation = new HeaderCanvasAnimation(canvas, ctx, this.options);
                break;
            case 'welcome':
                animation = new WelcomeCanvasAnimation(canvas, ctx, this.options);
                break;
            default:
                animation = new ParticleCanvasAnimation(canvas, ctx, this.options);
        }
        
        container.animations.push(animation);
        this.animations.set(`${containerId}-canvas`, animation);
    }
    
    // SVG Animation System
    initSVGAnimation(containerId) {
        const container = this.containers.get(containerId);
        const element = container.element;
        
        // Create SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.className = 'futuristic-svg';
        
        // Set SVG size
        const rect = element.getBoundingClientRect();
        svg.setAttribute('width', rect.width);
        svg.setAttribute('height', rect.height);
        svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
        
        // Add to container
        element.appendChild(svg);
        
        // Create animation based on container type
        let animation;
        switch (container.type) {
            case 'welcome':
                animation = new WelcomeSVGAnimation(svg, this.options);
                break;
            default:
                animation = new GeometricSVGAnimation(svg, this.options);
        }
        
        container.animations.push(animation);
        this.animations.set(`${containerId}-svg`, animation);
    }
    
    // CSS Animation System
    initCSSAnimation(containerId) {
        const container = this.containers.get(containerId);
        const element = container.element;
        
        // Add CSS classes
        element.classList.add('futuristic-container');
        
        // Create particles if enabled
        if (this.options.enableParticles && this.options.performanceMode !== 'low') {
            this.createCSSParticles(element);
        }
        
        // Create geometric patterns
        this.createCSSGeometric(element);
        
        // Create waves
        this.createCSSWaves(element);
        
        // Create glow effect
        this.createCSSGlow(element);
        
        // Create grid
        this.createCSSGrid(element);
    }
    
    createCSSParticles(element) {
        const container = document.createElement('div');
        container.className = 'futuristic-particles';
        
        // Minimal particles for footer to ensure smooth performance
        let particleCount = this.options.maxParticles;
        if (element.classList.contains('futuristic-footer')) {
            particleCount = Math.min(particleCount, 8); // Very few particles for footer
        }
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position within bounds
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Small size for footer particles
            let size = Math.random() * 4 + 2;
            if (element.classList.contains('futuristic-footer')) {
                size = Math.random() * 2 + 1; // Very small for footer
            }
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Staggered animation delays for smooth performance
            particle.style.animationDelay = `${Math.random() * 6}s`;
            
            container.appendChild(particle);
        }
        
        element.appendChild(container);
    }
    
    createCSSGeometric(element) {
        const geometric = document.createElement('div');
        geometric.className = 'futuristic-geometric';
        element.appendChild(geometric);
    }
    
    createCSSWaves(element) {
        const waves = document.createElement('div');
        waves.className = 'futuristic-waves';
        
        // Create only 3 thin horizontal lines for footer
        let waveCount = 2;
        if (element.classList.contains('futuristic-footer')) {
            waveCount = 3; // Exactly 3 thin lines for footer
        }
        
        for (let i = 0; i < waveCount; i++) {
            const wave = document.createElement('div');
            wave.className = 'wave';
            wave.style.animationDelay = `${i * 1}s`; // Staggered delays
            waves.appendChild(wave);
        }
        
        element.appendChild(waves);
    }
    
    createCSSGlow(element) {
        const glow = document.createElement('div');
        glow.className = 'futuristic-glow';
        element.appendChild(glow);
    }
    
    createCSSGrid(element) {
        const grid = document.createElement('div');
        grid.className = 'futuristic-grid';
        element.appendChild(grid);
    }
    
    startAnimationLoop() {
        const animate = (currentTime) => {
            this.controller.update(currentTime);
            
            // Update all animations
            this.animations.forEach(animation => {
                if (animation.update) {
                    animation.update(this.controller);
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
    
    // Public API
    addContainer(element) {
        this.setupContainer(element);
    }
    
    removeContainer(containerId) {
        const container = this.containers.get(containerId);
        if (container) {
            // Clean up animations
            container.animations.forEach(animation => {
                if (animation.destroy) {
                    animation.destroy();
                }
            });
            
            // Remove from maps
            this.containers.delete(containerId);
            this.animations.delete(`${containerId}-canvas`);
            this.animations.delete(`${containerId}-svg`);
        }
    }
    
    updatePerformance(mode) {
        this.options.performanceMode = mode;
        this.performance = mode;
        
        // Reinitialize all containers with new performance settings
        this.containers.forEach((container, id) => {
            this.removeContainer(id);
            this.setupContainer(container.element);
        });
    }
    
    destroy() {
        // Clean up all animations
        this.animations.forEach(animation => {
            if (animation.destroy) {
                animation.destroy();
            }
        });
        
        this.containers.clear();
        this.animations.clear();
    }
}

// Canvas Animation Classes
class ParticleCanvasAnimation {
    constructor(canvas, ctx, options) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.options = options;
        this.particles = [];
        this.init();
    }
    
    init() {
        const particleCount = this.options.maxParticles || 30;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                color: this.getRandomColor(),
                opacity: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    getRandomColor() {
        const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ced1', '#9400d3'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(controller) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    destroy() {
        this.particles = [];
    }
}

class HeaderCanvasAnimation extends ParticleCanvasAnimation {
    update(controller) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create flowing lines for header
        const time = controller.frameCount * 0.01;
        
        for (let i = 0; i < 5; i++) {
            this.ctx.strokeStyle = this.getRandomColor();
            this.ctx.globalAlpha = 0.3;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            
            for (let x = 0; x < this.canvas.width; x += 10) {
                const y = this.canvas.height / 2 + Math.sin(x * 0.01 + time + i) * 20;
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }
}

class WelcomeCanvasAnimation extends ParticleCanvasAnimation {
    update(controller) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const time = controller.frameCount * 0.01;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Create radial pulse effect
        for (let i = 0; i < 3; i++) {
            const radius = (time * 50 + i * 100) % 300;
            const opacity = Math.max(0, 1 - radius / 300);
            
            this.ctx.strokeStyle = this.getRandomColor();
            this.ctx.globalAlpha = opacity * 0.3;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }
}

// SVG Animation Classes
class GeometricSVGAnimation {
    constructor(svg, options) {
        this.svg = svg;
        this.options = options;
        this.shapes = [];
        this.init();
    }
    
    init() {
        // Create geometric shapes
        for (let i = 0; i < 10; i++) {
            const shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            const points = this.generatePolygonPoints();
            shape.setAttribute('points', points);
            shape.setAttribute('fill', 'none');
            shape.setAttribute('stroke', this.getRandomColor());
            shape.setAttribute('stroke-width', '1');
            shape.setAttribute('opacity', '0.3');
            
            // Add animation
            const animateTransform = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
            animateTransform.setAttribute('attributeName', 'transform');
            animateTransform.setAttribute('type', 'rotate');
            animateTransform.setAttribute('from', '0 50 50');
            animateTransform.setAttribute('to', '360 50 50');
            animateTransform.setAttribute('dur', `${10 + Math.random() * 10}s`);
            animateTransform.setAttribute('repeatCount', 'indefinite');
            
            shape.appendChild(animateTransform);
            this.svg.appendChild(shape);
            this.shapes.push(shape);
        }
    }
    
    generatePolygonPoints() {
        const points = [];
        const sides = Math.floor(Math.random() * 4) + 3;
        const radius = Math.random() * 30 + 10;
        
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            points.push(`${x},${y}`);
        }
        
        return points.join(' ');
    }
    
    getRandomColor() {
        const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ced1', '#9400d3'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    destroy() {
        this.shapes.forEach(shape => {
            if (shape.parentNode) {
                shape.parentNode.removeChild(shape);
            }
        });
        this.shapes = [];
    }
}

class WelcomeSVGAnimation extends GeometricSVGAnimation {
    init() {
        // Create special welcome animation with concentric circles
        for (let i = 0; i < 5; i++) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '50');
            circle.setAttribute('cy', '50');
            circle.setAttribute('r', 10 + i * 15);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', this.getRandomColor());
            circle.setAttribute('stroke-width', '1');
            circle.setAttribute('opacity', '0.2');
            
            // Add pulse animation
            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animate.setAttribute('attributeName', 'r');
            animate.setAttribute('values', `${10 + i * 15};${20 + i * 15};${10 + i * 15}`);
            animate.setAttribute('dur', `${3 + i}s`);
            animate.setAttribute('repeatCount', 'indefinite');
            
            circle.appendChild(animate);
            this.svg.appendChild(circle);
            this.shapes.push(circle);
        }
    }
}

// Initialize the animation system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if animation system should be enabled
    const enableAnimations = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (enableAnimations) {
        window.futuristicAnimations = new FuturisticAnimationSystem({
            performanceMode: 'balanced',
            enableParticles: true,
            enableCanvas: true,
            enableSVG: true,
            enableCSS: true,
            maxParticles: 25,
            animationSpeed: 1.0
        });
    }
});

// Export for global access
window.FuturisticAnimationSystem = FuturisticAnimationSystem;
