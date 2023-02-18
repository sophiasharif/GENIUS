import { defineStore } from "pinia";

class PhysicsTopic {
  constructor(name, prerequisites = [], advancedTopics = []) {
    this.name = name;
    this.prerequisites = prerequisites;
    this.advancedTopics = advancedTopics;
  }
}

class PhysicsGraph {
  constructor() {
    this.topics = new Map();
  }

  addTopic(name, prerequisites = [], advancedTopics = []) {
    if (!this.topics.has(name)) {
      this.topics.set(
        name,
        new PhysicsTopic(name, prerequisites, advancedTopics)
      );
    }
  }

  addPrerequisite(topicName, prerequisiteName) {
    if (this.topics.has(topicName) && this.topics.has(prerequisiteName)) {
      this.topics.get(topicName).prerequisites.push(prerequisiteName);
    }
  }

  addAdvancedTopic(topicName, advancedTopicName) {
    if (this.topics.has(topicName) && this.topics.has(advancedTopicName)) {
      this.topics.get(topicName).advancedTopics.push(advancedTopicName);
    }
  }

  getTopic(name) {
    return this.topics.get(name);
  }

  getTopics() {
    return this.topics.values();
  }
}

let knowledgeGraph = new PhysicsGraph();
knowledgeGraph.addTopic('Physics', ['Mechanics', 'Electomagnetism', 'Special Relativity'], [])
knowledgeGraph.addTopic('Mechanics', ['Projectile Motion', 'Newton\'s Second Law', 'Energy'], ['Physics'])

export const useKnowledgeStore = defineStore("knowledge", {
  state: () => {
    return {
      test: "hello",
      graph: knowledgeGraph
    };
  },
});
