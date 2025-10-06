// 3D Card Visualization using Three.js
// This module provides 3D card rendering capabilities

class Card3DViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.card = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);
        
        // Create camera
        const width = this.container.clientWidth;
        const height = this.container.clientHeight || 300;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.container.appendChild(this.renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        // Create card
        this.createCard();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation
        this.animate();
    }
    
    createCard() {
        // Card dimensions (standard tarot card proportions)
        const width = 2.5;
        const height = 4.25;
        const depth = 0.05;
        
        // Create card geometry
        const geometry = new THREE.BoxGeometry(width, height, depth);
        
        // Create materials for front and back
        const materials = [
            // Side materials (edges)
            new THREE.MeshPhongMaterial({ color: 0x8b4513 }), // right
            new THREE.MeshPhongMaterial({ color: 0x8b4513 }), // left
            new THREE.MeshPhongMaterial({ color: 0x8b4513 }), // top
            new THREE.MeshPhongMaterial({ color: 0x8b4513 }), // bottom
            // Front (card face)
            new THREE.MeshPhongMaterial({ 
                color: 0xf5f5f5,
                emissive: 0x222222,
                shininess: 30
            }),
            // Back (card back design)
            new THREE.MeshPhongMaterial({ 
                color: 0x4a0e0e,
                emissive: 0x111111,
                shininess: 30
            })
        ];
        
        // Create mesh
        this.card = new THREE.Mesh(geometry, materials);
        this.scene.add(this.card);
        
        // Add border/frame effect
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(
            edges, 
            new THREE.LineBasicMaterial({ color: 0xdaa520, linewidth: 2 })
        );
        this.card.add(line);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Rotate card
        if (this.card) {
            this.card.rotation.y += 0.01;
            this.card.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight || 300;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container.contains(this.renderer.domElement)) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
        
        if (this.card) {
            this.card.geometry.dispose();
            if (Array.isArray(this.card.material)) {
                this.card.material.forEach(mat => mat.dispose());
            } else {
                this.card.material.dispose();
            }
        }
    }
    
    // Update card appearance based on tarot card data
    updateCard(cardData) {
        if (!this.card) return;
        
        // Could add text, images, or symbols to the card face
        // This would require texture mapping
        console.log('Card updated:', cardData.name);
    }
    
    // Control card rotation speed
    setRotationSpeed(speed) {
        this.rotationSpeed = speed;
    }
    
    // Flip card animation
    flipCard() {
        if (!this.card) return;
        
        const startRotation = this.card.rotation.y;
        const endRotation = startRotation + Math.PI;
        const duration = 1000; // ms
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-in-out function
            const eased = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            this.card.rotation.y = startRotation + (endRotation - startRotation) * eased;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Card3DViewer;
}
