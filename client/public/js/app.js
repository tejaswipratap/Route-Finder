/**
 * Route Finder Pro - Main Client Script (Final Deluxe Edition)
 */

document.addEventListener('DOMContentLoaded', async () => {
    let visualizer = null;
    let animController = null;
    const cyContainer = document.getElementById('cyContainer');

    if (cyContainer) {
        visualizer = new GraphVisualizer('cyContainer');
        animController = new AnimationController(visualizer);
    }

    const clientGraph = new Graph(false);

    // Load Graph Data from Server API
    const loadGraph = async () => {
        try {
            const res = await fetch('/api/data');
            const result = await res.json();
            if (result.success && result.data) {
                clientGraph.importJSON(result.data);
                if (visualizer) {
                    visualizer.renderGraph(result.data);
                }
            }
        } catch (err) {
            console.warn('[App] Could not fetch server graph data.', err);
        }
    };

    await loadGraph();

    // 1. Handle Route Form Submission
    const routeForm = document.getElementById('routeForm');
    if (routeForm) {
        routeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const source = document.getElementById('selectSource').value;
            const destination = document.getElementById('selectDestination').value;
            const waypoint = document.getElementById('selectWaypoint')?.value;
            const algorithm = document.getElementById('selectAlgorithm').value || 'Dijkstra';
            const trafficMultiplier = parseFloat(document.getElementById('selectTraffic')?.value || '1.0');

            if (!source || !destination) {
                showToast('Please select both Source and Destination cities.', 'danger');
                return;
            }
            if (source === destination) {
                showToast('Source and Destination cities must be different.', 'warning');
                return;
            }

            const waypoints = waypoint ? [waypoint] : [];
            const legNodes = [source, ...waypoints, destination];

            let fullPath = [];
            let totalDist = 0;
            let combinedSteps = [];

            for (let i = 0; i < legNodes.length - 1; i++) {
                const s = legNodes[i];
                const d = legNodes[i + 1];

                let solution;
                if (algorithm === 'AStar') {
                    solution = AStarAlgorithm.solve(clientGraph, s, d);
                } else if (algorithm === 'BellmanFord') {
                    solution = BellmanFordAlgorithm.solve(clientGraph, s, d);
                } else if (algorithm === 'BFS') {
                    solution = BFSAlgorithm.solve(clientGraph, s, d);
                } else if (algorithm === 'DFS') {
                    solution = DFSAlgorithm.solve(clientGraph, s, d);
                } else {
                    solution = DijkstraAlgorithm.solve(clientGraph, s, d);
                }

                if (solution.error || !solution.path || solution.path.length === 0) {
                    showToast(`No path found between ${s} and ${d}.`, 'danger');
                    return;
                }

                if (i === 0) fullPath = [...solution.path];
                else fullPath = [...fullPath, ...solution.path.slice(1)];

                totalDist += Math.round(solution.distance * trafficMultiplier);
                if (solution.steps) combinedSteps = [...combinedSteps, ...solution.steps];
            }

            const resultBanner = document.getElementById('resultBanner');
            const totalDistanceText = document.getElementById('totalDistanceText');
            const pathListText = document.getElementById('pathListText');

            if (resultBanner) resultBanner.classList.remove('d-none');
            if (totalDistanceText) totalDistanceText.innerText = `${totalDist} KM`;
            if (pathListText) pathListText.innerText = fullPath.join(' ➔ ');

            if (animController) {
                animController.loadSteps(combinedSteps, algorithm);
                animController.play();
            }

            try {
                fetch('/api/find-route', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source, destination, waypoints, algorithm, trafficMultiplier })
                });
            } catch (err) {}
        });
    }

    // 2. Compute Prim's Minimum Spanning Tree (MST)
    const btnComputeMST = document.getElementById('btnComputeMST');
    if (btnComputeMST) {
        btnComputeMST.addEventListener('click', () => {
            const startCity = document.getElementById('selectSource')?.value || null;
            const mstSolution = PrimMSTAlgorithm.solve(clientGraph, startCity);

            if (!mstSolution.mstEdges || mstSolution.mstEdges.length === 0) {
                showToast('Failed to calculate Minimum Spanning Tree.', 'danger');
                return;
            }

            const resultBanner = document.getElementById('resultBanner');
            const totalDistanceText = document.getElementById('totalDistanceText');
            const pathListText = document.getElementById('pathListText');

            if (resultBanner) resultBanner.classList.remove('d-none');
            if (totalDistanceText) totalDistanceText.innerText = `${mstSolution.totalWeight} KM`;
            if (pathListText) pathListText.innerText = `MST Network: ${mstSolution.mstEdges.length} edges connecting all cities`;

            if (animController) {
                animController.loadSteps(mstSolution.steps, 'PrimMST');
                animController.play();
            }

            showToast(`Prim's MST calculated! Minimum Total Infrastructure Network Distance: ${mstSolution.totalWeight} KM.`, 'success');
        });
    }

    // 3. Algorithm Benchmark Button Handler
    const btnRunBenchmark = document.getElementById('btnRunBenchmark');
    if (btnRunBenchmark) {
        btnRunBenchmark.addEventListener('click', async () => {
            const source = document.getElementById('selectSource')?.value;
            const destination = document.getElementById('selectDestination')?.value;
            if (!source || !destination) {
                showToast('Select Source and Destination cities before running benchmark.', 'warning');
                return;
            }

            try {
                const res = await fetch('/api/benchmark', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source, destination })
                });
                const result = await res.json();
                if (result.success && result.benchmarks) {
                    const tbody = document.getElementById('benchmarkTableBody');
                    if (tbody) {
                        tbody.innerHTML = '';
                        result.benchmarks.forEach(item => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td><strong class="text-info">${item.algorithm}</strong></td>
                                <td><span class="badge bg-warning text-dark">${item.distance} KM</span></td>
                                <td><code>${item.nodesExplored}</code></td>
                                <td><code>${item.executionTimeMs} ms</code></td>
                                <td><span class="badge ${item.nodesExplored < 15 ? 'bg-success' : 'bg-secondary'}">${item.nodesExplored < 15 ? 'High Efficient' : 'Standard'}</span></td>
                            `;
                            tbody.appendChild(tr);
                        });
                    }
                    showToast('Multi-Algorithm Benchmark calculation complete!', 'success');
                }
            } catch (err) {
                showToast('Error running algorithm benchmark.', 'danger');
            }
        });
    }

    // 4. Voice Search Integration
    const btnVoiceSearch = document.getElementById('btnVoiceSearch');
    if (btnVoiceSearch) {
        btnVoiceSearch.addEventListener('click', () => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                showToast('Speech Recognition not supported in this browser. Please use Chrome/Edge.', 'warning');
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            showToast('🎙️ Listening... Speak your route (e.g., "Find route from Delhi to Mumbai")', 'info');

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                showToast(`Heard: "${transcript}"`, 'success');

                const vertices = clientGraph.getVertices();
                let foundSource = null;
                let foundDest = null;

                vertices.forEach(v => {
                    if (transcript.includes(v.toLowerCase())) {
                        if (!foundSource) foundSource = v;
                        else if (!foundDest && v !== foundSource) foundDest = v;
                    }
                });

                if (foundSource && document.getElementById('selectSource')) {
                    document.getElementById('selectSource').value = foundSource;
                }
                if (foundDest && document.getElementById('selectDestination')) {
                    document.getElementById('selectDestination').value = foundDest;
                }

                if (foundSource && foundDest && routeForm) {
                    routeForm.dispatchEvent(new Event('submit'));
                }
            };

            recognition.onerror = () => {
                showToast('Voice recognition error or cancelled.', 'danger');
            };

            recognition.start();
        });
    }

    // 5. PDF Export Handler
    const btnExportPDF = document.getElementById('btnExportPDF');
    if (btnExportPDF) {
        btnExportPDF.addEventListener('click', () => {
            const source = document.getElementById('selectSource')?.value;
            const destination = document.getElementById('selectDestination')?.value;
            const algorithm = document.getElementById('selectAlgorithm')?.value || 'Dijkstra';
            const distText = document.getElementById('totalDistanceText')?.innerText.replace(' KM', '') || '0';
            const pathText = document.getElementById('pathListText')?.innerText.split(' ➔ ').join(',') || '';

            if (!source || !destination) {
                showToast('Select source and destination before downloading PDF.', 'warning');
                return;
            }

            window.location.href = `/api/pdf?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&distance=${distText}&path=${encodeURIComponent(pathText)}&algorithm=${algorithm}`;
        });
    }

    // 6. JSON Export Handler
    const btnExportJSON = document.getElementById('btnExportJSON');
    if (btnExportJSON) {
        btnExportJSON.addEventListener('click', () => {
            const jsonStr = JSON.stringify(clientGraph.exportJSON(), null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'RouteFinder_Graph.json';
            a.click();
            URL.revokeObjectURL(url);
            showToast('Graph exported as JSON.', 'success');
        });
    }

    // 7. Theme Switcher
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            if (visualizer) visualizer.setTheme(newTheme);
        });
    }
});

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 show shadow mb-2`;
    toast.role = 'alert';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}
