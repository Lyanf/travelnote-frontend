<template>
  <div style="width: 500px" id="note" class="app-container" />
</template>
<script>
import { fetchArticle } from '@/api/newtest'

export default {
  name: 'Index',
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
    async getList() {
      const { data } = await fetchArticle(1576744572006)
      console.log(data)
      document.getElementById('note').innerHTML = data['content']
    }
  }
}
</script>

<style scoped>

</style>
