/**
 * Manual Dijkstra Algorithm
 */

const PriorityQueue = require('./priorityQueue');

class Dijkstra {
    static solve(graph, startNode, endNode = null) {
        const vertices = graph.getVertices();
        if (!vertices.includes(startNode)) {
            return { path: [], distance: Infinity, steps: [], error: 'Start node not in graph' };
        }

        const distances = {};
        const previous = {};
        const visited = new Set();
        const minHeap = new PriorityQueue();
        const steps = [];

        vertices.forEach(v => {
            distances[v] = v === startNode ? 0 : Infinity;
            previous[v] = null;
        });

        minHeap.insert(startNode, 0);

        steps.push({
            stepIndex: steps.length + 1,
            type: 'INIT',
            currentNode: startNode,
            visitedSet: Array.from(visited),
            minHeapState: minHeap.getHeapArray(),
            distanceTable: { ...distances },
            previousArray: { ...previous },
            explainedLog: `Initialized Dijkstra. Source "${startNode}" set to distance 0.`
        });

        while (!minHeap.isEmpty()) {
            const minNode = minHeap.extractMin();
            const current = minNode.element;
            const currentDist = minNode.priority;

            if (visited.has(current)) continue;
            visited.add(current);

            steps.push({
                stepIndex: steps.length + 1,
                type: 'EXTRACT_MIN',
                currentNode: current,
                visitedSet: Array.from(visited),
                minHeapState: minHeap.getHeapArray(),
                distanceTable: { ...distances },
                previousArray: { ...previous },
                explainedLog: `Extracted node "${current}" (${currentDist} KM) from MinHeap.`
            });

            if (endNode && current === endNode) {
                break;
            }

            const neighbors = graph.getNeighbors(current);
            for (let neighbor of neighbors) {
                const target = neighbor.node;
                const weight = neighbor.weight;
                if (visited.has(target)) continue;

                const newDist = distances[current] + weight;
                if (newDist < distances[target]) {
                    distances[target] = newDist;
                    previous[target] = current;
                    minHeap.insert(target, newDist);

                    steps.push({
                        stepIndex: steps.length + 1,
                        type: 'RELAX_EDGE',
                        currentNode: current,
                        neighborNode: target,
                        visitedSet: Array.from(visited),
                        minHeapState: minHeap.getHeapArray(),
                        distanceTable: { ...distances },
                        previousArray: { ...previous },
                        explainedLog: `Relaxed edge (${current} -> ${target}). Updated distance to ${newDist} KM.`
                    });
                }
            }
        }

        const path = [];
        let curr = endNode;
        if (endNode && (distances[endNode] !== Infinity || endNode === startNode)) {
            while (curr) {
                path.unshift(curr);
                curr = previous[curr];
            }
        }

        return {
            path: path,
            distance: endNode ? distances[endNode] : 0,
            allDistances: distances,
            steps: steps
        };
    }
}

module.exports = Dijkstra;
