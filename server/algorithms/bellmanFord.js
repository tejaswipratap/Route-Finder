/**
 * Manual Bellman-Ford Algorithm (With Negative Weight Cycle Detection)
 * 
 * Relaxes all edges V - 1 times and performs V-th check for negative cycles.
 * 
 * Time Complexity: O(V * E)
 * Space Complexity: O(V)
 */

class BellmanFord {
    static solve(graph, startNode, endNode = null) {
        const vertices = graph.getVertices();
        const edges = graph.getAllEdges();
        if (!vertices.includes(startNode)) {
            return { path: [], distance: Infinity, steps: [], error: 'Start node not in graph' };
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
            explainedLog: `Initialized Bellman-Ford. Set distance to "${startNode}" = 0, all others = ∞.`
        });

        const V = vertices.length;

        // Relax all edges V - 1 times
        for (let pass = 1; pass <= V - 1; pass++) {
            let updatedInPass = false;

            for (let edge of edges) {
                const u = edge.source;
                const v = edge.destination;
                const weight = edge.weight;

                if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
                    distances[v] = distances[u] + weight;
                    previous[v] = u;
                    visited.add(u);
                    visited.add(v);
                    updatedInPass = true;

                    steps.push({
                        stepIndex: steps.length + 1,
                        type: 'RELAX_EDGE',
                        currentNode: u,
                        neighborNode: v,
                        visitedSet: Array.from(visited),
                        distanceTable: { ...distances },
                        previousArray: { ...previous },
                        explainedLog: `[Pass ${pass}/${V-1}] Relaying edge (${u} ➔ ${v}): Updated distance to ${distances[v]} KM.`
                    });
                }
            }

            if (!updatedInPass) {
                steps.push({
                    stepIndex: steps.length + 1,
                    type: 'EARLY_EXIT',
                    currentNode: startNode,
                    visitedSet: Array.from(visited),
                    distanceTable: { ...distances },
                    previousArray: { ...previous },
                    explainedLog: `[Pass ${pass}/${V-1}] No distances changed during pass. Early convergence achieved!`
                });
                break;
            }
        }

        // V-th iteration check for Negative Cycle
        let hasNegativeCycle = false;
        for (let edge of edges) {
            const u = edge.source;
            const v = edge.destination;
            const weight = edge.weight;
            if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
                hasNegativeCycle = true;
                steps.push({
                    stepIndex: steps.length + 1,
                    type: 'NEGATIVE_CYCLE_DETECTED',
                    currentNode: u,
                    visitedSet: Array.from(visited),
                    distanceTable: { ...distances },
                    previousArray: { ...previous },
                    explainedLog: `⚠️ CRITICAL: Negative weight cycle detected on edge (${u} ➔ ${v})!`
                });
                break;
            }
        }

        const path = [];
        let curr = endNode;
        if (endNode && !hasNegativeCycle && (distances[endNode] !== Infinity || endNode === startNode)) {
            while (curr) {
                path.unshift(curr);
                curr = previous[curr];
            }
        }

        return {
            path: path,
            distance: endNode ? distances[endNode] : 0,
            hasNegativeCycle: hasNegativeCycle,
            allDistances: distances,
            steps: steps
        };
    }
}

module.exports = BellmanFord;
