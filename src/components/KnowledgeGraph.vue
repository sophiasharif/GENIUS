<template>
  <div>
    <!-- <div>
    {{ knowledgeStore.test }}
   </div> -->
    <div ref="graph"></div>
    <button @click="addNode">Add Node</button>
  </div>
</template>

<script>
import * as d3 from "d3";

const data = {
  nodes: [
    { id: "Calculus" },
    {
      id: "Classical Mechanics",
      prerequisites: ["Calculus"],
      advanced: ["Electromagnetism"],
    },
    {
      id: "Electromagnetism",
      prerequisites: ["Calculus", "Classical Mechanics"],
    },
    { id: "Quantum Mechanics", prerequisites: ["Calculus"] },
    { id: "Thermodynamics", prerequisites: ["Calculus"] },
  ],
  links: [
    { source: "Classical Mechanics", target: "Electromagnetism" },
    { source: "Classical Mechanics", target: "Thermodynamics" },
  ],
};

export default {
  mounted() {
    this.renderGraph();
  },
  methods: {
    renderGraph() {
      const svg = d3
        .select(this.$refs.graph)
        .append("svg")
        .attr("width", 1000)
        .attr("height", 600);

      const linksMap = d3.rollup(
        data.links,
        (v) => v.length,
        (d) => d.source
      );

      const simulation = d3
        .forceSimulation(data.nodes)
        .force(
          "link",
          d3.forceLink(data.links).id((d) => d.id)
        )
        .force("charge", d3.forceManyBody().strength(-50)) // spread apart value
        .force("center", d3.forceCenter(500, 300)); // position center of graph

      const link = svg
        .append("g")
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", (d) => Math.sqrt(d.value));

      const node = svg
        .append("g")
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .attr("fill", "steelblue")
        .call(drag(simulation));

      const label = svg
        .append("g")
        .selectAll("text")
        .data(data.nodes)
        .enter()
        .append("text")
        .text((d) => d.id)
        .attr("dx", 12)
        .attr("dy", 4);

      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        label.attr("x", (d) => d.x).attr("y", (d) => d.y);
      });
    },
    addNode() {
      data.nodes.push({ id: "Test", prerequisites: ["Thermodynamics", "Electromagnetism"] });
      d3.select("svg").remove();
      this.renderGraph();
    },
  },
};

function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

// import {useKnowledgeStore} from '../pinia/KnowledgeStore'

// const knowledgeStore = useKnowledgeStore()
// console.log(knowledgeStore.graph.topics)
</script>

<style scoped>
svg {
  border: 1px solid black;
}
</style>
