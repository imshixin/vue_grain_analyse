import { isArray } from "lodash";
export interface GroupData {
  groupName:  string,
  data: Array<string> | Array<number>,
  cumData?: Array<number>,
  extraData?: Array<number>
}
export interface FormatterParams {

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
export interface DataSheet{
  fileName:string,
  groupNames:string[],
  sizes:number[],
  datas:number[][],
}
export interface Category{
  name:string,
  groupNames:string[],
  values:number[]
}
export interface CategoryDetail{
  name:string,
  rangeOrPercent:[number,number]|number,
}
/*
  生成组对象
*/
export const generateGroups = ((data: Array<Array<number>>, groupNames: Array<string>) => {
  let groups = [] as GroupData[]
  groupNames.forEach((v, i) => {
    if (i == 0)
    return
    let groupData = {
      groupName: v,
      data: data.map(v => v[i]),
      cumData: [],
      extraData: []
    } as GroupData
    //计算累计值
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
  return groups
})
//生成额外分类组
export const generateCategory = (groups:GroupData[],sizes:number[],name:string,rangeOrPercent:[number,number]|number):Category=>{
  let category = {
    name,
    groupNames:[],
    values:[]
  } as Category
  console.log('type',rangeOrPercent);

  if(isArray(rangeOrPercent)){
    const [start,end] = [Math.min(...rangeOrPercent),Math.max(...rangeOrPercent)]
    groups.forEach(v=>{
      // console.log('groupName',v.groupName,'size',start,'find:',findContentBySize(end,sizes,v));
      category.values.push(findContentBySize(end,sizes,v)-findContentBySize(start,sizes,v))
      category.groupNames.push(v.groupName)
    })
  }else{
    groups.forEach(v=>{
      // console.log('d50',findFeatureSizeBySelect(rangeOrPercent,sizes,v));
      category.values.push(findFeatureSizeBySelect(rangeOrPercent,sizes,v))
      category.groupNames.push(v.groupName)
    })
  }
  return category
}
/* 查找特征粒径对应的最邻近的粒径大小 */
export const findFeatureSizeBySelect = (d: number, sizes:number[], group: GroupData): number => {
  let minDelta = Infinity
  let size = 0
  group.cumData!.forEach((v, i) => {
    if (Math.abs(d - v) < minDelta) {
      minDelta = Math.abs(d - v)
      size = sizes[i]
    }
  })
  return size
}
/* 查找对应大小粒径的累计含量 */
export const findContentBySize = (size: number, sizes: Array<number>, group: GroupData): number => {
  let minDelta = Infinity
  let content = 0

  sizes.forEach((v, i) => {
    if (size - v < minDelta && size - v >= 0) {
      minDelta = Math.abs(v - size)
      content = group.cumData![i]
    }
  })
  return content
}
