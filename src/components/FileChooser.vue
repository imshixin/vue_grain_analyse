<template>
  <div class="root">
    <div class="tableContainer">

      <el-form label-width="140px">
        <!-- <el-form-item label="选择文件"> -->
        <el-col :span="24">
          <el-upload :on-change="onChooseFile" :auto-upload="false" drag="true" style="height: 40px;">选择文件
            <!-- <el-button>选择文件</el-button> -->
          </el-upload>
        </el-col>
        <!-- </el-form-item> -->
        <el-divider border-style="dashed" />
        <el-form-item label="选择一个工作表">
          <el-select :disabled="!hasSelectFile" placeholder="请选择" v-model="formValues.selectWorksheet">
            <el-option v-for="option in onSelectOptions" :key="option.value" :label="option.label"
              :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="粒径大小单元格范围">
          <el-col :span="11">
            <el-input :disabled="!hasSelectFile" v-model="formValues.sizeStartCell" />
          </el-col>
          <el-col :span="2">
            <div class="text-gray-500" style="text-align: center;">-</div>
          </el-col>
          <el-col :span="11">
            <el-input :disabled="!hasSelectFile" v-model="formValues.sizeEndCell" />
          </el-col>
        </el-form-item>
        <el-form-item label="分组名单元格范围">
          <el-col :span="11">
            <el-input :disabled="!hasSelectFile" v-model="formValues.groupStartCell" />
          </el-col>
          <el-col :span="2">
            <div class="text-gray-500" style="text-align: center;">-</div>
          </el-col>
          <el-col :span="11">
            <el-input :disabled="!hasSelectFile" v-model="formValues.groupEndCell" />
          </el-col>
        </el-form-item>
        <el-form-item label="数据单元格范围">
          <el-col :span="11">
            <el-input :disabled="!hasSelectFile" v-model="formValues.dataStartCell" />
          </el-col>
          <el-col :span="2">
            <div class="text-gray-500" style="text-align: center;">-</div>
          </el-col>
          <el-col :span="11">
            <el-input :disabled="!hasSelectFile" v-model="formValues.dataEndCell" />
          </el-col>
        </el-form-item>
        <el-divider border-style="dotted" content-position="center">
          ↓ 额外数据图表 ↓
        </el-divider>
        <!-- <el-form-item label="额外数据图表"> -->
        <el-table :data="categoryDetails" max-height="250" border>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="特征粒径含量" prop="rangeOrPercent" #default="scope">
            <my-table-cell :scope="scope"/>
          </el-table-column>
        </el-table>
        <!-- </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MyTableCell from './MyTableCell.vue'
import { reactive, ref, watch, computed, } from 'vue';
import { ElUpload, ElButton, ElTable, ElTableColumn, ElSelect, ElOption, ElForm, ElFormItem, ElInput, ElCol, ElDivider } from 'element-plus';
import { UploadFile, UploadFiles } from 'element-plus';
import * as exceljs from "exceljs"
import { isArray, isNumber, isString, toNumber, toString } from 'lodash';
import type { CategoryDetail, DataSheet } from '../scripts/tools'
interface CellIndex {
  row: number,
  column: number
}
const worksheets = ref<Array<exceljs.Worksheet>>([])
const hasSelectFile = ref<boolean>(false)
const columnCount = ref<number>(0);
const rows = ref<Array<Array<string>>>([])
const categoryNames = ['clay', 'fine silt', 'medium silt', 'coarse silt', 'fine sand', 'coarse sand', 'fine gravel', 'd50']
const reqiureCategories = [[0, 2], [2, 6], [6, 20], [20, 63], [63, 200], [200, 600], [600, 2000], 50] as ([number, number] | number)[]
const categoryDetails = categoryNames.map((v, i) => ({ name: v, rangeOrPercent: reqiureCategories[i] } as CategoryDetail))
const extraData = reactive<{
  sizeRange: CategoryDetail[],
  featureValue: CategoryDetail[]
}>({
  sizeRange: categoryDetails.filter(v => isArray(v)),
  featureValue: categoryDetails.filter(v => !isArray(v))
})
const formValues = reactive({
  selectWorksheet: -1,
  selectFileName: '',
  sizeStartCell: "A2",
  sizeEndCell: "A100",
  groupStartCell: "B1",
  groupEndCell: "H1",
  dataStartCell: "B2",
  dataEndCell: "H100",
})



watch(worksheets, async () => {
  //设置默认表格
  // console.log(getCellValues(worksheets.value[0], "A1", "H100"));
  rows.value = getTableData(worksheets.value[0])
})
const onSelectOptions = computed(() => {
  let arr = worksheets.value.map(v => {
    return { label: v.name, "value": v.id }
  })
  if (worksheets.value.length > 0)
    formValues.selectWorksheet = arr[0].value
  return arr
})

const emit = defineEmits(['importNewData'])
//点击确认按钮
const onSubmit = () => {
  let worksheet = worksheets.value.filter(v => v.id  == formValues.selectWorksheet)[0]
  const groupNames = getCellValues(worksheet, formValues.groupStartCell, formValues.groupEndCell) as string[]
  const sizes = (getCellValues(worksheet, formValues.sizeStartCell, formValues.sizeEndCell) as string[]).map(v => Number(v))
  const datas = (getCellValues(worksheet, formValues.dataStartCell, formValues.dataEndCell) as string[][]).map(v => {
    return v.map(va => Number(va))
  })
  emit('importNewData', {
    fileName: formValues.selectFileName,
    groupNames,
    sizes,
    datas
  } as DataSheet)
  worksheets.value=[]
  formValues.selectWorksheet=-1
  hasSelectFile.value=false
}
//根据指定单元格获取数据
const getCellValues = (worksheet: exceljs.Worksheet, start: string, end: string) => {
  const startCell = worksheet.getCell(start)
  const endCell = worksheet.getCell(end)
  const startCellIndex = {
    row: Math.min(Number(startCell.row), Number(endCell.row)),
    column: Math.min(Number(startCell.col), Number(endCell.col))
  } as CellIndex
  const endCellIndex = {
    row: Math.max(Number(startCell.row), Number(endCell.row)),
    column: Math.max(Number(startCell.col), Number(endCell.col))
  } as CellIndex
  // console.log(startCellIndex, endCellIndex);

  if (startCellIndex.row == endCellIndex.row) {
    let data = []
    for (let i = startCellIndex.column; i <= endCellIndex.column; i++) {
      data.push(handleCellVaue(worksheet.getRow(startCellIndex.row).getCell(i).value))
    }
    return data
  } else if (startCellIndex.column == endCellIndex.column) {
    let data = []
    for (let i = startCellIndex.row; i <= endCellIndex.row; i++) {
      data.push(handleCellVaue(worksheet.getCell(i, startCellIndex.column).value))
    }
    return data
  } else {
    let data = [] as Array<Array<string>>
    for (let row = 0; row <= endCellIndex.row - startCellIndex.row; row++) {
      data[row] = []
      for (let col = 0; col <= endCellIndex.column - startCellIndex.column; col++) {
        data[row][col] = handleCellVaue(worksheet.getCell(startCellIndex.row + row, startCellIndex.column + col).value)
      }
    }
    return data
  }
}

const onChooseFile = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  // console.log("size:", uploadFile.size)
  // console.log("url:", uploadFile.raw)
  const workbook = new exceljs.Workbook()
  formValues.selectFileName = uploadFile.name
  uploadFile.raw?.arrayBuffer().then((val) => {
    return workbook.xlsx.load(val)
  }).then((book) => {
    worksheets.value = book.worksheets
    hasSelectFile.value = true
  })
}

const isFormularValue = (cell: exceljs.CellValue): cell is exceljs.CellFormulaValue => {
  return (<exceljs.CellFormulaValue>cell).formula !== undefined
}
//处理单元格不同类型值转化为string
const handleCellVaue = (cellValue: exceljs.CellValue): string => {
  if (isFormularValue(cellValue)) {
    let result = (<exceljs.CellFormulaValue>cellValue).result
    if (isNumber(result)) {
      return Math.round(result * 10000) / 10000 + ""
    }
    return result?.toString() || "0"
  }
  if (isNumber(cellValue)) {

    return String(Math.round(cellValue * 10000) / 10000)
  }
  if (isString(cellValue)) {
    return cellValue
  }
  console.log(cellValue);

  return ""
}
const getTableData = (worksheet: exceljs.Worksheet) => {
  columnCount.value = worksheets.value[0].columnCount
  let rows = [] as Array<Array<string>>
  for (let i = 1; i <= worksheet.rowCount; i++) {
    rows[i] = []
    worksheet.getRow(i).eachCell((cell, colNumber) => {
      rows[i][colNumber] = handleCellVaue(cell.value)
    })

  }
  return rows
}

</script>

<style scoped>
.root {
  width: 100%;
  height: 100%;
}



.upload {
  background-color: blueviolet;
  width: 100%;
  height: 100%;
}

::v-deep(.el-upload-dragger) {
  padding: 0;
  height: 50px;
  line-height: 50px;
}
</style>
