/**
 * Manual BFS Algorithm
 */

const Queue = require('./queue');

class BFS {
    static solve(graph, startNode, endNode = null) {
        const vertices = graph.getVertices();
        if (!vertices.includes(startNode)) {
            return { path: [], traversalOrder: [], steps: [], error: 'Start node not in graph' };
        }

        const visited = new Set();
        const queue = new Queue();
        const previous = {};
        const traversalOrder = [];
        const steps = [];

        vertices.forEach(v => previous[v] = null);

        queue.enqueue(startNode);
        visited.add(startNode);

        steps.push({
            stepIndex: steps.length + 1,
            type: 'INIT',
            currentNode: startNode,
            visitedSet: Array.from(visited),
            queueState: queue.toArray(),
            traversalOrder: [...traversalOrder],
            explainedLog: `Initialized BFS. Enqueued source node "${startNode}".`
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
                explainedLog: `Dequeued "${current}".`
            });

            if (endNode && current === endNode) {
                found = true;
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
                        type: 'ENQUEUE',
                        currentNode: current,
                        neighborNode: target,
                        visitedSet: Array.from(visited),
                        queueState: queue.toArray(),
                        traversalOrder: [...traversalOrder],
                        explainedLog: `Enqueued neighbor "${target}".`
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

        return {
            path: path,
            traversalOrder: traversalOrder,
            steps: steps
        };
    }
}

module.exports = BFS;
