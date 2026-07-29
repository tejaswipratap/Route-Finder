/**
 * Client-Side A* Search Algorithm
 */

class AStarAlgorithm {
    static heuristic(nodeA, nodeB, graph) {
        const detailsA = graph.nodes.get(nodeA);
        const detailsB = graph.nodes.get(nodeB);
        if (!detailsA || !detailsB) return 0;
        const dx = detailsA.posX - detailsB.posX;
        const dy = detailsA.posY - detailsB.posY;
        return Math.sqrt(dx * dx + dy * dy) * 0.8;
    }

    static solve(graph, startNode, endNode) {
        const vertices = graph.getVertices();
        if (!vertices.includes(startNode) || !vertices.includes(endNode)) {
            return { path: [], distance: Infinity, steps: [], error: 'Start or end node not found in graph' };
        }

        const gScore = {};
        const fScore = {};
        const previous = {};
        const visited = new Set();
        const minHeap = new PriorityQueue();
        const steps = [];

        vertices.forEach(v => {
            gScore[v] = v === startNode ? 0 : Infinity;
            fScore[v] = v === startNode ? AStarAlgorithm.heuristic(startNode, endNode, graph) : Infinity;
            previous[v] = null;
        });

        minHeap.insert(startNode, fScore[startNode]);

        steps.push({
            stepIndex: steps.length + 1,
            type: 'INIT',
            currentNode: startNode,
            visitedSet: Array.from(visited),
            minHeapState: minHeap.getHeapArray(),
            distanceTable: { ...gScore },
            previousArray: { ...previous },
            explainedLog: `Initialized A* Search. Initial heuristic h("${startNode}") = ${fScore[startNode].toFixed(1)} KM.`,
            activeEdge: null,
            highlightNodes: [startNode]
        });

        while (!minHeap.isEmpty()) {
            const minNode = minHeap.extractMin();
            const current = minNode.element;

            if (visited.has(current)) continue;
            visited.add(current);

            steps.push({
                stepIndex: steps.length + 1,
                type: 'EXTRACT_MIN',
                currentNode: current,
                visitedSet: Array.from(visited),
                minHeapState: minHeap.getHeapArray(),
                distanceTable: { ...gScore },
                previousArray: { ...previous },
                explainedLog: `A* selected node "${current}" with min f(n) = ${minNode.priority.toFixed(1)} KM.`,
                activeEdge: null,
                highlightNodes: [current]
            });

            if (current === endNode) {
                steps.push({
                    stepIndex: steps.length + 1,
                    type: 'DESTINATION_REACHED',
                    currentNode: current,
                    visitedSet: Array.from(visited),
                    minHeapState: minHeap.getHeapArray(),
                    distanceTable: { ...gScore },
                    previousArray: { ...previous },
                    explainedLog: `Destination "${endNode}" reached via A* Search heuristic!`,
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

                const tentativeG = gScore[current] + weight;
                if (tentativeG < gScore[target]) {
                    previous[target] = current;
                    gScore[target] = tentativeG;
                    const h = AStarAlgorithm.heuristic(target, endNode, graph);
                    fScore[target] = tentativeG + h;
                    minHeap.insert(target, fScore[target]);

                    steps.push({
                        stepIndex: steps.length + 1,
                        type: 'RELAX_EDGE',
                        currentNode: current,
                        neighborNode: target,
                        visitedSet: Array.from(visited),
                        minHeapState: minHeap.getHeapArray(),
                        distanceTable: { ...gScore },
                        previousArray: { ...previous },
                        explainedLog: `Relaxed edge (${current} ➔ ${target}). Updated g(n)=${tentativeG} KM, f(n)=${fScore[target].toFixed(1)} KM.`,
                        activeEdge: { source: current, target: target },
                        highlightNodes: [current, target]
                    });
                }
            }
        }

        const path = [];
        let curr = endNode;
        if (gScore[endNode] !== Infinity || endNode === startNode) {
            while (curr) {
                path.unshift(curr);
                curr = previous[curr];
            }
        }

        steps.push({
            stepIndex: steps.length + 1,
            type: 'COMPLETE',
            currentNode: endNode,
            visitedSet: Array.from(visited),
            minHeapState: [],
            distanceTable: { ...gScore },
            previousArray: { ...previous },
            explainedLog: `A* Search Complete! Optimal Path: ${path.join(' ➔ ')} (${gScore[endNode]} KM).`,
            activeEdge: null,
            highlightNodes: path
        });

        return {
            path: path,
            distance: gScore[endNode],
            allDistances: gScore,
            steps: steps
        };
    }
}
