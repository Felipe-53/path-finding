interface Node {
  label: string;
  cost: number;
}

class PriorityQueue {
  private items: Node[];

  constructor() {
    this.items = [];
  }

  enqueue(node: Node) {
    const nodeCost = node.cost;

    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (nodeCost < this.items[i].cost) {
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
    return result;
  }
}
