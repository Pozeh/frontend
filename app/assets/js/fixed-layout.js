/* ========================================
   FIXED LAYOUT HELPER JAVASCRIPT
   ========================================
   Automatically wraps middle content for fixed header/footer layout
   Preserves all functionality and animations
   ======================================== */

class FixedLayoutHelper {
    constructor() {
        this.init();
    }
    
    init() {
        // Only apply on mobile view
        if (window.innerWidth <= 768) {
            this.setupFixedLayout();
            this.handleResize();
            this.handleOrientationChange();
        }
    }
    
    setupFixedLayout() {
        // Create scrollable wrapper for middle content
        this.createScrollableWrapper();
        
        // Move all content between header and footer to wrapper
        this.moveContentToWrapper();
        
        // Add proper spacing and positioning
        this.adjustBodySpacing();
        
        // Preserve all animations
        this.preserveAnimations();
        
        // Ensure footer has compact structure
        this.setupCompactFooter();
    }
    
    createScrollableWrapper() {
        // Check if wrapper already exists
        if (document.querySelector('.mobile-scrollable-content')) {
            return;
        }
        
        // Create scrollable wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'mobile-scrollable-content';
        wrapper.setAttribute('data-fixed-layout', 'true');
        
        // Insert after header
        const header = document.querySelector('.mobile-header, header, .header');
        if (header) {
            header.insertAdjacentElement('afterend', wrapper);
        } else {
            // Fallback: insert at beginning of body
            document.body.insertBefore(wrapper, document.body.firstChild);
        }
    }
    
    moveContentToWrapper() {
        const wrapper = document.querySelector('.mobile-scrollable-content');
        if (!wrapper) return;
        
        const header = document.querySelector('.mobile-header, header, .header');
        const footer = document.querySelector('.mobile-footer, footer, .footer');
        
        // Get all elements that should be in the scrollable area
        const allElements = document.body.children;
        const elementsToMove = [];
        
        for (let element of allElements) {
            // Skip if it's the wrapper itself
            if (element === wrapper) continue;
            
            // Skip if it's the header
            if (header && (element === header || header.contains(element))) continue;
            
            // Skip if it's the footer
            if (footer && (element === footer || footer.contains(element))) continue;
            
            // Skip scripts and meta tags
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE' || element.tagName === 'META' || element.tagName === 'LINK') continue;
            
            elementsToMove.push(element);
        }
        
        // Move elements to wrapper
        elementsToMove.forEach(element => {
            wrapper.appendChild(element);
        });
    }
    
    adjustBodySpacing() {
        // Ensure body has proper spacing for fixed header/footer
        const header = document.querySelector('.mobile-header, header, .header');
        const footer = document.querySelector('.mobile-footer, footer, .footer');
        
        if (header && footer) {
            const headerHeight = header.offsetHeight || 50;
            const footerHeight = footer.offsetHeight || 30;
            
            document.body.style.paddingTop = headerHeight + 'px';
            document.body.style.paddingBottom = footerHeight + 'px';
            document.body.style.height = '100vh';
            document.body.style.overflow = 'hidden';
        }
    }
    
    preserveAnimations() {
        // Ensure all animations remain functional
        const animatedElements = document.querySelectorAll('[class*="animated"], [class*="futuristic"], [class*="particle"], canvas');
        
        animatedElements.forEach(element => {
            // Ensure animations stay within their containers
            if (element.parentElement) {
                element.parentElement.style.position = 'relative';
                element.parentElement.style.overflow = 'hidden';
            }
            
            // Preserve animation classes and styles
            element.style.pointerEvents = 'none';
            element.style.zIndex = '0';
        });
    }
    
    setupCompactFooter() {
        const footer = document.querySelector('.mobile-footer, footer, .footer');
        if (!footer) return;
        
        // Add data-section attributes for compact footer icons
        const footerSections = footer.querySelectorAll('.mobile-footer-section, .footer-section');
        
        footerSections.forEach((section, index) => {
            if (!section.getAttribute('data-section')) {
                const sectionNames = ['home', 'categories', 'account', 'contact'];
                section.setAttribute('data-section', sectionNames[index] || 'section-' + index);
            }
        });
        
        // Ensure footer is properly structured
        if (!footer.querySelector('.mobile-footer-content')) {
            const content = footer.querySelector('.footer-content, .mobile-footer-content');
            if (content) {
                content.classList.add('mobile-footer-content');
            }
        }
    }
    
    handleResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth <= 768) {
                    this.setupFixedLayout();
                } else {
                    this.removeFixedLayout();
                }
            }, 250);
        });
    }
    
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.adjustBodySpacing();
            }, 100);
        });
    }
    
    removeFixedLayout() {
        // Remove fixed layout on desktop
        const wrapper = document.querySelector('.mobile-scrollable-content');
        if (wrapper) {
            // Move content back to body
            while (wrapper.firstChild) {
                document.body.appendChild(wrapper.firstChild);
            }
            wrapper.remove();
        }
        
        // Reset body styles
        document.body.style.paddingTop = '';
        document.body.style.paddingBottom = '';
        document.body.style.height = '';
        document.body.style.overflow = '';
    }
    
    // Public method to refresh layout
    refresh() {
        if (window.innerWidth <= 768) {
            this.setupFixedLayout();
        } else {
            this.removeFixedLayout();
        }
    }
    
    // Public method to update footer height
    updateFooterHeight() {
        const footer = document.querySelector('.mobile-footer, footer, .footer');
        if (footer && window.innerWidth <= 768) {
            this.adjustBodySpacing();
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.fixedLayoutHelper = new FixedLayoutHelper();
});

// Handle dynamic content loading
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            // Refresh layout if new content was added
            if (window.fixedLayoutHelper) {
                setTimeout(() => {
                    window.fixedLayoutHelper.refresh();
                }, 100);
            }
        }
    });
});

// Start observing the entire document
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Export for manual control
window.FixedLayoutHelper = FixedLayoutHelper;

export default FixedLayoutHelper;
