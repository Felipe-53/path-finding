import { Graph } from "../../graph";
import { Node, PriorityQueue } from "./PriorityQueue";

type Result = {
  previousNode: string;
  smallestDistanceFromStart: number;
};

export function shortestPathFinder(graph: Graph, sourceLabel: string) {
  const openNodes = new PriorityQueue();
  const results = new Map<string, Result>();
  const closedNodes = new Set<string>();

  const vertex = graph.getVertex(sourceLabel);

  openNodes.enqueue({
    label: vertex.label,
    distance: 0,
  });

  results.set(sourceLabel, {
    previousNode: sourceLabel,
    smallestDistanceFromStart: 0,
  });

  let currentNode: Node | null;
  while ((currentNode = openNodes.dequeue())) {
    const currentNodeLabel = currentNode.label;
    const currentVertex = graph.getVertex(currentNodeLabel);

    for (const adjacentVertex of currentVertex.adjacentVertices) {
      if (closedNodes.has(adjacentVertex.vertex.label)) {
        continue;
      }

      const distanceToCurrentNode =
        results.get(currentNodeLabel)!.smallestDistanceFromStart;

      const calculatedDistance = distanceToCurrentNode + adjacentVertex.weight;

      const bestResultSoFar = results.get(adjacentVertex.vertex.label);

      if (!bestResultSoFar) {
        results.set(adjacentVertex.vertex.label, {
          previousNode: currentNodeLabel,
          smallestDistanceFromStart: calculatedDistance,
        });

        openNodes.enqueue({
          distance: calculatedDistance,
          label: adjacentVertex.vertex.label,
        });

        continue;
      }

      const shortestKnownDistance = bestResultSoFar.smallestDistanceFromStart;

      if (calculatedDistance < shortestKnownDistance) {
        results.set(adjacentVertex.vertex.label, {
          previousNode: currentNodeLabel,
          smallestDistanceFromStart: calculatedDistance,
        });

        openNodes.update({
          label: adjacentVertex.vertex.label,
          distance: calculatedDistance,
        });
      }
    }

    closedNodes.add(currentNodeLabel);
  }

  return results;
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
