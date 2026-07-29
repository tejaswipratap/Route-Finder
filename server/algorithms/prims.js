/**
 * Manual Prim's Minimum Spanning Tree (MST) Algorithm
 * 
 * Computes minimum road network needed to connect all vertices in graph.
 * 
 * Time Complexity: O((V + E) log V)
 * Space Complexity: O(V + E)
 */

const PriorityQueue = require('./priorityQueue');

class PrimMST {
    static solve(graph, startNode = null) {
        const vertices = graph.getVertices();
        if (vertices.length === 0) {
            return { mstEdges: [], totalWeight: 0, steps: [] };
        }

        const start = startNode && vertices.includes(startNode) ? startNode : vertices[0];
        const inMST = new Set();
        const minHeap = new PriorityQueue();
        const mstEdges = [];
        const steps = [];
        let totalWeight = 0;

        inMST.add(start);

        // Add all outgoing edges from start node
        const initialNeighbors = graph.getNeighbors(start);
        initialNeighbors.forEach(nbr => {
            minHeap.insert(`${start}->${nbr.node}`, nbr.weight);
        });

        steps.push({
            stepIndex: steps.length + 1,
            type: 'INIT',
            currentNode: start,
            visitedSet: Array.from(inMST),
            minHeapState: minHeap.getHeapArray(),
            explainedLog: `Initialized Prim's MST starting from "${start}". Pushed adjacent edges to MinHeap.`
        });

        while (!minHeap.isEmpty() && inMST.size < vertices.length) {
            const minEdge = minHeap.extractMin();
            const [u, v] = minEdge.element.split('->');
            const weight = minEdge.priority;

            if (inMST.has(u) && inMST.has(v)) continue;

            const nextNode = inMST.has(u) ? v : u;
            inMST.add(nextNode);
            mstEdges.push({ source: u, destination: v, weight: weight });
            totalWeight += weight;

            steps.push({
                stepIndex: steps.length + 1,
                type: 'ADD_MST_EDGE',
                currentNode: nextNode,
                visitedSet: Array.from(inMST),
                minHeapState: minHeap.getHeapArray(),
                explainedLog: `Added edge (${u} ➔ ${v}) with weight ${weight} KM to MST. Node "${nextNode}" included in MST.`
            });

            // Add outgoing edges from newly added node
            const neighbors = graph.getNeighbors(nextNode);
            for (let nbr of neighbors) {
                if (!inMST.has(nbr.node)) {
                    minHeap.insert(`${nextNode}->${nbr.node}`, nbr.weight);
                }
            }
        }

        steps.push({
            stepIndex: steps.length + 1,
            type: 'COMPLETE',
            currentNode: start,
            visitedSet: Array.from(inMST),
            minHeapState: [],
            explainedLog: `Prim's MST Complete! Total Minimum Network Weight: ${totalWeight} KM across ${mstEdges.length} edges.`
        });

        return {
            mstEdges: mstEdges,
            totalWeight: totalWeight,
            steps: steps
        };
    }
}

module.exports = PrimMST;
