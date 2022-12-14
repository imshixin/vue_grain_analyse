<template>
  <div class="dist-chart" :id="chartName" ref="distChart">

  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { isNil } from 'lodash';
import { ref, onMounted, watch, nextTick, inject, Ref } from 'vue';
import type { GroupData } from '../scripts/tools'
const prop = defineProps<{
  groups: GroupData[],
  sizes: number[],
  activePaneName: string,
  index: number
}>()
const chartName = "dist-chart" + prop.index
const distChart = ref()
const showSymbol = ref(true)
const currentTab = inject('currentTab') as Ref<string>

const resizeGraph = (myChart: echarts.ECharts) => {
  if (!isNil(distChart.value) && prop.activePaneName == 'distribution' && currentTab.value == prop.index.toString()) {
    // console.log('dist-chart::width:',distChart.value.clientWidth);
    // console.log('dist-chart::height:',distChart.value.clientHeight);
    nextTick(() => {
      myChart.resize({
        width: distChart.value.clientWidth,
        height: distChart.value.clientHeight
      })
    })
  }
}
onMounted(() => {
  const myChart = echarts.init(document.getElementById(chartName) as HTMLElement)
  myChart.setOption({
    title: [{
      text: "grain size distribution curve",
      top: '1%',
      left: '5%'
    },],
    tooltip: {
      type: 'line',
      trigger: 'item',
      axisPointer: {
        axis: 'x'
      }
    },
    legend: [{
      orient: 'horizontal',
      selector: [{
        type: 'all',
        title: 'select all'
      }, {
        type: 'inverse',
        title: 'inverse'
      }],
      width: '',
      right: '5%',
      top: '1%',
      borderWidth: 1,
      borderRadius: 8,
      borderColor: '#000',
    }],
    grid: [{
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '11%'
    },],
    xAxis: [{
      type: 'category',
      data: prop.sizes,
    },],
    yAxis: [{
      type: 'value',
      // max:20
      maxInterval: 10
    },],
    dataZoom: [{
      type: 'slider',
      xAxisIndex: [0],
      bottom: '2%'
    }, {
      type: 'inside',
      xAxisIndex: [0],
    },],
    series: [...prop.groups.map(v => {
      return {
        name: v.groupName,
        type: 'line',
        data: v.data,
        emphasis: {
          scale: 2,
          focus: 'series',
        },
        smooth: true,
        showSymbol: showSymbol.value,
        tooltip: {
          // formatter: toolTipFormatter,
          // valueFormatter:(v:number)=>v+'%'
        }
      }
    }),],
  })
  watch([() => prop.activePaneName, currentTab], () => {
    resizeGraph(myChart)
  })
  resizeGraph(myChart)

  window.addEventListener('resize', () => { resizeGraph(myChart) })
})

</script>

<style scoped>
.dist-chart {
  width: calc(100%);
  height: calc(100%);
}
</style>
