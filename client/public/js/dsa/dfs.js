class DFSAlgorithm {
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

        stack.push(startNode);

        steps.push({
            stepIndex: steps.length + 1,
            type: 'INIT',
            currentNode: startNode,
            visitedSet: Array.from(visited),
            stackState: stack.toArray(),
            traversalOrder: [...traversalOrder],
            explainedLog: `Initialized DFS. Pushed "${startNode}" onto Stack.`,
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
                explainedLog: `Popped "${current}" from Stack and marked as Visited.`,
                activeEdge: null,
                highlightNodes: [current]
            });

            if (endNode && current === endNode) {
                found = true;
                break;
            }

            const neighbors = graph.getNeighbors(current);
            for (let i = neighbors.length - 1; i >= 0; i--) {
                const target = neighbors[i].node;
                if (!visited.has(target)) {
                    previous[target] = current;
                    stack.push(target);

                    steps.push({
                        stepIndex: steps.length + 1,
                        type: 'PUSH_STACK',
                        currentNode: current,
                        neighborNode: target,
                        visitedSet: Array.from(visited),
                        stackState: stack.toArray(),
                        traversalOrder: [...traversalOrder],
                        explainedLog: `Pushed "${target}" onto Stack for deep branch exploration.`,
                        activeEdge: { source: current, target: target },
                        highlightNodes: [current, target]
                    });
                }
            }
        }

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
            explainedLog: endNode ? `DFS Path: ${path.join(' ➔ ')}.` : `DFS Traversal finished.`,
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
