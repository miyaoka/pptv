<template>
  <section class="container">
    <h1>articles</h1>
    <entry-item
      v-for="article in articles"
      :key="article.id"
      :article="article"
    />
  </section>
</template>

<script>
import axios from 'axios'
import EntryItem from '~/components/EntryItem.vue'

export default {
  components: {
    EntryItem
  },
  async asyncData() {
    const data = (await axios.get(process.env.PPTV_DATA_URL)).data
    return {
      articles: data.slice(0, 10)
    }
  }
}
</script>

<style>

</style>
