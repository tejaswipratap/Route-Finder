class DijkstraAlgorithm {
    static solve(graph, startNode, endNode = null) {
        const vertices = graph.getVertices();
        if (!vertices.includes(startNode)) {
            return { path: [], distance: Infinity, steps: [], error: 'Start node not found in graph' };
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
            explainedLog: `Initialized Dijkstra algorithm. Source node "${startNode}" distance set to 0.`,
            activeEdge: null,
            highlightNodes: [startNode]
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
                explainedLog: `Extracted node "${current}" with min distance (${currentDist} KM) from Priority Queue. Marked as Visited.`,
                activeEdge: null,
                highlightNodes: [current]
            });

            if (endNode && current === endNode) {
                steps.push({
                    stepIndex: steps.length + 1,
                    type: 'DESTINATION_REACHED',
                    currentNode: current,
                    visitedSet: Array.from(visited),
                    minHeapState: minHeap.getHeapArray(),
                    distanceTable: { ...distances },
                    previousArray: { ...previous },
                    explainedLog: `Destination "${endNode}" reached! Optimal path confirmed.`,
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

                steps.push({
                    stepIndex: steps.length + 1,
                    type: 'EXAMINE_NEIGHBOR',
                    currentNode: current,
                    neighborNode: target,
                    visitedSet: Array.from(visited),
                    minHeapState: minHeap.getHeapArray(),
                    distanceTable: { ...distances },
                    previousArray: { ...previous },
                    explainedLog: `Examining edge (${current} ➔ ${target}) with weight ${weight} KM. Candidate: ${distances[current]} + ${weight} = ${newDist} KM.`,
                    activeEdge: { source: current, target: target },
                    highlightNodes: [current, target]
                });

                if (newDist < distances[target]) {
                    const oldDist = distances[target];
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
                        explainedLog: `Relaxed edge (${current} ➔ ${target})! Updated distance to ${newDist} KM (was ${oldDist === Infinity ? '∞' : oldDist + ' KM'}).`,
                        activeEdge: { source: current, target: target },
                        highlightNodes: [current, target]
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

        steps.push({
            stepIndex: steps.length + 1,
            type: 'COMPLETE',
            currentNode: endNode || startNode,
            visitedSet: Array.from(visited),
            minHeapState: [],
            distanceTable: { ...distances },
            previousArray: { ...previous },
            explainedLog: endNode 
                ? (path.length > 0 ? `Dijkstra Complete! Shortest Path: ${path.join(' ➔ ')} (${distances[endNode]} KM).` : `No path exists between ${startNode} and ${endNode}.`)
                : `Dijkstra traversal finished.`,
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
