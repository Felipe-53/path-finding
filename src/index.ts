import { Graph } from "./graph";
import { shortestPathFinder } from "./dijkstra/original";

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
