<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="审核ID" width="200">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="稿件ID">
        <template slot-scope="{row}">
          <span style="cursor: pointer; text-decoration: underline; color: #20a0ff" @click="showNote(row.articleid)">{{ row.articleid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="400" align="center" label="审核意见">
        <template slot-scope="{ row }">
          <el-input v-model="row.checkerinput" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions">
        <template slot-scope="{row}">
          <el-button
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="pass(row)"
          >
            通过
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="unpass(row)"
          >
            不通过
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchAllArticle } from '@/api/newtest.js'
import { changeArticleStatus, deleteArticle, fetchAllCheck, fetchArticle, updateCheck } from '@/api/newtest'
import { updateArticle } from '@/api/article'
import '@/styles/test.css'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
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
    async getList() {
      this.listLoading = true
      const { data } = await fetchAllCheck()
      this.list = data['Check']
      this.list = this.list.map(v => {
        this.$set(v, 'checkerinput', '') // https://vuejs.org/v2/guide/reactivity.html
        return v
      })
      this.list = this.list.map(v => {
        if (v.complete.toString() === '1') {
          return null
        } else {
          return v
        }
      })
      const temp = []
      for (const i of this.list) {
        if (i != null) { temp.push(i) }
      }
      // this.list.remove(null)
      this.list = temp
      this.listLoading = false
    },
    async pass(row) {
      // 不仅要把check的complete标为1，还要把文                                                                                                                                     章的status改一下
      const that = this
      updateCheck(row.id, {
        'id': row.id,
        'articleid': row.articleid,
        'checkerid': row.checkerid,
        'content': row.checkerinput,
        'complete': 1
      }).then(response => {
        fetchArticle(row.articleid).then(article => {
          article = article['data']
          article.status = 3
          console.log(article)
          changeArticleStatus(article.id, article).then(response => {
            that.$message({
              message: '文章已经通过',
              type: 'success'
            })
            that.getList()
          })
        })
      })
    },
    async unpass(row) {
      // let that = this
      await updateCheck(row.id, {
        'id': row.id,
        'articleid': row.articleid,
        'checkerid': row.checkerid,
        'content': row.checkerinput,
        'complete': 1
      })
      let article = await fetchArticle(row.articleid)
      article = article['data']
      article.status = 2
      console.log(article)
      await changeArticleStatus(article.id, article)
      this.$message({
        message: '文章已经通过',
        type: 'success'
      })
      this.$message({
        message: '文章未被通过',
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
