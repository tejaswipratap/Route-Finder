/**
 * Custom Interactive HTML5 Canvas Graph Visualizer Engine (Built from scratch)
 * 
 * Features:
 * - High-DPI canvas rendering (retina support)
 * - Draggable nodes (mouse / touch)
 * - Pan and Zoom canvas controls
 * - Node and Edge highlighting & pulse animations
 * - Dynamic edge weight badge rendering
 * - Theme responsive (Dark & Light modes)
 */

class GraphCanvas {
    constructor(canvasElement, graph) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.graph = graph;

        // Viewport transform (Pan & Zoom)
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;

        // Mouse Interaction State
        this.isPanning = false;
        this.isDraggingNode = false;
        this.draggedNode = null;
        this.selectedNode = null;
        this.hoveredNode = null;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        // Highlight Animation State
        this.highlightedNodes = new Set();
        this.highlightedEdges = new Set(); // Set of "Source-Dest" strings
        this.activeNode = null;
        this.pathEdges = []; // Array of { source, destination } in shortest path
        this.animPhase = 0;

        // Render Style Parameters
        this.nodeRadius = 24;
        this.theme = 'dark'; // 'dark' or 'light'

        this._setupCanvas();
        this._bindEvents();
        this._startAnimationLoop();
    }

    /**
     * Handle high-DPI scaling & resize
     */
    _setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.width = rect.width;
        this.height = rect.height;
    }

    /**
     * Bind Mouse & Wheel listeners
     */
    _bindEvents() {
        window.addEventListener('resize', () => this._setupCanvas());

        this.canvas.addEventListener('mousedown', (e) => this._onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this._onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this._onMouseUp());
        this.canvas.addEventListener('mouseleave', () => this._onMouseUp());
        this.canvas.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });
    }

    /**
     * Transform Screen Coordinates to Canvas World Coordinates
     */
    screenToWorld(screenX, screenY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (screenX - rect.left - this.offsetX) / this.scale;
        const y = (screenY - rect.top - this.offsetY) / this.scale;
        return { x, y };
    }

    /**
     * Find node under mouse pointer
     */
    _findNodeAt(worldX, worldY) {
        for (let [name, details] of this.graph.nodes.entries()) {
            const dx = worldX - details.posX;
            const dy = worldY - details.posY;
            if (dx * dx + dy * dy <= this.nodeRadius * this.nodeRadius) {
                return name;
            }
        }
        return null;
    }

    _onMouseDown(e) {
        const { x, y } = this.screenToWorld(e.clientX, e.clientY);
        const hitNode = this._findNodeAt(x, y);

        if (hitNode) {
            this.isDraggingNode = true;
            this.draggedNode = hitNode;
            this.selectedNode = hitNode;
            if (this.onNodeSelect) this.onNodeSelect(hitNode);
        } else {
            this.isPanning = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        }
    }

    _onMouseMove(e) {
        const { x, y } = this.screenToWorld(e.clientX, e.clientY);
        this.hoveredNode = this._findNodeAt(x, y);
        this.canvas.style.cursor = this.hoveredNode ? 'pointer' : (this.isPanning ? 'grabbing' : 'default');

        if (this.isDraggingNode && this.draggedNode) {
            const nodeDetails = this.graph.nodes.get(this.draggedNode);
            if (nodeDetails) {
                nodeDetails.posX = x;
                nodeDetails.posY = y;
            }
        } else if (this.isPanning) {
            const dx = e.clientX - this.lastMouseX;
            const dy = e.clientY - this.lastMouseY;
            this.offsetX += dx;
            this.offsetY += dy;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        }
    }

    _onMouseUp() {
        this.isDraggingNode = false;
        this.draggedNode = null;
        this.isPanning = false;
    }

    _onWheel(e) {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const newScale = Math.max(0.3, Math.min(3.0, this.scale * zoomFactor));

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.offsetX = mouseX - (mouseX - this.offsetX) * (newScale / this.scale);
        this.offsetY = mouseY - (mouseY - this.offsetY) * (newScale / this.scale);
        this.scale = newScale;
    }

    setTheme(theme) {
        this.theme = theme;
    }

    setHighlights(activeNode = null, highlightedNodes = [], activeEdge = null, path = []) {
        this.activeNode = activeNode;
        this.highlightedNodes = new Set(highlightedNodes);
        this.highlightedEdges.clear();
        
        if (activeEdge) {
            this.highlightedEdges.add(`${activeEdge.source}->${activeEdge.target}`);
            this.highlightedEdges.add(`${activeEdge.target}->${activeEdge.source}`);
        }

        this.pathEdges = [];
        if (path && path.length > 1) {
            for (let i = 0; i < path.length - 1; i++) {
                this.pathEdges.push({ source: path[i], destination: path[i + 1] });
                this.highlightedEdges.add(`${path[i]}->${path[i + 1]}`);
                this.highlightedEdges.add(`${path[i + 1]}->${path[i]}`);
            }
        }
    }

    resetHighlights() {
        this.activeNode = null;
        this.highlightedNodes.clear();
        this.highlightedEdges.clear();
        this.pathEdges = [];
    }

    /**
     * Auto-center graph inside canvas bounds
     */
    fitToView() {
        const vertices = this.graph.getVertices();
        if (vertices.length === 0) return;

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (let name of vertices) {
            const details = this.graph.nodes.get(name);
            if (details) {
                minX = Math.min(minX, details.posX);
                maxX = Math.max(maxX, details.posX);
                minY = Math.min(minY, details.posY);
                maxY = Math.max(maxY, details.posY);
            }
        }

        const graphWidth = maxX - minX || 1;
        const graphHeight = maxY - minY || 1;
        const padding = 80;

        const scaleX = (this.width - padding * 2) / graphWidth;
        const scaleY = (this.height - padding * 2) / graphHeight;
        this.scale = Math.max(0.4, Math.min(1.2, Math.min(scaleX, scaleY)));

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        this.offsetX = this.width / 2 - centerX * this.scale;
        this.offsetY = this.height / 2 - centerY * this.scale;
    }

    _startAnimationLoop() {
        const render = () => {
            this.animPhase = (this.animPhase + 0.05) % (Math.PI * 2);
            this.draw();
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }

    /**
     * Main Render Loop
     */
    draw() {
        const isDark = this.theme === 'dark';
        const ctx = this.ctx;

        // Clear Background
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.restore();

        ctx.save();
        ctx.translate(this.offsetX, this.offsetY);
        ctx.scale(this.scale, this.scale);

        const edges = this.graph.getAllEdges();

        // 1. Draw Edges
        for (let edge of edges) {
            const sourceNode = this.graph.nodes.get(edge.source);
            const destNode = this.graph.nodes.get(edge.destination);

            if (!sourceNode || !destNode) continue;

            const isHighlighted = this.highlightedEdges.has(`${edge.source}->${edge.destination}`);
            const isPath = this.pathEdges.some(p => 
                (p.source === edge.source && p.destination === edge.destination) ||
                (p.source === edge.destination && p.destination === edge.source)
            );

            ctx.beginPath();
            ctx.moveTo(sourceNode.posX, sourceNode.posY);
            ctx.lineTo(destNode.posX, destNode.posY);

            if (isPath) {
                ctx.strokeStyle = '#10b981'; // Neon Emerald green for shortest path
                ctx.lineWidth = 6;
                ctx.shadowColor = '#10b981';
                ctx.shadowBlur = 12;
            } else if (isHighlighted) {
                ctx.strokeStyle = '#f59e0b'; // Gold for active edge traversal
                ctx.lineWidth = 4;
                ctx.shadowColor = '#f59e0b';
                ctx.shadowBlur = 8;
            } else {
                ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 0;
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw Edge Weight Badge (Distance in KM)
            const midX = (sourceNode.posX + destNode.posX) / 2;
            const midY = (sourceNode.posY + destNode.posY) / 2;

            ctx.save();
            ctx.font = '600 11px Inter, sans-serif';
            const weightText = `${edge.weight} KM`;
            const textWidth = ctx.measureText(weightText).width;

            ctx.fillStyle = isPath ? '#065f46' : (isDark ? '#1e293b' : '#ffffff');
            ctx.strokeStyle = isPath ? '#10b981' : (isDark ? '#475569' : '#94a3b8');
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.roundRect(midX - textWidth / 2 - 6, midY - 10, textWidth + 12, 20, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isPath ? '#a7f3d0' : (isDark ? '#e2e8f0' : '#1e293b');
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(weightText, midX, midY);
            ctx.restore();
        }

        // 2. Draw Flowing Animated Dash Particles on Shortest Path Edges
        if (this.pathEdges.length > 0) {
            for (let edge of this.pathEdges) {
                const sourceNode = this.graph.nodes.get(edge.source);
                const destNode = this.graph.nodes.get(edge.destination);
                if (sourceNode && destNode) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(sourceNode.posX, sourceNode.posY);
                    ctx.lineTo(destNode.posX, destNode.posY);
                    ctx.strokeStyle = '#34d399';
                    ctx.lineWidth = 3;
                    ctx.setLineDash([8, 8]);
                    ctx.lineDashOffset = -this.animPhase * 10;
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }

        // 3. Draw Nodes (Cities)
        for (let [name, details] of this.graph.nodes.entries()) {
            const isActive = this.activeNode === name;
            const isVisited = this.highlightedNodes.has(name);
            const isSelected = this.selectedNode === name;
            const isHovered = this.hoveredNode === name;

            let nodeBg = isDark ? '#1e293b' : '#ffffff';
            let strokeColor = isDark ? '#3b82f6' : '#2563eb';
            let textColor = isDark ? '#f8fafc' : '#0f172a';
            let radius = this.nodeRadius;

            if (isActive) {
                nodeBg = '#ef4444'; // Red pulsing active node
                strokeColor = '#fca5a5';
                textColor = '#ffffff';
                radius += Math.sin(this.animPhase * 2) * 3;
            } else if (isVisited) {
                nodeBg = '#3b82f6'; // Bright Blue visited node
                strokeColor = '#60a5fa';
                textColor = '#ffffff';
            } else if (isSelected || isHovered) {
                strokeColor = '#8b5cf6';
                radius += 2;
            }

            // Outer Glow Effect
            if (isActive || isVisited || isSelected) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(details.posX, details.posY, radius + 6, 0, Math.PI * 2);
                ctx.fillStyle = isActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)';
                ctx.fill();
                ctx.restore();
            }

            // Node Circle Fill
            ctx.beginPath();
            ctx.arc(details.posX, details.posY, radius, 0, Math.PI * 2);
            ctx.fillStyle = nodeBg;
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();

            // City Label Text
            ctx.font = '700 13px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = isDark ? '#f1f5f9' : '#0f172a';

            // Draw label background pill for high contrast readability
            const nameWidth = ctx.measureText(name).width;
            ctx.save();
            ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)';
            ctx.beginPath();
            ctx.roundRect(details.posX - nameWidth / 2 - 6, details.posY + radius + 4, nameWidth + 12, 20, 4);
            ctx.fill();
            ctx.restore();

            ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
            ctx.fillText(name, details.posX, details.posY + radius + 8);
        }

        ctx.restore();
    }
}
