/**
 * First-In-First-Out (FIFO) Queue Data Structure (Built from scratch)
 * 
 * Used by Breadth-First Search (BFS) for level-order traversal.
 * 
 * Time Complexity:
 * - Enqueue: O(1)
 * - Dequeue: O(1)
 * - Peek: O(1)
 * 
 * Space Complexity: O(N)
 */

class Queue {
    constructor() {
        this.items = {};
        this.head = 0;
        this.tail = 0;
    }

    /**
     * Add element to back of queue
     */
    enqueue(element) {
        this.items[this.tail] = element;
        this.tail++;
    }

    /**
     * Remove and return element from front of queue
     */
    dequeue() {
        if (this.isEmpty()) return null;
        const item = this.items[this.head];
        delete this.items[this.head];
        this.head++;
        return item;
    }

    /**
     * View front element without removing
     */
    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.head];
    }

    /**
     * Check if queue is empty
     */
    isEmpty() {
        return this.tail - this.head === 0;
    }

    /**
     * Get queue size
     */
    size() {
        return this.tail - this.head;
    }

    /**
     * Convert queue elements to array for state inspector UI
     */
    toArray() {
        const arr = [];
        for (let i = this.head; i < this.tail; i++) {
            arr.push(this.items[i]);
        }
        return arr;
    }

    /**
     * Clear queue
     */
    clear() {
        this.items = {};
        this.head = 0;
        this.tail = 0;
    }
}
