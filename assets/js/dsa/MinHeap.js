/**
 * Priority Queue using Min Heap Data Structure (Built from scratch)
 * 
 * Used by Dijkstra's algorithm for O(log V) vertex extraction.
 * 
 * Time Complexity:
 * - Insert: O(log N)
 * - Extract Min: O(log N)
 * - Decrease Key: O(log N)
 * - Peek: O(1)
 * 
 * Space Complexity: O(N)
 */

class MinHeap {
    constructor() {
        // Heap storage array of { element: string, priority: number }
        this.heap = [];
        // Map element -> index in heap array for fast lookup in decreaseKey O(log N)
        this.positionMap = new Map();
    }

    /**
     * Helper to swap elements in heap and update position map
     */
    _swap(i, j) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;

        this.positionMap.set(this.heap[i].element, i);
        this.positionMap.set(this.heap[j].element, j);
    }

    /**
     * Bubble up element at index i to restore min-heap property
     */
    _heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].priority < this.heap[parentIndex].priority) {
                this._swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    /**
     * Sink down element at index i to restore min-heap property
     */
    _heapifyDown(index) {
        const length = this.heap.length;
        while (true) {
            let smallest = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;

            if (left < length && this.heap[left].priority < this.heap[smallest].priority) {
                smallest = left;
            }
            if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
                smallest = right;
            }

            if (smallest !== index) {
                this._swap(index, smallest);
                index = smallest;
            } else {
                break;
            }
        }
    }

    /**
     * Insert a new element with given priority
     */
    insert(element, priority) {
        if (this.positionMap.has(element)) {
            this.decreaseKey(element, priority);
            return;
        }

        const node = { element, priority };
        this.heap.push(node);
        const index = this.heap.length - 1;
        this.positionMap.set(element, index);
        this._heapifyUp(index);
    }

    /**
     * Extract and return element with minimum priority
     */
    extractMin() {
        if (this.isEmpty()) return null;

        const minNode = this.heap[0];
        const lastNode = this.heap.pop();
        this.positionMap.delete(minNode.element);

        if (this.heap.length > 0) {
            this.heap[0] = lastNode;
            this.positionMap.set(lastNode.element, 0);
            this._heapifyDown(0);
        }

        return minNode;
    }

    /**
     * Decrease key priority of existing element
     */
    decreaseKey(element, newPriority) {
        const index = this.positionMap.get(element);
        if (index === undefined) return;

        if (newPriority < this.heap[index].priority) {
            this.heap[index].priority = newPriority;
            this._heapifyUp(index);
        }
    }

    /**
     * Peek minimum element without removing
     */
    peek() {
        return this.isEmpty() ? null : this.heap[0];
    }

    /**
     * Check if min heap is empty
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * Get number of items in heap
     */
    size() {
        return this.heap.length;
    }

    /**
     * Returns array representation for DSA state visualizer
     */
    getHeapArray() {
        return this.heap.map(node => ({ element: node.element, priority: node.priority }));
    }
}
