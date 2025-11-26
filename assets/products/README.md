# Ecoloop Product Layer Documentation

## Overview
The Ecoloop Product Layer is an independent, GPU-friendly animated overlay that displays bouncing electronic products within the futuristic welcome panel. It's designed to be additive and non-destructive, meaning it doesn't modify any existing animations or styling.

## Files Structure
```
assets/
├── css/
│   └── productLayer.css          # Styling for the product layer
├── js/
│   └── productLayer.js           # Main animation module
└── products/
    ├── README.md                 # This documentation
    └── manifest.json             # Product configuration (when available)
```

## Features
- **GPU-accelerated canvas rendering** for smooth performance
- **Physics-based animations** with gravity, bounce, and rotation
- **Product swapping** on bottom collision with visual effects
- **Responsive design** - adjusts item count by screen size
- **Accessibility support** - respects prefers-reduced-motion
- **Performance optimized** with intersection observer and image caching
- **Non-destructive integration** - doesn't modify existing animations

## Configuration

### Item Count by Screen Size
- **Desktop**: 8 items
- **Tablet**: 5 items  
- **Mobile**: 3 items

### Physics Settings
```javascript
physics: {
    gravity: 0.35,      // Gravity strength (0.1 - 1.0)
    restitution: 0.78,  // Bounce intensity (0.5 - 1.0)
    friction: 0.98     // Horizontal friction (0.9 - 1.0)
}
```

### Rotation Settings
```javascript
rotation: {
    min: -0.02,  // Minimum rotation speed
    max: 0.02    // Maximum rotation speed
}
```

## How to Adjust Physics

### Gravity
Lower gravity = slower, more floaty movement
Higher gravity = faster, more realistic falling

```javascript
// Example: Make items float more
window.ecoloopProductLayer.updateConfig({
    physics: { gravity: 0.15 }
});

// Example: Make items fall faster
window.ecoloopProductLayer.updateConfig({
    physics: { gravity: 0.6 }
});
```

### Bounce Intensity
Lower restitution = less bouncy, more energy loss
Higher restitution = more bouncy, more energy retained

```javascript
// Example: Less bouncy
window.ecoloopProductLayer.updateConfig({
    physics: { restitution: 0.5 }
});

// Example: Super bouncy
window.ecoloopProductLayer.updateConfig({
    physics: { restitution: 0.9 }
});
```

### Item Count
Adjust the number of simultaneous items based on performance needs:

```javascript
// Example: Reduce items for better performance
window.ecoloopProductLayer.updateConfig({
    maxItems: 4
});

// Example: Increase items for more visual impact
window.ecoloopProductLayer.updateConfig({
    maxItems: 12
});
```

## Product Images

### Current Setup
The system uses embedded base64 placeholder images with emoji icons. To replace with real product images:

1. Create WebP images (80x80px recommended)
2. Save to `assets/products/` folder
3. Update the product data in `productLayer.js`

### Image Naming Convention
- `product-01.webp` - Smartphone
- `product-02.webp` - Wireless earbuds
- `product-03.webp` - Laptop computer
- `product-04.webp` - Smartwatch
- `product-05.webp` - Digital camera
- `product-06.webp` - Bluetooth speaker
- `product-07.webp` - Tablet device
- `product-08.webp` - Gaming headset
- `product-09.webp` - Fitness tracker
- `product-10.webp` - Portable charger
- `product-11.webp` - Smart home hub
- `product-12.webp` - Wireless mouse

### Regenerating Images
To regenerate the product images:
1. Create new WebP images with transparent backgrounds
2. Apply neon rim lighting to match the futuristic aesthetic
3. Maintain consistent color temperature with the background
4. Replace the base64 data in the `products` array in `productLayer.js`

## Accessibility

### Reduced Motion Support
The layer automatically detects `prefers-reduced-motion: reduce` and:
- Reduces animation intensity
- Lowers item count
- Simplifies physics

### Manual Disable
To completely disable the layer:

```javascript
// Destroy the layer
window.ecoloopProductLayer.destroy();
```

Or add this CSS:
```css
@media (prefers-reduced-motion: reduce) {
    #ecoloopProductLayer {
        display: none;
    }
}
```

## Performance

### Optimization Features
- **Intersection Observer**: Pauses animation when panel is off-screen
- **Image Caching**: Preloads all product images
- **Canvas Hardware Acceleration**: Uses GPU for rendering
- **Frame Rate Limiting**: Caps at 60fps with delta time
- **Responsive Scaling**: Reduces items on smaller screens

### Performance Monitoring
Check performance metrics:

```javascript
const metrics = window.ecoloopProductLayer.getMetrics();
console.log('Product Layer Metrics:', metrics);
```

### Low-End Device Detection
The system automatically reduces complexity on devices with:
- Low hardware concurrency
- Limited device memory
- Small screen sizes

## Removal

### Complete Removal
To remove the product layer entirely:

1. **Remove HTML element** from `index.html`:
```html
<!-- Remove this line -->
<canvas id="ecoloopProductLayer" aria-hidden="true"></canvas>
```

2. **Remove CSS link** from `index.html`:
```html
<!-- Remove this line -->
<link rel="stylesheet" href="assets/css/productLayer.css">
```

3. **Remove JS link** from `index.html`:
```html
<!-- Remove this line -->
<script src="assets/js/productLayer.js"></script>
```

4. **Delete asset files**:
- `assets/css/productLayer.css`
- `assets/js/productLayer.js`
- `assets/products/` folder

### Temporary Disable
To temporarily disable without removing files:

```javascript
// Pause animation
window.ecoloopProductLayer.pause();

// Hide visually
document.getElementById('ecoloopProductLayer').style.display = 'none';
```

## Troubleshooting

### Common Issues

**Canvas not appearing**
- Check that container has `position: relative`
- Verify canvas ID matches `welcome-panel`
- Check browser console for errors

**Performance issues**
- Reduce `maxItems` in config
- Check device hardware capabilities
- Ensure images are optimized (WebP format)

**Products not swapping**
- Verify `restitution` is > 0.5
- Check that `swapCooldown` isn't too high
- Ensure boundary detection is working

**Accessibility concerns**
- Test with `prefers-reduced-motion: reduce`
- Verify keyboard navigation isn't blocked
- Check screen reader compatibility

## Browser Support

**Modern Browsers** (Full Support)
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

**Fallback Support**
- Older browsers show static fallback icon
- Canvas not supported → displays emoji fallback
- JavaScript disabled → no impact on core functionality

## Development

### Customization
The layer is designed to be easily customizable:
- Modify physics constants in constructor options
- Add new products to the `products` array
- Adjust visual effects in the CSS file
- Extend with custom animations in the draw loop

### API Reference
```javascript
// Initialize manually
const layer = new EcoloopProductLayer({
    maxItems: 6,
    physics: { gravity: 0.3 }
});

// Control methods
layer.start();           // Start animation
layer.pause();           // Pause animation
layer.destroy();         // Cleanup and remove
layer.updateConfig({});   // Update settings
layer.getMetrics();      // Get performance data
```

## License
This product layer is part of the EcoLoop Kenya project and follows the same licensing terms as the main application.
