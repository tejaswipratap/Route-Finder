/**
 * Step-by-Step Playback Animation Controller (Enhanced Edition)
 * 
 * Features:
 * - Live Pseudocode Line Execution Highlighting
 * - Web Audio API Sound Effects
 * - Speech Synthesis Voice Narrator
 */

class AnimationController {
    constructor(visualizer) {
        this.visualizer = visualizer;
        this.steps = [];
        this.currentStepIndex = 0;
        this.isPlaying = false;
        this.timer = null;
        this.speed = 1000;
        this.algorithm = 'Dijkstra';
        this.audioEnabled = true;
        this.narratorEnabled = false;

        // Initialize Web Audio Context
        this.audioCtx = null;

        this._bindUI();
    }

    _initAudio() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.audioCtx = new AudioContext();
        }
    }

    playTone(freq = 440, type = 'sine', duration = 0.15) {
        if (!this.audioEnabled) return;
        try {
            this._initAudio();
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
            gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + duration);
        } catch (err) {}
    }

    speakText(text) {
        if (!this.narratorEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        window.speechSynthesis.speak(utterance);
    }

    _bindUI() {
        this.btnPlay = document.getElementById('btnPlay');
        this.btnPause = document.getElementById('btnPause');
        this.btnStepForward = document.getElementById('btnStepForward');
        this.btnStepBackward = document.getElementById('btnStepBackward');
        this.btnReset = document.getElementById('btnReset');
        this.speedSlider = document.getElementById('speedSlider');

        this.heapContainer = document.getElementById('heapContainer');
        this.visitedContainer = document.getElementById('visitedContainer');
        this.distanceTableBody = document.getElementById('distanceTableBody');
        this.stepLogText = document.getElementById('stepLogText');
        this.stepProgressText = document.getElementById('stepProgressText');
        this.pseudocodeContainer = document.getElementById('pseudocodeContainer');

        this.toggleAudioBtn = document.getElementById('toggleAudioBtn');
        this.toggleNarratorBtn = document.getElementById('toggleNarratorBtn');

        if (this.btnPlay) this.btnPlay.addEventListener('click', () => this.play());
        if (this.btnPause) this.btnPause.addEventListener('click', () => this.pause());
        if (this.btnStepForward) this.btnStepForward.addEventListener('click', () => this.stepForward());
        if (this.btnStepBackward) this.btnStepBackward.addEventListener('click', () => this.stepBackward());
        if (this.btnReset) this.btnReset.addEventListener('click', () => this.reset());

        if (this.toggleAudioBtn) {
            this.toggleAudioBtn.addEventListener('click', () => {
                this.audioEnabled = !this.audioEnabled;
                this.toggleAudioBtn.classList.toggle('btn-success', this.audioEnabled);
                this.toggleAudioBtn.classList.toggle('btn-outline-secondary', !this.audioEnabled);
            });
        }

        if (this.toggleNarratorBtn) {
            this.toggleNarratorBtn.addEventListener('click', () => {
                this.narratorEnabled = !this.narratorEnabled;
                this.toggleNarratorBtn.classList.toggle('btn-info', this.narratorEnabled);
                this.toggleNarratorBtn.classList.toggle('btn-outline-secondary', !this.narratorEnabled);
            });
        }

        if (this.speedSlider) {
            this.speedSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.speed = 1500 / val;
                if (this.isPlaying) {
                    this.pause();
                    this.play();
                }
            });
        }
    }

    getPseudocode(algo) {
        if (algo === 'AStar') {
            return [
                "1: gScore[start] = 0, fScore[start] = h(start)",
                "2: minHeap.insert(start, fScore[start])",
                "3: while minHeap is not empty:",
                "4:   curr = minHeap.extractMin()",
                "5:   if curr == target: return path",
                "6:   for neighbor in graph.getNeighbors(curr):",
                "7:     tentativeG = gScore[curr] + weight",
                "8:     if tentativeG < gScore[neighbor]:",
                "9:       gScore[neighbor] = tentativeG",
                "10:      fScore[neighbor] = gScore + h(neighbor)",
                "11:      minHeap.insert(neighbor, fScore)"
            ];
        } else if (algo === 'BellmanFord') {
            return [
                "1: dist[start] = 0, all others = ∞",
                "2: for pass = 1 to V - 1:",
                "3:   for each edge (u, v) in Graph:",
                "4:     if dist[u] + weight < dist[v]:",
                "5:       dist[v] = dist[u] + weight",
                "6:       prev[v] = u",
                "7: for each edge (u, v) in Graph:",
                "8:   if dist[u] + weight < dist[v]:",
                "9:     return 'Negative Cycle Detected!'"
            ];
        } else if (algo === 'PrimMST') {
            return [
                "1: inMST = { startNode }",
                "2: minHeap.insert(outgoingEdges(startNode))",
                "3: while minHeap not empty and inMST.size < V:",
                "4:   edge(u, v) = minHeap.extractMin()",
                "5:   if v in inMST: continue",
                "6:   add v to inMST, add edge(u, v) to MST",
                "7:   for neighbor of v not in inMST:",
                "8:     minHeap.insert(edge(v, neighbor))"
            ];
        } else {
            // Default Dijkstra
            return [
                "1: dist[source] = 0, all others = ∞",
                "2: minHeap.insert(source, 0)",
                "3: while minHeap is not empty:",
                "4:   curr = minHeap.extractMin()",
                "5:   mark curr as Visited",
                "6:   if curr == destination: break",
                "7:   for neighbor in graph.getNeighbors(curr):",
                "8:     newDist = dist[curr] + weight",
                "9:     if newDist < dist[neighbor]:",
                "10:      dist[neighbor] = newDist",
                "11:      minHeap.insert(neighbor, newDist)"
            ];
        }
    }

    renderPseudocode(algo, stepType) {
        if (!this.pseudocodeContainer) return;
        const codeLines = this.getPseudocode(algo);

        let activeLineIndex = 0;
        if (stepType === 'INIT') activeLineIndex = 1;
        else if (stepType === 'EXTRACT_MIN' || stepType === 'DEQUEUE' || stepType === 'POP_STACK') activeLineIndex = 3;
        else if (stepType === 'EXAMINE_NEIGHBOR') activeLineIndex = 6;
        else if (stepType === 'RELAX_EDGE' || stepType === 'ENQUEUE' || stepType === 'PUSH_STACK' || stepType === 'ADD_MST_EDGE') activeLineIndex = 8;
        else if (stepType === 'DESTINATION_REACHED' || stepType === 'COMPLETE') activeLineIndex = 4;

        this.pseudocodeContainer.innerHTML = '';
        codeLines.forEach((line, idx) => {
            const div = document.createElement('div');
            div.className = `font-monospace small px-2 py-1 rounded ${idx === activeLineIndex ? 'bg-primary text-white fw-bold shadow-sm' : 'text-muted'}`;
            div.innerText = line;
            this.pseudocodeContainer.appendChild(div);
        });
    }

    loadSteps(steps, algorithm = 'Dijkstra') {
        this.pause();
        this.steps = steps || [];
        this.algorithm = algorithm;
        this.currentStepIndex = 0;
        this.renderCurrentStep();
    }

    play() {
        if (this.steps.length === 0) return;
        if (this.currentStepIndex >= this.steps.length - 1) {
            this.currentStepIndex = 0;
        }

        this.isPlaying = true;
        this._updateControlsUI();

        this.timer = setInterval(() => {
            if (this.currentStepIndex < this.steps.length - 1) {
                this.currentStepIndex++;
                this.renderCurrentStep();
            } else {
                this.pause();
            }
        }, this.speed);
    }

    pause() {
        this.isPlaying = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this._updateControlsUI();
    }

    stepForward() {
        this.pause();
        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            this.renderCurrentStep();
        }
    }

    stepBackward() {
        this.pause();
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.renderCurrentStep();
        }
    }

    reset() {
        this.pause();
        this.currentStepIndex = 0;
        this.renderCurrentStep();
        if (this.visualizer) this.visualizer.resetHighlights();
    }

    _updateControlsUI() {
        if (this.btnPlay) this.btnPlay.disabled = this.isPlaying;
        if (this.btnPause) this.btnPause.disabled = !this.isPlaying;
    }

    renderCurrentStep() {
        if (this.steps.length === 0) return;

        const step = this.steps[this.currentStepIndex];
        if (!step) return;

        // Audio & Voice Narration
        if (step.type === 'EXTRACT_MIN') this.playTone(523.25, 'triangle');
        else if (step.type === 'RELAX_EDGE') this.playTone(659.25, 'sine');
        else if (step.type === 'COMPLETE') this.playTone(880, 'square', 0.4);

        if (step.explainedLog) this.speakText(step.explainedLog);

        // Pseudocode active line
        this.renderPseudocode(this.algorithm, step.type);

        // Cytoscape Highlights
        const path = step.type === 'COMPLETE' ? step.highlightNodes : [];
        if (this.visualizer) {
            this.visualizer.setHighlights(
                step.currentNode,
                step.visitedSet,
                step.activeEdge,
                path
            );
        }

        // Progress Counter
        if (this.stepProgressText) {
            this.stepProgressText.innerText = `Step ${this.currentStepIndex + 1} of ${this.steps.length}`;
        }

        // Step Log
        if (this.stepLogText) {
            this.stepLogText.innerText = step.explainedLog || 'Executing algorithm iteration...';
        }

        // Visited Set
        if (this.visitedContainer) {
            this.visitedContainer.innerHTML = '';
            if (Array.isArray(step.visitedSet) && step.visitedSet.length > 0) {
                step.visitedSet.forEach(v => {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-primary me-1 mb-1 shadow-sm fs-6';
                    badge.innerText = v;
                    this.visitedContainer.appendChild(badge);
                });
            } else {
                this.visitedContainer.innerHTML = '<span class="text-muted small">None visited yet</span>';
            }
        }

        // MinHeap / Queue / Stack State
        if (this.heapContainer) {
            this.heapContainer.innerHTML = '';
            if (step.minHeapState && step.minHeapState.length > 0) {
                step.minHeapState.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'd-inline-block text-center border rounded p-1 me-1 mb-1 bg-dark text-light';
                    card.style.minWidth = '50px';
                    card.innerHTML = `<div class="fw-bold text-info small">${item.element}</div><div class="text-warning small">${typeof item.priority === 'number' ? item.priority.toFixed(1) : item.priority}</div>`;
                    this.heapContainer.appendChild(card);
                });
            } else if (step.queueState && step.queueState.length > 0) {
                step.queueState.forEach(item => {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-info me-1 mb-1 fs-6';
                    badge.innerText = item;
                    this.heapContainer.appendChild(badge);
                });
            } else if (step.stackState && step.stackState.length > 0) {
                step.stackState.forEach(item => {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-warning text-dark me-1 mb-1 fs-6';
                    badge.innerText = item;
                    this.heapContainer.appendChild(badge);
                });
            } else {
                this.heapContainer.innerHTML = '<span class="text-muted small">Data structure empty</span>';
            }
        }

        // Distance Table
        if (this.distanceTableBody && step.distanceTable) {
            this.distanceTableBody.innerHTML = '';
            for (let [city, dist] of Object.entries(step.distanceTable)) {
                const tr = document.createElement('tr');
                const isCurrent = step.currentNode === city;
                if (isCurrent) tr.className = 'table-danger fw-bold';

                const prev = step.previousArray ? (step.previousArray[city] || '-') : '-';
                const distText = dist === Infinity ? '∞' : `${typeof dist === 'number' ? dist.toFixed(1) : dist} KM`;

                tr.innerHTML = `
                    <td>${city}</td>
                    <td><span class="badge ${dist === Infinity ? 'bg-secondary' : 'bg-success'}">${distText}</span></td>
                    <td>${prev}</td>
                `;
                this.distanceTableBody.appendChild(tr);
            }
        }
    }
}
