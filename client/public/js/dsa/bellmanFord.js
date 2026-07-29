/**
 * Client-Side Bellman-Ford Algorithm
 */

class BellmanFordAlgorithm {
    static solve(graph, startNode, endNode = null) {
        const vertices = graph.getVertices();
        const edges = graph.getAllEdges();
        if (!vertices.includes(startNode)) {
            return { path: [], distance: Infinity, steps: [], error: 'Start node not found in graph' };
        }

        const distances = {};
        const previous = {};
        const visited = new Set();
        const steps = [];

        vertices.forEach(v => {
            distances[v] = v === startNode ? 0 : Infinity;
            previous[v] = null;
        });

        steps.push({
            stepIndex: steps.length + 1,
            type: 'INIT',
            currentNode: startNode,
            visitedSet: Array.from(visited),
            distanceTable: { ...distances },
            previousArray: { ...previous },
            explainedLog: `Initialized Bellman-Ford algorithm. Set distance to "${startNode}" = 0.`,
            activeEdge: null,
            highlightNodes: [startNode]
        });

        const V = vertices.length;

        for (let pass = 1; pass <= V - 1; pass++) {
            let updated = false;
            for (let edge of edges) {
                const u = edge.source;
                const v = edge.destination;
                const weight = edge.weight;

                if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
                    distances[v] = distances[u] + weight;
                    previous[v] = u;
                    visited.add(u);
                    visited.add(v);
                    updated = true;

                    steps.push({
                        stepIndex: steps.length + 1,
                        type: 'RELAX_EDGE',
                        currentNode: u,
                        neighborNode: v,
                        visitedSet: Array.from(visited),
                        distanceTable: { ...distances },
                        previousArray: { ...previous },
                        explainedLog: `[Pass ${pass}/${V-1}] Relaying edge (${u} ➔ ${v}): Updated distance to ${distances[v]} KM.`,
                        activeEdge: { source: u, target: v },
                        highlightNodes: [u, v]
                    });
                }
            }

            if (!updated) {
                steps.push({
                    stepIndex: steps.length + 1,
                    type: 'EARLY_EXIT',
                    currentNode: startNode,
                    visitedSet: Array.from(visited),
                    distanceTable: { ...distances },
                    previousArray: { ...previous },
                    explainedLog: `[Pass ${pass}/${V-1}] No distances updated in pass. Early convergence achieved!`,
                    activeEdge: null,
                    highlightNodes: [startNode]
                });
                break;
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
            distanceTable: { ...distances },
            previousArray: { ...previous },
            explainedLog: endNode ? `Bellman-Ford Shortest Path: ${path.join(' ➔ ')} (${distances[endNode]} KM).` : `Bellman-Ford execution complete.`,
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
