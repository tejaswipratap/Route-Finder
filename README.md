# Route Finder Pro – Shortest Path Visualizer

A production-grade, University Summer PEP & Placement-ready Full-Stack Web Application designed to solve real-world transportation routing problems using **Graph Data Structures** and **6 Graph Algorithms** (Dijkstra, A* Search, Bellman-Ford, Prim's Minimum Spanning Tree, BFS, DFS) with an interactive **Cytoscape.js** animation engine, real-time traffic multiplier simulator, multi-stop routing, voice search, live pseudocode line inspector, Web Audio sound FX, voice narration, and live DSA state inspection.

---

## Table of Contents
1. [Problem Statement](#problem-statement)
2. [Objectives](#objectives)
3. [Technology Stack](#technology-stack)
4. [DSA Specifications & Complexity Analysis](#dsa-specifications--complexity-analysis)
5. [Complete Features List](#complete-features-list)
6. [System Architecture](#system-architecture)
7. [Mermaid System Diagrams](#mermaid-system-diagrams)
   - [ER Diagram](#1-entity-relationship-er-diagram)
   - [Use Case Diagram](#2-use-case-diagram)
   - [Class Diagram](#3-class-diagram)
   - [Sequence Diagram](#4-sequence-diagram)
   - [DFD Level 0](#5-dfd-level-0)
   - [DFD Level 1](#6-dfd-level-1)
   - [Algorithmic Flowchart](#7-algorithmic-flowchart)
8. [Database Schema](#database-schema)
9. [Installation & Setup Guide](#installation--setup-guide)
10. [API Endpoints](#api-endpoints)

---

## Problem Statement
Finding optimal shortest paths and minimum spanning infrastructure across highway transportation networks is a fundamental problem in navigation logistics. Beginners often rely on black-box graph libraries without understanding the underlying mechanics of priority queue min-heaps, heuristic cost evaluations, edge relaxations, and negative cycle checks.

**Route Finder Pro** addresses this gap by implementing **all core graph data structures and pathfinding algorithms manually from scratch**, providing a visual step-by-step playback engine that animates nodes, edges, Min-Heap arrays, distance tables, visited sets, active pseudocode execution lines, and voice narration in real-time.

---

## Technology Stack

- **Backend**: Node.js & Express.js (MVC Pattern)
- **Frontend**: EJS (Embedded JavaScript), HTML5, CSS3, Bootstrap 5
- **Database**: MongoDB (Mongoose ORM) with local/Atlas connection & automatic 20-city seeder
- **Visualization Engine**: Cytoscape.js (Interactive high-DPI canvas)
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs`
- **PDF Generation**: PDFKit
- **Speech API**: Web Speech API (`webkitSpeechRecognition` & `window.speechSynthesis`)
- **Audio Synthesizer**: Web Audio API

---

## DSA Specifications & Complexity Analysis

All 6 algorithms and supporting data structures are implemented manually from scratch in JS:

| Data Structure / Algorithm | Underlying Representation | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- |
| **Graph** | Adjacency List (Map of Node ➔ Edges) | Add Node: $O(1)$<br>Add Edge: $O(1)$ | $O(V + E)$ |
| **Min-Heap Priority Queue** | Binary Heap Array + Position Map | Insert: $O(\log V)$<br>Extract-Min: $O(\log V)$ | $O(V)$ |
| **Queue** | FIFO Map Object (`head`, `tail`) | Enqueue: $O(1)$<br>Dequeue: $O(1)$ | $O(V)$ |
| **Stack** | LIFO Dynamic Array | Push: $O(1)$<br>Pop: $O(1)$ | $O(V)$ |
| **Dijkstra's Algorithm** | Min-Heap + Adjacency List | **$O((V + E) \log V)$** | $O(V + E)$ |
| **A* (A-Star) Search** | Min-Heap + Euclidean Heuristic $h(n)$ | **$O((V + E) \log V)$** | $O(V)$ |
| **Bellman-Ford Algorithm** | Edge List + Pass Relaxations | **$O(V \cdot E)$** | $O(V)$ |
| **Prim's Minimum Spanning Tree**| Min-Heap + Adjacency List | **$O((V + E) \log V)$** | $O(V + E)$ |
| **Breadth-First Search (BFS)**| FIFO Queue + Adjacency List | **$O(V + E)$** | $O(V)$ |
| **Depth-First Search (DFS)**  | LIFO Stack + Adjacency List | **$O(V + E)$** | $O(V)$ |

---

## Complete Features List

1. **6 Manual Graph Algorithms**: Dijkstra, A* Search, Bellman-Ford, Prim's MST, BFS, and DFS.
2. **Live Pseudocode Execution Line Inspector**: Highlights the active line of pseudocode in real-time during step animation.
3. **Web Audio Sound Effects & Voice Narrator**: Synthesizes audio tones for step transitions and voice narration explaining algorithm steps.
4. **Traffic & Weather Simulator**: Dynamically scales edge weights ($1.0\times$ Clear, $1.5\times$ Rain, $2.0\times$ Traffic Jam, $3.0\times$ Storm).
5. **Multi-Stop Route Planning**: Computes optimal chained route legs through intermediate waypoint cities.
6. **Side-by-Side Algorithm Benchmarking**: Concurrently executes Dijkstra, A*, Bellman-Ford, BFS, and DFS to measure nodes explored, latency (ms), and distance.
7. **Voice Command Search Integration**: Web Speech API voice command recognition for populating cities.
8. **Admin Panel**: JWT authenticated login (`admin`/`admin123`), Manage Cities CRUD, Manage Roads CRUD, Random Graph Generator, and Graph Metrics.

---

## Installation & Setup Guide

### Step 1: Navigate to Project Directory
```bash
cd "c:/Users/Asus/OneDrive/Documents/Desktop/ROUTE FINDER"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Application
Development mode:
```bash
npm run dev
```

Open browser at: **`http://localhost:3000`**

*Default Admin Credentials: Username: `admin` | Password: `admin123`*
