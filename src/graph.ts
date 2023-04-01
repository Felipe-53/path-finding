class Vertex {
  label: string;
  readonly adjacentVertices: {
    vertex: Vertex;
    weight: number;
  }[];

  constructor(label: string) {
    this.label = label;
    this.adjacentVertices = [];
  }

  addAdjacentVertex(vertex: Vertex, weight: number): void {
    this.adjacentVertices.push({ vertex, weight });
  }
}

class Graph {
  private vertices: Map<string, Vertex>;

  constructor() {
    this.vertices = new Map<string, Vertex>();
  }

  addVertex(label: string): void {
    if (!this.vertices.has(label)) {
      this.vertices.set(label, new Vertex(label));
    }
  }

  addEdge(from: string, to: string, weight: number): void {
    const fromVertex = this.vertices.get(from);
    const toVertex = this.vertices.get(to);

    if (!fromVertex || !toVertex)
      throw Error("Trying to add edge to un-existing node");

    for (const adjacentVertex of fromVertex.adjacentVertices) {
      if (adjacentVertex.vertex.label === to) {
        throw Error("Trying to add edge that already exists");
      }
    }

    for (const adjacentVertex of toVertex.adjacentVertices) {
      if (adjacentVertex.vertex.label === from) {
        throw Error("Trying to add edge that already exists");
      }
    }

    if (fromVertex && toVertex) {
      fromVertex.addAdjacentVertex(toVertex, weight);
      toVertex.addAdjacentVertex(fromVertex, weight);
    }
  }

  getVertex(label: string) {
    const vertex = this.vertices.get(label);
    if (!vertex) throw Error("Trying to get un-existing node");
    return vertex;
  }

  getVertices() {
    return this.vertices.values();
  }
}

export { Graph, Vertex };
