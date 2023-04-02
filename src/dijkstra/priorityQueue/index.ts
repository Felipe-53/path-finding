import { Graph } from "../../graph";
import { Node, PriorityQueue } from "./PriorityQueue";

type Result = {
  previousNode: string;
  smallestDistanceFromStart: number;
};

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

export function shortestPathFinder(graph: Graph, sourceLabel: string) {
  const progressTracker = new ProgressTracker();

  progressTracker.openNode(sourceLabel, {
    previousNode: sourceLabel,
    smallestDistanceFromStart: 0,
  });

  let currentNode: Node | null;
  while ((currentNode = progressTracker.dequeue())) {
    const currentNodeLabel = currentNode.label;
    const currentVertex = graph.getVertex(currentNodeLabel);

    for (const adjacentVertex of currentVertex.adjacentVertices) {
      if (progressTracker.isClosedNode(adjacentVertex.vertex.label)) {
        continue;
      }

      const distanceToCurrentNode =
        progressTracker.getResult(currentNodeLabel)!.smallestDistanceFromStart;

      const calculatedDistance = distanceToCurrentNode + adjacentVertex.weight;

      const bestResultSoFar = progressTracker.getResult(
        adjacentVertex.vertex.label
      );

      if (!bestResultSoFar) {
        progressTracker.openNode(adjacentVertex.vertex.label, {
          previousNode: currentNodeLabel,
          smallestDistanceFromStart: calculatedDistance,
        });

        continue;
      }

      const shortestKnownDistance = bestResultSoFar.smallestDistanceFromStart;

      if (calculatedDistance < shortestKnownDistance) {
        progressTracker.updateNode(adjacentVertex.vertex.label, {
          previousNode: currentNodeLabel,
          smallestDistanceFromStart: calculatedDistance,
        });
      }
    }

    progressTracker.closeNode(currentNodeLabel);
  }

  return progressTracker.getResults();
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
