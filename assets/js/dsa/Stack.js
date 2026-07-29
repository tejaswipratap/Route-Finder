/**
 * Last-In-First-Out (LIFO) Stack Data Structure (Built from scratch)
 * 
 * Used by Depth-First Search (DFS) for recursive branch traversal.
 * 
 * Time Complexity:
 * - Push: O(1)
 * - Pop: O(1)
 * - Peek: O(1)
 * 
 * Space Complexity: O(N)
 */

class Stack {
    constructor() {
        this.items = [];
    }

    /**
     * Push element onto stack
     */
    push(element) {
        this.items.push(element);
    }

    /**
     * Pop and return top element from stack
     */
    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }

    /**
     * View top element without removing
     */
    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }

    /**
     * Check if stack is empty
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Get stack size
     */
    size() {
        return this.items.length;
    }

    /**
     * Convert stack elements to array for state inspector UI
     */
    toArray() {
        return [...this.items];
    }

    /**
     * Clear stack
     */
    clear() {
        this.items = [];
    }
}
