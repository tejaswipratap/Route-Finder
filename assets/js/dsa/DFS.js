/**
 * Depth-First Search (DFS) Algorithm (Built from scratch using Stack)
 * 
 * Explores graph branches as deep as possible before backtracking
 * and records step snapshots for visual animation.
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */

class DFSAlgorithm {
    /**
     * Run DFS from startNode to endNode (or full traversal)
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
        const stack = new Stack();
        const previous = {};
        const traversalOrder = [];
        const steps = [];

        vertices.forEach(v => previous[v] = null);

        // Push source node to Stack
        stack.push(startNode);

        steps.push({
            stepIndex: steps.length + 1,
            type: 'INIT',
            currentNode: startNode,
            visitedSet: Array.from(visited),
            stackState: stack.toArray(),
            traversalOrder: [...traversalOrder],
            explainedLog: `Initialized DFS. Pushed source node "${startNode}" onto Stack.`,
            activeEdge: null,
            highlightNodes: [startNode]
        });

        let found = false;

        while (!stack.isEmpty()) {
            const current = stack.pop();

            if (visited.has(current)) continue;
            visited.add(current);
            traversalOrder.push(current);

            steps.push({
                stepIndex: steps.length + 1,
                type: 'POP_STACK',
                currentNode: current,
                visitedSet: Array.from(visited),
                stackState: stack.toArray(),
                traversalOrder: [...traversalOrder],
                explainedLog: `Popped node "${current}" from Stack. Marked as Visited and added to DFS traversal order.`,
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
                    stackState: stack.toArray(),
                    traversalOrder: [...traversalOrder],
                    explainedLog: `Destination node "${endNode}" reached via DFS branch exploration!`,
                    activeEdge: null,
                    highlightNodes: [current]
                });
                break;
            }

            const neighbors = graph.getNeighbors(current);
            // Reverse neighbors array to push rightmost first, so leftmost is popped next (standard recursive order)
            for (let i = neighbors.length - 1; i >= 0; i--) {
                const target = neighbors[i].node;
                if (!visited.has(target)) {
                    previous[target] = current;
                    stack.push(target);

                    steps.push({
                        stepIndex: steps.length + 1,
                        type: 'PUSH_NEIGHBOR',
                        currentNode: current,
                        neighborNode: target,
                        visitedSet: Array.from(visited),
                        stackState: stack.toArray(),
                        traversalOrder: [...traversalOrder],
                        explainedLog: `Exploring branch (${current} ➔ ${target}). Pushed "${target}" onto Stack for deeper exploration.`,
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
            stackState: [],
            traversalOrder: [...traversalOrder],
            explainedLog: endNode 
                ? (path.length > 0 ? `DFS Complete! Branch Path: ${path.join(' ➔ ')}.` : `No path exists between ${startNode} and ${endNode}.`)
                : `DFS recursive branch traversal complete. Explored ${traversalOrder.length} nodes.`,
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
