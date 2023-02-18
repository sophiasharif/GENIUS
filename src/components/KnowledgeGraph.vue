<template>
<div>
   <span>HEY</span> hello
   <div>
    {{ knowledgeStore.test }}
   </div>
</div>
</template>

<script setup>
import {useKnowledgeStore} from '../pinia/KnowledgeStore'

const knowledgeStore = useKnowledgeStore()
console.log(knowledgeStore.graph.topics)
</script>

<style scoped>
span {
    color: red;
}
</style>