/**
 * Dijkstra's Shortest Path Algorithm (Built from scratch using MinHeap Priority Queue)
 * 
 * Computes shortest path on non-negative weighted graphs and records 
 * step-by-step snapshots for visual animation.
 * 
 * Time Complexity: O((V + E) log V)
 * Space Complexity: O(V + E)
 */

class DijkstraAlgorithm {
    /**
     * Compute shortest path between startNode and endNode
     * 
     * @param {Graph} graph 
     * @param {string} startNode 
     * @param {string} endNode 
     * @returns {Object} { path: Array, distance: number, steps: Array }
     */
    static solve(graph, startNode, endNode = null) {
        const vertices = graph.getVertices();
        if (!vertices.includes(startNode)) {
            return { path: [], distance: Infinity, steps: [], error: 'Start node not found in graph' };
        }

        const distances = {};
        const previous = {};
        const visited = new Set();
        const minHeap = new MinHeap();
        const steps = [];

        // Initialize distances
        vertices.forEach(v => {
            distances[v] = v === startNode ? 0 : Infinity;
            previous[v] = null;
        });

        // Push source node to MinHeap
        minHeap.insert(startNode, 0);

        // Snapshot 0: Initialization
        steps.push({
            stepIndex: steps.length + 1,
            type: 'INIT',
            currentNode: startNode,
            neighborNode: null,
            edgeDistance: null,
            visitedSet: Array.from(visited),
            minHeapState: minHeap.getHeapArray(),
            distanceTable: { ...distances },
            previousArray: { ...previous },
            explainedLog: `Initialized distances. Source node "${startNode}" set to 0, all other nodes set to ∞.`,
            activeEdge: null,
            highlightNodes: [startNode]
        });

        while (!minHeap.isEmpty()) {
            const minNode = minHeap.extractMin();
            const current = minNode.element;
            const currentDist = minNode.priority;

            if (visited.has(current)) continue;
            visited.add(current);

            // Snapshot: Extract Min
            steps.push({
                stepIndex: steps.length + 1,
                type: 'EXTRACT_MIN',
                currentNode: current,
                neighborNode: null,
                edgeDistance: null,
                visitedSet: Array.from(visited),
                minHeapState: minHeap.getHeapArray(),
                distanceTable: { ...distances },
                previousArray: { ...previous },
                explainedLog: `Extracted node "${current}" with minimum known distance (${currentDist} KM) from Min-Heap. Marked as Visited.`,
                activeEdge: null,
                highlightNodes: [current]
            });

            // Target node reached early exit check
            if (endNode && current === endNode) {
                steps.push({
                    stepIndex: steps.length + 1,
                    type: 'DESTINATION_REACHED',
                    currentNode: current,
                    neighborNode: null,
                    edgeDistance: null,
                    visitedSet: Array.from(visited),
                    minHeapState: minHeap.getHeapArray(),
                    distanceTable: { ...distances },
                    previousArray: { ...previous },
                    explainedLog: `Destination "${endNode}" extracted from Priority Queue! Optimal shortest path guaranteed.`,
                    activeEdge: null,
                    highlightNodes: [current]
                });
                break;
            }

            const neighbors = graph.getNeighbors(current);
            for (let neighbor of neighbors) {
                const target = neighbor.node;
                const weight = neighbor.weight;

                if (visited.has(target)) continue;

                const newDist = distances[current] + weight;

                // Snapshot: Examine Neighbor
                steps.push({
                    stepIndex: steps.length + 1,
                    type: 'EXAMINE_NEIGHBOR',
                    currentNode: current,
                    neighborNode: target,
                    edgeDistance: weight,
                    visitedSet: Array.from(visited),
                    minHeapState: minHeap.getHeapArray(),
                    distanceTable: { ...distances },
                    previousArray: { ...previous },
                    explainedLog: `Checking edge (${current} ➔ ${target}) with weight ${weight} KM. Candidate distance: ${distances[current]} + ${weight} = ${newDist} KM.`,
                    activeEdge: { source: current, target: target },
                    highlightNodes: [current, target]
                });

                if (newDist < distances[target]) {
                    const oldDist = distances[target];
                    distances[target] = newDist;
                    previous[target] = current;
                    minHeap.insert(target, newDist);

                    // Snapshot: Relax Edge
                    steps.push({
                        stepIndex: steps.length + 1,
                        type: 'RELAX_EDGE',
                        currentNode: current,
                        neighborNode: target,
                        edgeDistance: weight,
                        visitedSet: Array.from(visited),
                        minHeapState: minHeap.getHeapArray(),
                        distanceTable: { ...distances },
                        previousArray: { ...previous },
                        explainedLog: `Relaxed edge (${current} ➔ ${target})! Updated distance for "${target}" from ${oldDist === Infinity ? '∞' : oldDist + ' KM'} to ${newDist} KM. Pushed/Updated in MinHeap.`,
                        activeEdge: { source: current, target: target },
                        highlightNodes: [current, target]
                    });
                }
            }
        }

        // Reconstruct path
        const path = [];
        let curr = endNode;
        if (endNode && (distances[endNode] !== Infinity || endNode === startNode)) {
            while (curr) {
                path.unshift(curr);
                curr = previous[curr];
            }
        }

        // Final completion snapshot
        steps.push({
            stepIndex: steps.length + 1,
            type: 'COMPLETE',
            currentNode: endNode || startNode,
            neighborNode: null,
            edgeDistance: null,
            visitedSet: Array.from(visited),
            minHeapState: [],
            distanceTable: { ...distances },
            previousArray: { ...previous },
            explainedLog: endNode 
                ? (path.length > 0 ? `Algorithm Complete! Shortest path: ${path.join(' ➔ ')} (${distances[endNode]} KM).` : `No path exists between ${startNode} and ${endNode}.`)
                : `Dijkstra traversal complete for all reachable nodes from ${startNode}.`,
            activeEdge: null,
            highlightNodes: path
        });

        return {
            path: path,
            distance: endNode ? distances[endNode] : 0,
            allDistances: distances,
            steps: steps
        };
    }
}
