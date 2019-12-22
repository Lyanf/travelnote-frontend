<template>
  <div class="app-container">
    <ArticleSearch @searchEvent="filter" />
    <div style="margin-top: 20px">
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="稿件ID" width="200">
          <template slot-scope="{row}">
<!--            <span>{{ row.id }}</span>-->
            <span style="cursor: pointer; text-decoration: underline; color: #20a0ff" @click="showNote(row.id)">{{ row.id }}</span>
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

        <el-table-column align="center" label="Actions">
          <template slot-scope="{row}">
            <el-button
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmDelete(row)"
            >
              删除
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="confirmTop(row)"
            >
              置顶
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { fetchAllArticle } from '@/api/newtest.js'
import { changeArticleStatus, deleteArticle, fetchArticle } from '@/api/newtest'
import ArticleSearch from '@/components/ArticleSearch/index'

export default {
  components: { ArticleSearch },
  data() {
    return {
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
    async showNote(articleid) {
      let article = await fetchArticle(articleid)
      article = article['data']
      this.$alert(article.content, '文章内容', {
        dangerouslyUseHTMLString: true
      })
    },
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
          if (v === 1) return 1
          if (v['name'].search(filterObj['name']) !== -1) {
            return v
          } else {
            return 1
          }
        })
      }
      if (filterObj.hasOwnProperty('date')) {
        this.list = this.list.map(v => {
          if (v === 1) return 1
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
    async getList() {
      this.listLoading = true
      // TODO:应该变成已经通过审核的文章
      const { data } = await fetchAllArticle()
      this.list = data['Article']
      this.listLoading = false
      this.list = this.list.map(v => {
        this.$set(v, 'statuslabel', (function() {
          const t = { '0': '已提交',
            '1': '未审核',
            '2': '审核未通过',
            '3': '审核已通过',
            '4': '置顶' }
          return t[v['status']]
        })())
        return v
      })
    },
    async confirmDelete(row) {
      const that = this
      await deleteArticle(row.id).then(response => {
        that.getList()
        that.$message({
          message: '文章已经被删除',
          type: 'success'
        })
      })
    },
    async confirmTop(row) {
      await changeArticleStatus(row.id, {
        'id': row.id,
        'header': row.header,
        'content': row.content,
        'date': row.date,
        'status': 4,
        'userid': row.userid
      })
      this.$message({
        message: '文章已经被置顶',
        type: 'success'
      })
      this.getList()
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
