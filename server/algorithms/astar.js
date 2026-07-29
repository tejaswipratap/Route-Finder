/**
 * Manual A* (A-Star) Search Algorithm
 * 
 * Uses spatial Euclidean distance heuristic h(n) = sqrt((x1-x2)^2 + (y1-y2)^2)
 * Evaluates f(n) = g(n) + h(n) using PriorityQueue (MinHeap)
 * 
 * Time Complexity: O((V + E) log V) worst-case, significantly faster in practice
 * Space Complexity: O(V)
 */

const PriorityQueue = require('./priorityQueue');

class AStar {
    /**
     * Compute spatial Euclidean distance heuristic between two nodes
     */
    static heuristic(nodeA, nodeB, graph) {
        const detailsA = graph.nodes.get(nodeA);
        const detailsB = graph.nodes.get(nodeB);
        if (!detailsA || !detailsB) return 0;

        const dx = detailsA.posX - detailsB.posX;
        const dy = detailsA.posY - detailsB.posY;
        // Scale pixel coordinates to approximate KM ratio
        return Math.sqrt(dx * dx + dy * dy) * 0.8;
    }

    static solve(graph, startNode, endNode) {
        const vertices = graph.getVertices();
        if (!vertices.includes(startNode) || !vertices.includes(endNode)) {
            return { path: [], distance: Infinity, steps: [], error: 'Start or end node not in graph' };
        }

        const gScore = {}; // Actual cost from start to node
        const fScore = {}; // Estimated total cost f(n) = g(n) + h(n)
        const previous = {};
        const visited = new Set();
        const minHeap = new PriorityQueue();
        const steps = [];

        vertices.forEach(v => {
            gScore[v] = v === startNode ? 0 : Infinity;
            fScore[v] = v === startNode ? AStar.heuristic(startNode, endNode, graph) : Infinity;
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
            explainedLog: `Initialized A* Search. Calculated initial heuristic h("${startNode}") = ${fScore[startNode].toFixed(1)} KM.`
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
                explainedLog: `A* selected node "${current}" with lowest f(n) score (${minNode.priority.toFixed(1)} KM) from MinHeap.`
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
                    explainedLog: `Target "${endNode}" reached via A* Search heuristic!`
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
                    const h = AStar.heuristic(target, endNode, graph);
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
                        explainedLog: `Updated node "${target}": g(n) = ${tentativeG} KM, h(n) = ${h.toFixed(1)}, f(n) = ${fScore[target].toFixed(1)} KM.`
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

        return {
            path: path,
            distance: gScore[endNode],
            allDistances: gScore,
            steps: steps
        };
    }
}

module.exports = AStar;
