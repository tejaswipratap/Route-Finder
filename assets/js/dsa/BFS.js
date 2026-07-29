/**
 * Breadth-First Search (BFS) Algorithm (Built from scratch using Queue)
 * 
 * Explores graph level-by-level (unweighted shortest hop path)
 * and records step snapshots for visual animation.
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */

class BFSAlgorithm {
    /**
     * Run BFS from startNode to endNode (or full traversal)
     * 
     * @param {Graph} graph 
     * @param {string} startNode 
     * @param {string} endNode 
     * @returns {Object} { path: Array, traversalOrder: Array, steps: Array }
     */
    static solve(graph, startNode, endNode = null) {
        const vertices = graph.getVertices();
        if (!vertices.includes(startNode)) {
            return { path: [], traversalOrder: [], steps: [], error: 'Start node not found in graph' };
        }

        const visited = new Set();
        const queue = new Queue();
        const previous = {};
        const traversalOrder = [];
        const steps = [];

        vertices.forEach(v => previous[v] = null);

        // Start BFS
        queue.enqueue(startNode);
        visited.add(startNode);

        steps.push({
            stepIndex: steps.length + 1,
            type: 'INIT',
            currentNode: startNode,
            visitedSet: Array.from(visited),
            queueState: queue.toArray(),
            traversalOrder: [...traversalOrder],
            explainedLog: `Initialized BFS. Enqueued source node "${startNode}" and marked as Visited.`,
            activeEdge: null,
            highlightNodes: [startNode]
        });

        let found = false;

        while (!queue.isEmpty()) {
            const current = queue.dequeue();
            traversalOrder.push(current);

            steps.push({
                stepIndex: steps.length + 1,
                type: 'DEQUEUE',
                currentNode: current,
                visitedSet: Array.from(visited),
                queueState: queue.toArray(),
                traversalOrder: [...traversalOrder],
                explainedLog: `Dequeued node "${current}" from Queue. Added to traversal order.`,
                activeEdge: null,
                highlightNodes: [current]
            });

            if (endNode && current === endNode) {
                found = true;
                steps.push({
                    stepIndex: steps.length + 1,
                    type: 'DESTINATION_REACHED',
                    currentNode: current,
                    visitedSet: Array.from(visited),
                    queueState: queue.toArray(),
                    traversalOrder: [...traversalOrder],
                    explainedLog: `Destination node "${endNode}" reached via BFS level traversal!`,
                    activeEdge: null,
                    highlightNodes: [current]
                });
                break;
            }

            const neighbors = graph.getNeighbors(current);
            for (let neighbor of neighbors) {
                const target = neighbor.node;
                if (!visited.has(target)) {
                    visited.add(target);
                    previous[target] = current;
                    queue.enqueue(target);

                    steps.push({
                        stepIndex: steps.length + 1,
                        type: 'ENQUEUE_NEIGHBOR',
                        currentNode: current,
                        neighborNode: target,
                        visitedSet: Array.from(visited),
                        queueState: queue.toArray(),
                        traversalOrder: [...traversalOrder],
                        explainedLog: `Discovered unvisited neighbor "${target}". Marked as Visited and Enqueued.`,
                        activeEdge: { source: current, target: target },
                        highlightNodes: [current, target]
                    });
                }
            }
        }

        // Reconstruct path
        const path = [];
        let curr = endNode;
        if (endNode && (found || endNode === startNode)) {
            while (curr) {
                path.unshift(curr);
                curr = previous[curr];
            }
        }

        steps.push({
            stepIndex: steps.length + 1,
            type: 'COMPLETE',
            currentNode: endNode || startNode,
            visitedSet: Array.from(visited),
            queueState: [],
            traversalOrder: [...traversalOrder],
            explainedLog: endNode 
                ? (path.length > 0 ? `BFS Complete! Unweighted Hop Path: ${path.join(' ➔ ')} (${path.length - 1} hops).` : `No path exists between ${startNode} and ${endNode}.`)
                : `BFS full level traversal complete. Explored ${traversalOrder.length} nodes.`,
            activeEdge: null,
            highlightNodes: path.length > 0 ? path : traversalOrder
        });

        return {
            path: path,
            traversalOrder: traversalOrder,
            steps: steps
        };
    }
}
