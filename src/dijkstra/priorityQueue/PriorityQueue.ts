export interface Node {
  label: string;
  distance: number;
}

export class PriorityQueue {
  private items: Node[];

  constructor() {
    this.items = [];
  }

  enqueue(node: Node) {
    const nodeCost = node.distance;

    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (nodeCost < this.items[i].distance) {
        this.items.splice(i, 0, node);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(node);
    }
  }

  dequeue() {
    const result = this.items.shift();
    if (!result) return null;
    return result.label;
  }

  update(node: Node) {
    for (let i = 0; i < this.items.length; i++) {
      if (node.label === this.items[i].label) {
        this.items.splice(i, 1);
        this.enqueue(node);
        break;
      }
    }
  }
}
