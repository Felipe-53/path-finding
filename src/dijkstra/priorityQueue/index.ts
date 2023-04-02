import { Graph } from "../../graph";
import { PriorityQueue } from "./PriorityQueue";

type Result = {
  previousNode: string;
  smallestDistanceFromStart: number;
};

export function shortestPathFinder(graph: Graph, sourceLabel: string) {
  const progressTracker = new ProgressTracker();

  progressTracker.openNode(sourceLabel, {
    previousNode: sourceLabel,
    smallestDistanceFromStart: 0,
  });

  let currentNodeLabel: string | null;
  while ((currentNodeLabel = progressTracker.dequeue())) {
    const currentNode = graph.getVertex(currentNodeLabel);

    for (const adjacentNode of currentNode.adjacentVertices) {
      const adjacentNodeLabel = adjacentNode.vertex.label;

      if (progressTracker.isClosedNode(adjacentNodeLabel)) {
        continue;
      }

      const distanceToCurrentNode =
        progressTracker.getResult(currentNodeLabel)!.smallestDistanceFromStart;

      const calculatedDistance = distanceToCurrentNode + adjacentNode.weight;

      const bestResultSoFar = progressTracker.getResult(adjacentNodeLabel);

      if (!bestResultSoFar) {
        progressTracker.openNode(adjacentNodeLabel, {
          previousNode: currentNodeLabel,
          smallestDistanceFromStart: calculatedDistance,
        });

        continue;
      }

      const shortestKnownDistance = bestResultSoFar.smallestDistanceFromStart;

      if (calculatedDistance < shortestKnownDistance) {
        progressTracker.updateNode(adjacentNodeLabel, {
          previousNode: currentNodeLabel,
          smallestDistanceFromStart: calculatedDistance,
        });
      }
    }

    progressTracker.closeNode(currentNodeLabel);
  }

  return progressTracker.getResults();
}

class ProgressTracker {
  private priorityQueue: PriorityQueue;
  private results: Map<string, Result>;
  private closedNodes: Set<string>;

  constructor() {
    this.priorityQueue = new PriorityQueue();
    this.results = new Map();
    this.closedNodes = new Set<string>();
  }

  openNode(label: string, result: Result) {
    this.results.set(label, result);
    this.priorityQueue.enqueue({
      label,
      distance: result.smallestDistanceFromStart,
    });
  }

  updateNode(label: string, result: Result) {
    this.results.set(label, result);
    this.priorityQueue.update({
      label,
      distance: result.smallestDistanceFromStart,
    });
  }

  getResult(label: string) {
    const result = this.results.get(label);
    if (result) return result;
    return null;
  }

  getResults() {
    return this.results;
  }

  dequeue() {
    return this.priorityQueue.dequeue();
  }

  isClosedNode(label: string) {
    return this.closedNodes.has(label);
  }

  closeNode(label: string) {
    this.closedNodes.add(label);
  }
}

const graph = new Graph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");
graph.addVertex("E");

graph.addEdge("A", "B", 6);
graph.addEdge("A", "D", 1);
graph.addEdge("B", "D", 2);
graph.addEdge("B", "E", 2);
graph.addEdge("B", "C", 5);
graph.addEdge("C", "E", 5);
graph.addEdge("D", "E", 1);

const results = shortestPathFinder(graph, "A");
console.log(results);
