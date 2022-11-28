<template>
<svg class="icon" aria-hidden="true" :style="{'font-size':prop.size+'px'}">
    <use :href="prop.icon" :xlink:href="prop.icon"></use>
</svg>
</template>

<script setup lang="ts">
  const prop = defineProps(['size','icon'])
</script>

<style lang="scss" scoped>

</style>
