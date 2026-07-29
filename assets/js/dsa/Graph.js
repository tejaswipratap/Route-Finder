/**
 * Adjacency List Graph Data Structure (Built from scratch)
 * 
 * Time Complexity:
 * - Add Vertex: O(1)
 * - Add Edge: O(1)
 * - Remove Edge: O(E)
 * - Remove Vertex: O(V + E)
 * - Query Neighbors: O(1)
 * 
 * Space Complexity: O(V + E)
 */

class Graph {
    constructor(isDirected = false) {
        // Map of vertexName -> Array of { node: string, weight: number, roadType: string, id: number }
        this.adjacencyList = new Map();
        // Map of vertexName -> { id: number, name: string, state: string, posX: number, posY: number }
        this.nodes = new Map();
        this.isDirected = isDirected;
    }

    /**
     * Add a node / city to the graph
     */
    addVertex(name, details = {}) {
        if (!name) return false;
        if (!this.adjacencyList.has(name)) {
            this.adjacencyList.set(name, []);
            this.nodes.set(name, {
                id: details.id || Date.now() + Math.floor(Math.random() * 1000),
                name: name,
                state: details.state || '',
                posX: details.posX !== undefined ? details.posX : Math.floor(Math.random() * 600) + 100,
                posY: details.posY !== undefined ? details.posY : Math.floor(Math.random() * 400) + 100
            });
            return true;
        }
        return false;
    }

    /**
     * Add a weighted edge / road between source and destination
     */
    addEdge(source, destination, distance, roadType = 'Highway', edgeId = null) {
        if (!this.adjacencyList.has(source)) this.addVertex(source);
        if (!this.adjacencyList.has(destination)) this.addVertex(destination);

        const weight = parseFloat(distance);
        if (isNaN(weight) || weight <= 0) return false;

        // Check if edge already exists
        const existingSourceEdge = this.adjacencyList.get(source).find(edge => edge.node === destination);
        if (existingSourceEdge) {
            existingSourceEdge.weight = weight;
            existingSourceEdge.roadType = roadType;
        } else {
            this.adjacencyList.get(source).push({
                node: destination,
                weight: weight,
                roadType: roadType,
                id: edgeId || Date.now() + Math.floor(Math.random() * 1000)
            });
        }

        if (!this.isDirected) {
            const existingDestEdge = this.adjacencyList.get(destination).find(edge => edge.node === source);
            if (existingDestEdge) {
                existingDestEdge.weight = weight;
                existingDestEdge.roadType = roadType;
            } else {
                this.adjacencyList.get(destination).push({
                    node: source,
                    weight: weight,
                    roadType: roadType,
                    id: edgeId || Date.now() + Math.floor(Math.random() * 1000)
                });
            }
        }
        return true;
    }

    /**
     * Remove an edge / road between source and destination
     */
    removeEdge(source, destination) {
        if (this.adjacencyList.has(source)) {
            this.adjacencyList.set(
                source,
                this.adjacencyList.get(source).filter(edge => edge.node !== destination)
            );
        }
        if (!this.isDirected && this.adjacencyList.has(destination)) {
            this.adjacencyList.set(
                destination,
                this.adjacencyList.get(destination).filter(edge => edge.node !== source)
            );
        }
    }

    /**
     * Remove a vertex / city and all connected edges
     */
    removeVertex(name) {
        if (!this.adjacencyList.has(name)) return false;

        // Remove edge references in all neighbor adjacency lists
        for (let [vertex, edges] of this.adjacencyList.entries()) {
            this.adjacencyList.set(
                vertex,
                edges.filter(edge => edge.node !== name)
            );
        }

        this.adjacencyList.delete(name);
        this.nodes.delete(name);
        return true;
    }

    /**
     * Get neighbors of a vertex
     */
    getNeighbors(name) {
        return this.adjacencyList.get(name) || [];
    }

    /**
     * Get all vertex names
     */
    getVertices() {
        return Array.from(this.adjacencyList.keys());
    }

    /**
     * Get node metadata map
     */
    getNodeDetails(name) {
        return this.nodes.get(name) || null;
    }

    /**
     * Get all edge objects
     */
    getAllEdges() {
        const edges = [];
        const visitedEdges = new Set();

        for (let [source, neighborList] of this.adjacencyList.entries()) {
            for (let neighbor of neighborList) {
                const edgeKey = this.isDirected
                    ? `${source}->${neighbor.node}`
                    : [source, neighbor.node].sort().join('<->');

                if (!visitedEdges.has(edgeKey)) {
                    visitedEdges.add(edgeKey);
                    edges.push({
                        source: source,
                        destination: neighbor.node,
                        weight: neighbor.weight,
                        roadType: neighbor.roadType,
                        id: neighbor.id
                    });
                }
            }
        }
        return edges;
    }

    /**
     * Clear graph data
     */
    clear() {
        this.adjacencyList.clear();
        this.nodes.clear();
    }

    /**
     * Export graph as JSON object
     */
    exportJSON() {
        const vertices = [];
        for (let [name, details] of this.nodes.entries()) {
            vertices.push(details);
        }
        return JSON.stringify({
            isDirected: this.isDirected,
            vertices: vertices,
            edges: this.getAllEdges()
        }, null, 2);
    }

    /**
     * Import graph from JSON object/string
     */
    importJSON(jsonString) {
        try {
            const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
            this.clear();
            this.isDirected = !!data.isDirected;

            if (Array.isArray(data.vertices)) {
                data.vertices.forEach(v => this.addVertex(v.name, v));
            }
            if (Array.isArray(data.edges)) {
                data.edges.forEach(e => this.addEdge(e.source, e.destination, e.weight, e.roadType, e.id));
            }
            return true;
        } catch (err) {
            console.error("Failed to parse graph JSON:", err);
            return false;
        }
    }
}
