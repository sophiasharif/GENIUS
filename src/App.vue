<template>
  <div id="wrapper">

    <KnowledgeGraph msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import KnowledgeGraph from './components/KnowledgeGraph.vue'

export default {
  name: 'App',
  components: {
    KnowledgeGraph
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
