class Queue {
    constructor() {
        this.items = {};
        this.head = 0;
        this.tail = 0;
    }

    enqueue(element) {
        this.items[this.tail] = element;
        this.tail++;
    }

    dequeue() {
        if (this.isEmpty()) return null;
        const item = this.items[this.head];
        delete this.items[this.head];
        this.head++;
        return item;
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.head];
    }

    isEmpty() { return this.tail - this.head === 0; }
    size() { return this.tail - this.head; }
    toArray() {
        const arr = [];
        for (let i = this.head; i < this.tail; i++) {
            arr.push(this.items[i]);
        }
        return arr;
    }
}
