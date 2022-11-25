<script setup lang="ts">
import { ElSteps, ElStep, ElButton, ElUpload, UploadRawFile, ElTable, ElTableColumn } from 'element-plus'
import { ref, reactive, onMounted, watch } from 'vue'
// import type { UploadInstance } from 'element-plus'
import * as ExcelJS from 'exceljs'
// import { readExcel } from '../utils/utils'
import * as echarts from 'echarts'
import { isNumber } from 'lodash';
// import { regression } from 'echarts-stat'

interface GroupData {
  groupName: ExcelJS.CellValue | string,
  data: Array<ExcelJS.CellValue> | Array<number>,
  cumData?: Array<number>,
  extraData?: Array<number>
}
interface FormatterParams {

  componentType: string,
  // 系列类型
  seriesType: string,
  // 系列在传入的 option.series 中的 index
  seriesIndex: number,
  // 系列名称
  seriesName: string,
  // 数据名，类目名
  name: string,
  // 数据在传入的 data 数组中的 index
  dataIndex: number,
  // 传入的原始数据项
  data: Object,
  // 传入的数据值。在多数系列下它和 data 相同。在一些系列下是 data 中的分量（如 map、radar 中）
  value: number | Array<Object> | Object,
  // 坐标轴 encode 映射信息，
  // key 为坐标轴（如 'x' 'y' 'radius' 'angle' 等）
  // value 必然为数组，不会为 null/undefied，表示 dimension index 。
  // 其内容如：
  // {
  //     x: [2] // dimension index 为 2 的数据映射到 x 轴
  //     y: [0] // dimension index 为 0 的数据映射到 y 轴
  // }
  encode: Object,
  // 维度名列表
  dimensionNames: Array<string>,
  // 数据的维度 index，如 0 或 1 或 2 ...
  // 仅在雷达图中使用。
  dimensionIndex: number,
  // 数据图形的颜色
  color: string,
  // 饼图，漏斗图的百分比
  percent: number

}
let datas = [[0.01, 0, 0, 0, 0, 0, 0, 0],
[0.011, 0, 0, 0, 0, 0, 0, 0],
[0.013, 0, 0, 0, 0, 0, 0, 0],
[0.015, 0, 0, 0, 0, 0, 0, 0],
[0.017, 0, 0, 0, 0, 0, 0, 0],
[0.019, 0, 0, 0, 0, 0, 0, 0],
[0.022, 0, 0, 0, 0, 0, 0, 0],
[0.024, 0, 0, 0, 0, 0, 0, 0],
[0.028, 0, 0, 0, 0, 0, 0, 0],
[0.032, 0, 0, 0, 0, 0, 0, 0],
[0.036, 0, 0, 0, 0, 0, 0, 0],
[0.041, 0, 0, 0, 0, 0, 0, 0],
[0.046, 0, 0, 0, 0, 0, 0, 0],
[0.053, 0, 0, 0, 0, 0, 0, 0],
[0.06, 0, 0, 0, 0, 0, 0, 0],
[0.068, 0, 0, 0, 0, 0, 0, 0],
[0.077, 0, 0, 0, 0, 0, 0, 0],
[0.088, 0, 0, 0, 0, 0, 0, 0],
[0.1, 0, 0, 0, 0, 0, 0, 0],
[0.113, 0, 0, 0, 0, 0, 0, 0],
[0.128, 0, 0, 0, 0, 0, 0, 0],
[0.146, 0, 0, 0, 0, 0, 0, 0],
[0.166, 0, 0, 0, 0, 0, 0, 0],
[0.188, 0, 0, 0, 0, 0, 0, 0],
[0.214, 0, 0, 0, 0, 0, 0, 0],
[0.243, 0, 0, 0, 0, 0, 0, 0],
[0.276, 0, 0, 0, 0, 0, 0, 0],
[0.314, 0, 0, 0, 0, 0, 0, 0],
[0.357, 0, 0, 0, 0, 0, 0, 0],
[0.405, 0, 0, 0, 0, 0, 0, 0],
[0.46, 0, 0, 0, 0, 0, 0, 0],
[0.523, 0, 0, 0, 0, 0, 0, 0],
[0.594, 0, 0, 0, 0, 0, 0, 0],
[0.675, 0, 0, 0, 0, 0, 0, 0],
[0.767, 0, 0, 0, 0, 0, 0, 0],
[0.872, 0, 0, 0, 0, 0, 0, 0],
[0.991, 0, 0, 0, 0, 0, 0, 0],
[1.125, 0, 0, 0, 0, 0, 0, 0],
[1.279, 0, 0, 0, 0, 0, 0, 0],
[1.453, 0, 0, 0, 0, 0, 0, 0],
[1.651, 0, 0, 0, 0, 0, 0.06, 0],
[1.875, 0.06, 0.06, 0, 0.08, 0.07, 0.09, 0.07],
[2.131, 0.08, 0.07, 0.02, 0.09, 0.08, 0.11, 0.09],
[2.421, 0.09, 0.08, 0.05, 0.11, 0.1, 0.13, 0.11],
[2.75, 0.1, 0.09, 0.06, 0.12, 0.11, 0.14, 0.12],
[3.125, 0.11, 0.1, 0.09, 0.14, 0.12, 0.17, 0.14],
[3.55, 0.12, 0.1, 0.1, 0.16, 0.14, 0.19, 0.15],
[4.034, 0.13, 0.11, 0.11, 0.17, 0.14, 0.21, 0.16],
[4.583, 0.14, 0.12, 0.11, 0.19, 0.15, 0.24, 0.17],
[5.207, 0.15, 0.12, 0.12, 0.2, 0.15, 0.25, 0.17],
[5.916, 0.15, 0.13, 0.12, 0.21, 0.15, 0.26, 0.16],
[6.722, 0.15, 0.13, 0.12, 0.21, 0.14, 0.26, 0.15],
[7.637, 0.14, 0.13, 0.12, 0.21, 0.13, 0.25, 0.14],
[8.677, 0.13, 0.13, 0.12, 0.21, 0.12, 0.24, 0.14],
[9.858, 0.12, 0.13, 0.12, 0.21, 0.12, 0.23, 0.14],
[11.201, 0.1, 0.12, 0.14, 0.22, 0.13, 0.23, 0.16],
[12.726, 0.09, 0.11, 0.16, 0.24, 0.16, 0.25, 0.2],
[14.458, 0.09, 0.1, 0.2, 0.27, 0.2, 0.29, 0.25],
[16.427, 0.1, 0.09, 0.24, 0.31, 0.25, 0.37, 0.32],
[18.664, 0.12, 0.09, 0.29, 0.37, 0.3, 0.49, 0.4],
[21.205, 0.15, 0.09, 0.34, 0.44, 0.35, 0.64, 0.47],
[24.092, 0.19, 0.1, 0.39, 0.51, 0.38, 0.81, 0.52],
[27.373, 0.23, 0.13, 0.42, 0.58, 0.4, 0.97, 0.53],
[31.1, 0.26, 0.18, 0.45, 0.63, 0.39, 1.09, 0.51],
[35.335, 0.27, 0.24, 0.49, 0.65, 0.36, 1.16, 0.47],
[40.146, 0.27, 0.3, 0.56, 0.66, 0.35, 1.16, 0.45],
[45.613, 0.24, 0.36, 0.69, 0.67, 0.37, 1.09, 0.5],
[51.823, 0.22, 0.4, 0.94, 0.69, 0.48, 0.99, 0.7],
[58.88, 0.22, 0.4, 1.32, 0.79, 0.71, 0.94, 1.11],
[66.897, 0.3, 0.36, 1.89, 0.99, 1.09, 1.02, 1.79],
[76.006, 0.53, 0.29, 2.64, 1.36, 1.63, 1.36, 2.77],
[86.355, 0.95, 0.23, 3.56, 1.92, 2.33, 2.04, 4.02],
[98.114, 1.62, 0.27, 4.59, 2.69, 3.12, 3.11, 5.43],
[111.473, 2.57, 0.48, 5.66, 3.66, 3.95, 4.53, 6.88],
[126.652, 3.78, 0.97, 6.68, 4.78, 4.72, 6.21, 8.19],
[143.897, 5.2, 1.83, 7.55, 5.97, 5.38, 7.92, 9.19],
[163.49, 6.69, 3.11, 8.19, 7.12, 5.87, 9.39, 9.72],
[185.752, 8.12, 4.78, 8.52, 8.11, 6.19, 10.35, 9.7],
[211.044, 9.29, 6.7, 8.5, 8.81, 6.37, 10.56, 9.12],
[239.78, 10.02, 8.67, 8.12, 9.11, 6.46, 9.89, 8.02],
[272.43, 10.19, 10.38, 7.39, 8.92, 6.5, 8.39, 6.55],
[309.525, 9.74, 11.51, 6.36, 8.21, 6.51, 6.29, 4.88],
[351.67, 8.69, 11.8, 5.1, 7.03, 6.47, 3.98, 3.21],
[399.555, 7.16, 11.11, 3.72, 5.5, 6.29, 1.67, 1.67],
[453.96, 5.36, 9.48, 2.38, 3.82, 5.9, 0.01, 0.34],
[515.772, 3.53, 7.17, 1.15, 2.13, 5.22, 0, 0],
[586.001, 1.74, 4.61, 0.11, 0.52, 4.22, 0, 0],
[665.793, 0.33, 2.04, 0, 0, 3, 0, 0],
[756.449, 0, 0.01, 0, 0, 1.74, 0, 0],
[859.45, 0, 0, 0, 0, 0.48, 0, 0],
[976.475, 0, 0, 0, 0, 0, 0, 0],
[1109.435, 0, 0, 0, 0, 0, 0, 0],
[1260.499, 0, 0, 0, 0, 0, 0, 0],
[1432.133, 0, 0, 0, 0, 0, 0, 0],
[1627.136, 0, 0, 0, 0, 0, 0, 0],
[1848.692, 0, 0, 0, 0, 0, 0, 0],
[2100.416, 0, 0, 0, 0, 0, 0, 0],
[2386.415, 0, 0, 0, 0, 0, 0, 0],
[2711.357, 0, 0, 0, 0, 0, 0, 0],]
const tableHeaders = ['Size (μm)', 'L-036', 'L-009', 'L-041', 'L-002', 'L-012', 'L-000', 'L-003']
const classifyHeader = ['clay', 'fine silt', 'medium silt', 'coarse silt', 'fine sand', 'coarse sand', 'fine gravel', 'd50']
const classifyBoundrySize = [2, 6, 20, 63, 200, 600, 2000]
let groups = reactive<Array<GroupData>>([])
let sizes = ref<Array<number>>([])
const generateGroups = ((data: Array<Array<number>>, groupNames: Array<string>) => {
  groupNames.forEach((v, i) => {
    if (i == 0)
      return
    let groupData = {
      groupName: v,
      data: datas.map(v => v[i]),
      cumData: [],
      extraData: []
    } as GroupData
    groupData.data.forEach((v, i, arr) => {
      if (i == 0) {
        groupData.cumData!.push(v as number)
      } else {
        let result = (v as number + groupData.cumData![i - 1] as number)
        groupData.cumData!.push(Math.round(result * 100) / 100)
      }
    })
    groups.push(groupData)
  })
})
const generateSizes = ((data: Array<Array<number>>) => {
  data.forEach(v => sizes.value.push(v[0]))
})
const generateExtraData = (boundries: Array<number>, sizes: Array<number>, group: GroupData) => {
  boundries.forEach((v, i, arr) => {
    if (i == 0) {
      group.extraData?.push(findContentBySize(v, sizes, group))
    } else {
      const content = findContentBySize(v, sizes, group)
      const lastContent = findContentBySize(arr[i - 1], sizes, group)
      group.extraData?.push(Math.round((content - lastContent) * 100) / 100)
    }
  })
  //add d50
  let d50 = findFeatureSizeBySelect(50, group)
  group.extraData?.push(d50)
}
const generateXYPoint = (sizes: Array<number>, datas: Array<number>) => {
  return sizes.map((v, i) => [v, datas[i]])
}
const generateClassifyGroup = (tableHeaders: Array<string>, classifyHeader: Array<string>, groups: Array<GroupData>): Array<GroupData> => {
  const classifyGroup = classifyHeader.map((v, i) => {//滤去d50
    return {
      groupName: v,
      data: groups.map(va => {
        return va.extraData![i]
      })
    } as GroupData
  })
  return classifyGroup
}
const findFeatureSizeBySelect = (d: number, group: GroupData): number => {
  let minDelta = Infinity
  let size = 0
  group.cumData!.forEach((v, i) => {
    if (Math.abs(d - v) < minDelta) {
      minDelta = Math.abs(d - v)
      size = sizes.value[i]
    }
  })
  return size
}
const findContentBySize = (size: number, sizes: Array<number>, group: GroupData): number => {
  let minDelta = Infinity
  let content = 0
  sizes.forEach((v, i) => {
    if (size - v < minDelta && size - v >= 0) {
      minDelta = Math.abs(v - size)
      content = group.cumData![i]
    }
  })
  // if(group.groupName=='L-009')
  // console.log('size',size,'content',content);

  return content
}
generateSizes(datas)
generateGroups(datas, tableHeaders)
groups.forEach(v => {
  generateExtraData(classifyBoundrySize, sizes.value, v)
})
const classifyGroups = generateClassifyGroup(tableHeaders, classifyHeader, groups)
// const book = new ExcelJS.Workbook()
// const uploadRef = ref<UploadInstance>();
// const readRawFile = async (rawFile: UploadRawFile) => {
//   groups.splice(0, groups.length)//清空数组
//   await book.xlsx.load(await rawFile.arrayBuffer())
//   const worksheet = book.getWorksheet('Sheet7')
//   const calcCumulation = (data: Array<ExcelJS.CellValue>) => {
//     let arr: Array<number> = []
//     data.forEach((val, index) => {
//       if (index == 0) {
//         arr.push(Number(val!.toString()))
//       } else {
//         arr.push(Math.round((Number(val!.toString()) + arr[arr.length - 1]) * 100) / 100)
//       }
//     })
//     return arr
//   }
//   // sizes.value = worksheet.getColumn(0).values.map(v => v)
//   worksheet.columns.filter((v, i) => i > 0).map(v => {
//     return {
//       groupName: v.values![1],
//       data: v.values!.slice(2),
//       cumData: calcCumulation(v.values!.slice(2))
//     } as GroupData
//   }).forEach(v => groups.push(v))
//   console.log(groups);
//   return false
// }
const echart = ref()
const toolTipFormatter = (params: FormatterParams, ticket: string, callback: (ticket: string, html: string) => null): string | HTMLElement | HTMLElement[] => {
  const group = params.seriesName
  const isSize = isNumber(params.name)
  const groupColor = params.color
  return `group: <span style="color:${groupColor};">${group}</span><br/>
                    Size:  <span style="font-weight: 1000;">${params.name}${!isSize ? "um" : ''}</span><br/>
                    Percent: <span style="font-weight: 1000;">${params.value}%</span>`
}
const classifyToolTipFormatter = (params: FormatterParams, ticket: string, callback: (ticket: string, html: string) => null): string | HTMLElement | HTMLElement[] => {
  // console.log(params);

  const group = params.name
  const classtype = params.seriesName
  const groupColor = params.color
  return `group: <span style="color:${groupColor};">${group}</span><br/>
                    Type:  <span style="font-weight: 1000;">${classtype}</span><br/>
                    Percent: <span style="font-weight: 1000;">${params.value}%</span>`
}
const graphGap = 3
const graphSize = 9
const showSymbol = ref(true)
onMounted(() => {
  const myChart = echarts.init(document.getElementById('echart') as HTMLElement)
  // myChart.dispatchAction()
  myChart.setOption({
    title: [{
      text: "grain size distribution curve",
      top: '1%',
      left: '5%'
    }, {
      text: "Grain size cumulative curve",
      top: '1%',
      left: '55%',
    }],
    tooltip: {
      type: 'line',
      trigger: 'item',
      axisPointer: {
        axis: 'x'
      }
    },
    toolbox:{
      show:true,
      top:'49%',
      left:'center',
      itemSize:25,
      feature:{
        myTool1: {
                show: true,
                title: 'Hide the dots',
                icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                onclick: ()=>{
                  showSymbol.value = !showSymbol.value
                }
            },
      }
    },
    legend: [{
      orient: 'vertical',
      selector: [{
        type: 'all',
        title: 'select all'
      }, {
        type: 'inverse',
        title: 'inverse'
      }],
      left: '46%',
      top: '2%',
      borderWidth: 1,
      borderRadius: 15,
      borderColor: '#000',
      data: tableHeaders.filter((v, i) => i != 0)
    }, {
      orient: 'vertical',
      selector: [{
        type: 'all',
        title: 'select all'
      }, {
        type: 'inverse',
        title: 'inverse'
      }],
      left: '46%',
      top: '25%',
      borderWidth: 1,
      borderRadius: 15,
      borderColor: '#000',
      data: classifyHeader
    }],
    grid: [{
      width: '40%',
      height: '40%',
      top: '5%',
      left: '5%'
    }, {
      width: '40%',
      height: '40%',
      top: '5%',
      left: '55%'
    }/* , {
      width: '90%',
      height: '40%',
      top: '55%',
      left: '5%'
    } */, ...classifyGroups.map((v, i) => {
      return {
        width: graphSize + '%',
        hieght: '40%',
        top: '55%',
        left: (4 + (graphSize + graphGap) * i).toString() + '%'
      }
    })],

    xAxis: [{
      gridIndex: 0,
      type: 'category',
      data: sizes.value,
    }, {
      gridIndex: 1,
      type: 'category',
      data: sizes.value,

    }, ...classifyGroups.map((v, i) => {
      return {
        gridIndex: 2 + i,
        type: 'value',
        scale: true,
        splitLine: {
          show: false
        },

        // data:[v.groupName]
      }
    })],
    yAxis: [{
      gridIndex: 0,
      type: 'value',
      // max:20
      maxInterval: 10
    }, {
      gridIndex: 1,
      type: 'value',
      max: (v: any) => Math.round(v.max) + 5,
      maxInterval: 10
    }, {
      gridIndex: 2,
      type: 'category',
      data: tableHeaders.slice(1, tableHeaders.length),
      splitLine: {
        show: true
      },
      axisPointer: {
        show: true,
      },

    }, ...classifyGroups.filter((v, i) => i != 0).map((v, i) => {
      return {
        gridIndex: 3 + i,
        type: 'category',
        data: tableHeaders.slice(1, tableHeaders.length),
        axisLabel: {
          show: true
        },
        splitLine: {
          show: true,
          interval: 1
        },
        axisPointer: {
          show: true,
          triggerTooltip:false
        },
        // show:false
      }
    })],
    dataZoom: [{
      type: 'slider',
      xAxisIndex: [0],
      top: '48%'
    }, {
      type: 'slider',
      xAxisIndex: [1],
      top: '48%',
      right: '5%'
    }, {
      type: 'inside',
      xAxisIndex: [0],
    }, {
      type: 'inside',
      xAxisIndex: [1],
    }],
    series: [...groups.map(v => {
      return {
        name: v.groupName,
        type: 'line',
        data: v.data,
        xAxisIndex: 0,
        yAxisIndex: 0,
        emphasis: {
          scale: 2,
          focus: 'series',
        },
        smooth: true,
        showSymbol:showSymbol.value,
        tooltip: {
          formatter: toolTipFormatter,
          // valueFormatter:(v:number)=>v+'%'
        }
      }
    }), ...groups.map(v => {
      return {
        name: v.groupName,
        type: 'line',
        data: v.cumData!,
        xAxisIndex: 1,
        yAxisIndex: 1,
        emphasis: {
          scale: 2,
          focus: 'series',
        },
        showSymbol:showSymbol.value,
        tooltip: {
          formatter: toolTipFormatter,
          // valueFormatter:(v:number)=>v+'%'
        }
      }
    }), ...classifyGroups.map((v, i) => {
      return {
        name: v.groupName,
        type: 'line',
        data: v.data,
        xAxisIndex: 2 + i,
        yAxisIndex: 2 + i,
        emphasis: {
          scale: 2,
          focus: 'global',
        },
        tooltip: {
          formatter: classifyToolTipFormatter,
          // valueFormatter:(v:number)=>v+'%'
        }
        // smooth:true
      }
    })],
  })
  watch(showSymbol,()=>{
    myChart.setOption({
      series: [...groups.map(v => {
      return {
        name: v.groupName,
        type: 'line',
        data: v.data,
        xAxisIndex: 0,
        yAxisIndex: 0,
        emphasis: {
          scale: 2,
          focus: 'series',
        },
        smooth: true,
        showSymbol:showSymbol.value,
        tooltip: {
          formatter: toolTipFormatter,
          // valueFormatter:(v:number)=>v+'%'
        }
      }
    }), ...groups.map(v => {
      return {
        name: v.groupName,
        type: 'line',
        data: v.cumData!,
        xAxisIndex: 1,
        yAxisIndex: 1,
        emphasis: {
          scale: 2,
          focus: 'series',
        },
        showSymbol:showSymbol.value,
        tooltip: {
          formatter: toolTipFormatter,
          // valueFormatter:(v:number)=>v+'%'
        }
      }
    }), ...classifyGroups.map((v, i) => {
      return {
        name: v.groupName,
        type: 'line',
        data: v.data,
        xAxisIndex: 2 + i,
        yAxisIndex: 2 + i,
        emphasis: {
          scale: 2,
          focus: 'global',
        },
        tooltip: {
          formatter: classifyToolTipFormatter,
          // valueFormatter:(v:number)=>v+'%'
        }
        // smooth:true
      }
    })],
    })
  })
  // console.log(myChart.renderToSVGString());
  window.onresize = () => myChart.resize()
})


</script>
<template>
  <div class="main-page">
    <!-- <el-steps :active="1" :space="200" finish-status="success" align-center  >
      <el-step title="选择文件" />
      <el-step title="选择文件" />
      <el-step title="选择文件" />
    </el-steps>
    <el-upload drag :auto-upload="true" :multiple="false" ref="uploadRef" :before-upload="readRawFile">
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      <el-button @click="click">upload</el-button>

    </el-upload> -->
    <!-- <el-table :data="datas" style="width:100%;height: 50%;">
      <el-table-column v-for="(header, index) in headers" :label="header" :prop="index+''" />
    </el-table> -->
    <div id="echart" ref="echart" style="width: 1920px;height:960px;"></div>
  </div>
</template>


<style scoped>
.main-page {
  background-color: beige;
  height: 100%;
  /* padding: 4px 8px 0; */
}

#echart {
  overflow: hidden;
  background-color: azure;
}

.el-step {
  padding: 3px 2px 0;
  background-color: #ffffff;
  font-weight: bolder;
}
</style>
