<template>
  <div>
    <!-- <div>
    {{ knowledgeStore.test }}
   </div> -->
    <div v-if="selectedNode" id="modal">
      <div class="modal-content">
        <span class="close" @click="selectedNode = null">&times;</span>
        <h2>{{ selectedNode.id }}</h2>
        <p>
          Prerequisites:
          {{
            selectedNode.prerequisites
              ? selectedNode.prerequisites.join(", ")
              : "none"
          }}
        </p>
        <p>Mastery: {{ selectedNode.mastery }}</p>
      </div>
    </div>
    <div id="wrapper">
      <form @submit="onSubmit" class="add-form">
        <div class="form-control">
          <label> Topic </label>
          <input
            type="text"
            v-model="text"
            name="text"
            placeholder="Add Topic"
          />
        </div>
        <div class="form-control">
          <label> Prerequisites </label>
          <input
            type="text"
            v-model="prereqs"
            name="prereqs"
            placeholder="Add Prerequisites"
          />
        </div>
        <div class="form-control">
          <label> Link </label>
          <input
            type="text"
            v-model="link"
            name="link"
            placeholder="Add Link"
          />
        </div>
        <div class="form-control">
          <label> Mastery Level </label>
          <input
            type="float"
            v-model="mastery"
            name="mastery"
            placeholder="Add Mastery Level"
          />
        </div>
        <button id="btn" @click="addNode">Add Node</button>
      </form>
    </div>

    <div ref="graph"></div>
    <button @click="addNode">Add Node</button>
  </div>
</template>

<script>
import * as d3 from "d3";

const data = {
  nodes: [
    { id: "Calculus", mastery: 0.7, prerequisites: [] },
    {
      id: "Classical Mechanics",
      mastery: 0.5,
      prerequisites: ["Calculus"],
    },
    {
      id: "Electromagnetism",
      mastery: 0.6,
      prerequisites: ["Calculus", "Classical Mechanics"],
    },
    { id: "Quantum Mechanics", mastery: 0, prerequisites: ["Calculus"] },
    { id: "Thermodynamics", mastery: 0, prerequisites: ["Calculus"] },
  ],
  links: [],
};

const masteryColors = [
  "#D3D3D3",
  "#ff6863",
  "#ff964f",
  "#ffb347",
  "#fdfd95",
  "#90EE90",
  "#005C29",
  "#013220",
];
function getColorFromMastery(mastery) {
  const index = Math.floor(mastery * masteryColors.length);
  const color = masteryColors[index];
  return color;
}

export default {
  mounted() {
    this.renderGraph();
  },
  data() {
    return {
      selectedNode: null,
      text: "",
      prereqs: "",
      link: "",
      mastery: "",
    };
  },
  methods: {
    renderGraph() {
      this.loopThruPrereqs();
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
        .force("charge", d3.forceManyBody().strength(-5000)) // spread apart value
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
        .attr("fill", (d) => getColorFromMastery(d.mastery))
        .call(drag(simulation));

      const label = svg
        .append("g")
        .selectAll("text")
        .data(data.nodes)
        .enter()
        .append("text")
        .text((d) => d.id)
        .attr("dx", 12)
        .attr("dy", 4)
        .on("click", (event, node) => {
          this.displayNodeData(node);
        });

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
      data.nodes.push({
        id: "Test",
        prerequisites: ["Thermodynamics", "Electromagnetism"],
      });
      d3.select("svg").remove();
      this.renderGraph();
    },
    loopThruPrereqs() {
      data.links = [];
      for (let i = 0; i < data.nodes.length; i = i + 1) {
        for (let j = 0; j < data.nodes[i].prerequisites.length; j = j + 1) {
          data.links.push({
            source: data.nodes[i].id,
            target: data.nodes[i].prerequisites[j],
          });
        }
      }
    },
    onsubmit(e) {
      e.preventDefault();

      if (!this.text || !this.prereqs || !this.link || !this.mastery) {
        alert("Please fill out all sections ");
        return;
      }

      const newNode = {
        text: this.text,
        prereqs: this.prereqs,
        link: this.link,
        mastery: this.mastery,
      };
      console.log(newNode);
      (this.text = ""), (this.prereqs = "");
      (this.link = ""), (this.mastery = "");
    },

    displayNodeData(node) {
      this.selectedNode = node;
      console.log(this.selectedNode);
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
</script>

<style scoped>
svg {
  border: 1px solid black;
}
#modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  max-width: 100%;
  height: 600px;
  max-height: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
.modal-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

span.close {
  position: fixed;
  top: 0;
  right: 0;
  padding: 10px 20px;
  font-size: 30px;
}
#wrapper {
  width: 300px;
  height: auto;
  display: flex;
  justify-content: center;
}
.form-control {
  margin: 5px;
}
.form-control input {
  margin: 5px;
  width: 100%;
  padding-top: 3px;
  padding-bottom: 3px;
}
.form-control label {
  letter-spacing: 1px;
  font-weight: 500;
}
#btn {
  margin: 5px;
  width: 50%;
  letter-spacing: 1px;
  border-radius: 7px;
  padding: 5px;
  background-color: rgb(0, 75, 137);
  border: none;
  box-shadow: 3px 5px rgb(65, 65, 65);
  color: white;
  font-weight: 800;
  transition: all 0.2s;
  margin-top: 18px;
}
#btn:hover {
  box-shadow: 1px 2px rgb(65, 65, 65);
  transform: translate(1px, 2px);
}
</style>
