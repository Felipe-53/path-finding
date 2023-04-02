import { Graph } from "../../graph";

export function shortestPathFinder(graph: Graph, source: string) {
  const unvisitedNodes = initialUnvisitedNodesSet(graph);

  const results = new Map<string, Result>();

  results.set(source, {
    smallestDistanceFromStart: 0,
    previousNode: source,
  });

  while (unvisitedNodes.size !== 0) {
    const currentNodeLabel = getUnvisitedNodeWithSmallestKnownDistance(
      unvisitedNodes,
      results
    );

    const currentNode = graph.getVertex(currentNodeLabel);

    const currentNodeData = results.get(currentNode.label)!;

    for (const adjacentVertex of currentNode.adjacentVertices) {
      const calculatedDistance =
        currentNodeData.smallestDistanceFromStart + adjacentVertex.weight;

      const record = results.get(adjacentVertex.vertex.label);

      if (!record) {
        results.set(adjacentVertex.vertex.label, {
          smallestDistanceFromStart: calculatedDistance,
          previousNode: currentNode.label,
        });
      } else {
        if (calculatedDistance < record.smallestDistanceFromStart) {
          results.set(adjacentVertex.vertex.label, {
            smallestDistanceFromStart: calculatedDistance,
            previousNode: currentNode.label,
          });
        }
      }
    }

    unvisitedNodes.delete(currentNode.label);
  }

  return results;
}

type Result = {
  previousNode: string;
  smallestDistanceFromStart: number;
};

function initialUnvisitedNodesSet(graph: Graph) {
  const unvisitedNodes = new Set<string>();

  for (const vertex of graph.getVertices()) {
    unvisitedNodes.add(vertex.label);
  }

  return unvisitedNodes;
}

function getUnvisitedNodeWithSmallestKnownDistance(
  unvisitedNodes: Set<string>,
  results: Map<string, Result>
) {
  let shortestDistance = Number.POSITIVE_INFINITY;
  let vertex = null;

  for (let vertexLabel of unvisitedNodes) {
    const distance = results.get(vertexLabel)?.smallestDistanceFromStart;
    if (typeof distance !== "number") continue;
    if (distance < shortestDistance) {
      shortestDistance = distance!;
      vertex = vertexLabel;
    }
  }

  return vertex!;
}
