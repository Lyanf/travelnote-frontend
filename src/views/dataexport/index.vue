<template>
  <div class="app-container">
    <ArticleSearch show-export="true" @searchEvent="filter" @exportEvent="exportClicked" />
    <div style="margin-top: 20px">
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="选择" width="200">
          <template slot-scope="{row}">
            <el-checkbox v-model="row.select" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="稿件ID" width="200">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column width="200" align="center" label="稿件标题">
          <template slot-scope="{row}">
            <span>{{ row.header }}</span>
          </template>
        </el-table-column>

        <el-table-column width="200" align="center" label="作者ID">
          <template slot-scope="{row}">
            <span>{{ row.userid }}</span>
          </template>
        </el-table-column>

        <el-table-column width="200" align="center" label="作者名称">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column width="200" align="center" label="创建时间">
          <template slot-scope="{row}">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>

        <el-table-column width="200" align="center" label="文章状态">
          <template slot-scope="{row}">
            <span>{{ row.statuslabel }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import ArticleSearch from '@/components/ArticleSearch/index'
import { fetchAllArticle } from '@/api/newtest'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

export default {
  name: 'Index',
  components: { ArticleSearch },
  data: function() {
    return {
      header: '',
      name: '',
      date: '',
      list: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async filter(filterObj) {
      await this.getList()
      console.log(filterObj)
      if (filterObj.hasOwnProperty('header')) {
        this.list = this.list.map(v => {
          if ((v['header'].search(filterObj['header'])) !== -1) {
            console.log('++++++')
            return v
          } else {
            return 1
          }
        })
      }
      if (filterObj.hasOwnProperty('name')) {
        this.list = this.list.map(v => {
          if (v === 1) {
            return 1
          }
          if (v['name'].search(filterObj['name']) !== -1) {
            return v
          } else {
            return 1
          }
        })
      }
      if (filterObj.hasOwnProperty('date')) {
        this.list = this.list.map(v => {
          if (v === 1) {
            return 1
          }
          if (filterObj['date'][0] <= v['date'] && filterObj['date'][1] >= v['date']) {
            return v
          } else {
            return 1
          }
        })
      }
      const t = []
      for (const item of this.list) {
        if (item !== 1) {
          t.push(item)
        }
      }
      this.list = t
      console.log(this.list)
    },
    async exportClicked() {
      const exportList = []
      for (const row of this.list) {
        if (row.select === true) {
          exportList.push(row)
        }
      }
      const zip = new JSZip()
      console.log(exportList)
      for (const item of exportList) {
        zip.file(item.id + '_' + item.header + '_' + item.userid + '.html', item.content)
      }
      zip.generateAsync({ type: 'blob' }).then(content => {
        FileSaver.saveAs(content, 'export.zip')
      })
    },
    async getList() {
      this.listLoading = true
      // TODO:应该变成已经通过审核的文章
      const { data } = await fetchAllArticle()
      this.list = data['Article']
      this.listLoading = false
      this.list = this.list.map(v => {
        this.$set(v, 'select', false) // https://vuejs.org/v2/guide/reactivity.html
        this.$set(v, 'statuslabel', (function() {
          const t = {
            '0': '已提交',
            '1': '未审核',
            '2': '审核未通过',
            '3': '审核已通过',
            '4': '置顶'
          }
          return t[v['status']]
        })())
        return v
      })
    }
  }
}
</script>

<style scoped>
  /*.el-card{*/
  /*  margin-left: 50px;*/
  /*  margin-right: 50px;*/
  /*  margin-top: 30px;*/
  /*}*/
</style>
