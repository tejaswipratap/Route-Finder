/**
 * Client MinHeap Priority Queue Data Structure
 */

class PriorityQueue {
    constructor() {
        this.heap = [];
        this.positionMap = new Map();
    }

    _swap(i, j) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
        this.positionMap.set(this.heap[i].element, i);
        this.positionMap.set(this.heap[j].element, j);
    }

    _heapifyUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.heap[index].priority < this.heap[parent].priority) {
                this._swap(index, parent);
                index = parent;
            } else break;
        }
    }

    _heapifyDown(index) {
        const len = this.heap.length;
        while (true) {
            let smallest = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;
            if (left < len && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
            if (right < len && this.heap[right].priority < this.heap[smallest].priority) smallest = right;
            if (smallest !== index) {
                this._swap(index, smallest);
                index = smallest;
            } else break;
        }
    }

    insert(element, priority) {
        if (this.positionMap.has(element)) {
            this.decreaseKey(element, priority);
            return;
        }
        this.heap.push({ element, priority });
        const index = this.heap.length - 1;
        this.positionMap.set(element, index);
        this._heapifyUp(index);
    }

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

    decreaseKey(element, newPriority) {
        const index = this.positionMap.get(element);
        if (index === undefined) return;
        if (newPriority < this.heap[index].priority) {
            this.heap[index].priority = newPriority;
            this._heapifyUp(index);
        }
    }

    isEmpty() { return this.heap.length === 0; }
    size() { return this.heap.length; }
    getHeapArray() { return this.heap.map(n => ({ element: n.element, priority: n.priority })); }
}
