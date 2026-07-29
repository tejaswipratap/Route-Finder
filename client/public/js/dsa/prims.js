/**
 * Client-Side Prim's MST Algorithm
 */

class PrimMSTAlgorithm {
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
            explainedLog: `Initialized Prim's MST from "${start}". Pushed edges to MinHeap.`,
            activeEdge: null,
            highlightNodes: [start]
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
                explainedLog: `Added edge (${u} ➔ ${v}) weight ${weight} KM to MST.`,
                activeEdge: { source: u, target: v },
                highlightNodes: [u, v]
            });

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
            explainedLog: `Prim's MST Complete! Minimum Spanning Network Distance: ${totalWeight} KM.`,
            activeEdge: null,
            highlightNodes: Array.from(inMST)
        });

        return {
            mstEdges: mstEdges,
            totalWeight: totalWeight,
            steps: steps
        };
    }
}
