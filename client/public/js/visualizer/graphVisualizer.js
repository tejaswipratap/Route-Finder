/**
 * Cytoscape.js Interactive Graph Visualizer Engine
 */

class GraphVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.cy = null;
        this.theme = 'dark';
        this.graphData = null;
        this.initCytoscape();
    }

    initCytoscape() {
        if (!this.container) return;

        this.cy = cytoscape({
            container: this.container,
            boxSelectionEnabled: false,
            autounselectify: true,
            style: this.getStyles(),
            elements: [],
            layout: {
                name: 'preset',
                padding: 50
            }
        });

        // Event Listeners for Cytoscape interactivity
        this.cy.on('tap', 'node', (evt) => {
            const node = evt.target;
            if (this.onNodeClick) {
                this.onNodeClick(node.id(), node.data());
            }
        });
    }

    getStyles() {
        const isDark = this.theme === 'dark';
        return [
            {
                selector: 'node',
                style: {
                    'label': 'data(name)',
                    'width': 46,
                    'height': 46,
                    'background-color': isDark ? '#1e293b' : '#ffffff',
                    'border-width': 3,
                    'border-color': isDark ? '#3b82f6' : '#2563eb',
                    'color': isDark ? '#f8fafc' : '#0f172a',
                    'font-family': 'Inter, sans-serif',
                    'font-size': '13px',
                    'font-weight': 'bold',
                    'text-valign': 'bottom',
                    'text-margin-y': 8,
                    'text-background-opacity': 0.85,
                    'text-background-color': isDark ? '#0f172a' : '#ffffff',
                    'text-background-padding': '4px',
                    'text-background-shape': 'roundrectangle',
                    'transition-property': 'background-color, border-color, width, height',
                    'transition-duration': '0.3s'
                }
            },
            {
                selector: 'edge',
                style: {
                    'label': 'data(label)',
                    'width': 3,
                    'line-color': isDark ? '#334155' : '#cbd5e1',
                    'color': isDark ? '#94a3b8' : '#475569',
                    'font-size': '11px',
                    'font-weight': '600',
                    'text-background-opacity': 0.9,
                    'text-background-color': isDark ? '#1e293b' : '#ffffff',
                    'text-background-padding': '3px',
                    'text-background-shape': 'roundrectangle',
                    'curve-style': 'bezier'
                }
            },
            {
                selector: 'node.visited',
                style: {
                    'background-color': '#3b82f6',
                    'border-color': '#60a5fa',
                    'color': '#ffffff'
                }
            },
            {
                selector: 'node.active',
                style: {
                    'background-color': '#ef4444',
                    'border-color': '#fca5a5',
                    'width': 54,
                    'height': 54,
                    'color': '#ffffff'
                }
            },
            {
                selector: 'node.path',
                style: {
                    'background-color': '#10b981',
                    'border-color': '#34d399',
                    'color': '#ffffff'
                }
            },
            {
                selector: 'edge.active-edge',
                style: {
                    'width': 5,
                    'line-color': '#f59e0b',
                    'transition-property': 'line-color, width',
                    'transition-duration': '0.2s'
                }
            },
            {
                selector: 'edge.path-edge',
                style: {
                    'width': 6,
                    'line-color': '#10b981',
                    'transition-property': 'line-color, width',
                    'transition-duration': '0.3s'
                }
            }
        ];
    }

    setTheme(theme) {
        this.theme = theme;
        if (this.cy) {
            this.cy.style(this.getStyles());
        }
    }

    renderGraph(graphJSON) {
        if (!this.cy) return;

        this.graphData = graphJSON;
        const elements = [];

        if (graphJSON.vertices) {
            graphJSON.vertices.forEach(v => {
                elements.push({
                    group: 'nodes',
                    data: { id: v.name, name: v.name, state: v.state || '' },
                    position: { x: v.posX || Math.random() * 600, y: v.posY || Math.random() * 400 }
                });
            });
        }

        if (graphJSON.edges) {
            graphJSON.edges.forEach(e => {
                elements.push({
                    group: 'edges',
                    data: {
                        id: `${e.source}-${e.destination}`,
                        source: e.source,
                        target: e.destination,
                        weight: e.weight,
                        label: `${e.weight} KM`
                    }
                });
            });
        }

        this.cy.json({ elements: elements });
        this.fitView();
    }

    fitView() {
        if (this.cy) {
            this.cy.fit(50);
        }
    }

    setHighlights(activeNode = null, visitedSet = [], activeEdge = null, path = []) {
        if (!this.cy) return;

        // Reset elements
        this.cy.elements().removeClass('active visited path active-edge path-edge');

        // Mark visited nodes
        if (Array.isArray(visitedSet)) {
            visitedSet.forEach(nodeName => {
                const ele = this.cy.getElementById(nodeName);
                if (ele) ele.addClass('visited');
            });
        }

        // Mark active node
        if (activeNode) {
            const activeEle = this.cy.getElementById(activeNode);
            if (activeEle) activeEle.addClass('active');
        }

        // Mark active edge
        if (activeEdge) {
            const edge1 = this.cy.getElementById(`${activeEdge.source}-${activeEdge.target}`);
            const edge2 = this.cy.getElementById(`${activeEdge.target}-${activeEdge.source}`);
            if (edge1.length > 0) edge1.addClass('active-edge');
            if (edge2.length > 0) edge2.addClass('active-edge');
        }

        // Mark path & path edges
        if (Array.isArray(path) && path.length > 1) {
            path.forEach(nodeName => {
                const ele = this.cy.getElementById(nodeName);
                if (ele) ele.addClass('path');
            });

            for (let i = 0; i < path.length - 1; i++) {
                const p1 = path[i];
                const p2 = path[i + 1];
                const edge1 = this.cy.getElementById(`${p1}-${p2}`);
                const edge2 = this.cy.getElementById(`${p2}-${p1}`);
                if (edge1.length > 0) edge1.addClass('path-edge');
                if (edge2.length > 0) edge2.addClass('path-edge');
            }
        }
    }

    resetHighlights() {
        if (this.cy) {
            this.cy.elements().removeClass('active visited path active-edge path-edge');
        }
    }
}
