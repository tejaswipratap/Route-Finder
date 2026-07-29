/**
 * Client Adjacency List Graph Data Structure
 */

class Graph {
    constructor(isDirected = false) {
        this.adjacencyList = new Map();
        this.nodes = new Map();
        this.isDirected = isDirected;
    }

    addVertex(name, details = {}) {
        if (!name) return false;
        if (!this.adjacencyList.has(name)) {
            this.adjacencyList.set(name, []);
            this.nodes.set(name, {
                id: details.id || details._id || name,
                name: name,
                state: details.state || '',
                posX: details.posX !== undefined ? details.posX : Math.floor(Math.random() * 600) + 100,
                posY: details.posY !== undefined ? details.posY : Math.floor(Math.random() * 400) + 100
            });
            return true;
        }
        return false;
    }

    addEdge(source, destination, distance, roadType = 'Highway', id = null) {
        if (!this.adjacencyList.has(source)) this.addVertex(source);
        if (!this.adjacencyList.has(destination)) this.addVertex(destination);

        const weight = parseFloat(distance);
        if (isNaN(weight) || weight <= 0) return false;

        const sourceEdges = this.adjacencyList.get(source);
        const existingSource = sourceEdges.find(e => e.node === destination);
        if (existingSource) {
            existingSource.weight = weight;
            existingSource.roadType = roadType;
        } else {
            sourceEdges.push({ node: destination, weight, roadType, id: id || `${source}-${destination}` });
        }

        if (!this.isDirected) {
            const destEdges = this.adjacencyList.get(destination);
            const existingDest = destEdges.find(e => e.node === source);
            if (existingDest) {
                existingDest.weight = weight;
                existingDest.roadType = roadType;
            } else {
                destEdges.push({ node: source, weight, roadType, id: id || `${destination}-${source}` });
            }
        }
        return true;
    }

    removeEdge(source, destination) {
        if (this.adjacencyList.has(source)) {
            this.adjacencyList.set(source, this.adjacencyList.get(source).filter(e => e.node !== destination));
        }
        if (!this.isDirected && this.adjacencyList.has(destination)) {
            this.adjacencyList.set(destination, this.adjacencyList.get(destination).filter(e => e.node !== source));
        }
    }

    removeVertex(name) {
        if (!this.adjacencyList.has(name)) return false;
        for (let [vertex, edges] of this.adjacencyList.entries()) {
            this.adjacencyList.set(vertex, edges.filter(e => e.node !== name));
        }
        this.adjacencyList.delete(name);
        this.nodes.delete(name);
        return true;
    }

    getNeighbors(name) {
        return this.adjacencyList.get(name) || [];
    }

    getVertices() {
        return Array.from(this.adjacencyList.keys());
    }

    getAllEdges() {
        const edges = [];
        const visited = new Set();
        for (let [source, neighborList] of this.adjacencyList.entries()) {
            for (let neighbor of neighborList) {
                const key = this.isDirected ? `${source}->${neighbor.node}` : [source, neighbor.node].sort().join('<->');
                if (!visited.has(key)) {
                    visited.add(key);
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

    exportJSON() {
        return {
            isDirected: this.isDirected,
            vertices: Array.from(this.nodes.values()),
            edges: this.getAllEdges()
        };
    }

    importJSON(data) {
        this.adjacencyList.clear();
        this.nodes.clear();
        this.isDirected = !!data.isDirected;

        if (Array.isArray(data.vertices)) {
            data.vertices.forEach(v => this.addVertex(v.name, v));
        }
        if (Array.isArray(data.edges)) {
            data.edges.forEach(e => this.addEdge(e.source, e.destination, e.weight, e.roadType, e.id));
        }
        return true;
    }
}
