<template>
  <ArticleSearch @searchEvent="filter" />
</template>

<script>
import ArticleSearch from '@/components/ArticleSearch/index'
export default {
  name: 'Index',
  components: { ArticleSearch },
  methods: {
    filter(filterObj) {
      console.log(filterObj)
    }
  }
}
</script>

<style scoped>
.el-card{
  margin-left: 50px;
  margin-right: 50px;
  margin-top: 30px;
}
</style>
