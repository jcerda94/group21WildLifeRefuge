class LinkedList {
    constructor() {
      this.length = 0;
      this.first = null;
      this.last = null;
    }

    First()    
    {
        //console.log("LinkedList.First: " + JSON.stringify( this.first.data.position.x, null, 4));
        //console.log("LinkedList.First: " +                 this.first.data.position.x);
        return this.first; 
    }
    Last() { return this.last; }

    Next(node) { return node.next; }

    Append(node) {
        //console.log("LinkedList.Append: " + node.data.position.x);
        if (this.first === null) {
            node.prev = node;
            node.next = node;
            this.first = node;
            this.last = node;
        } else {
            node.prev = this.last;
            node.next = this.first;
            this.first.prev = node;
            this.last.next = node;
            this.last = node;
        }
        this.length++;
    }

    InsertAfter(node, newNode) {
        newNode.prev = node;
        newNode.next = node.next;
        node.next.prev = newNode;
        node.next = newNode;
        if (newNode.prev === this.last) { this.last = newNode; }
        this.length++;
    }

    Remove(node) {
        if (this.length > 1) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
            if (node === this.first) { this.first = node.next; }
            if (node === this.last) { this.last = node.prev; }
        } else {
            this.first = null;
            this.last = null;
        }
        node.prev = null;
        node.next = null;
        this.length--;
    }
}
export class Node {
    constructor(data) {
        this.prev = null; 
        this.next = null;
        this.data = data;
    }
}  


const grassLinkedList = new LinkedList();

export const getGrassLinkedList = () => {
      return grassLinkedList;
    };
