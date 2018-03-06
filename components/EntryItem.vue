<template>
  <article>
    <header>
      <h2>{{article.title}}</h2>
      <small>{{article.date | date}}</small>
      <small>{{article.author}}</small>
    </header>
    <div>
      <img :src="thumbnail">
      <div>{{article.desc}}</div>
    </div>
  </article>
</template>

<script>
import { DateTime } from 'luxon'

const baseUrl = 'http://portal.nifty.com'
export default {
  filters: {
    date(time) {
      return DateTime.fromMillis(time, { zone: 'Asia/Tokyo' }).toFormat('yyyy年MM月dd日')
    }
  },
  props: {
    article: { type: Object }
  },
  computed: {
    thumbnail() {
      return baseUrl + this.article.thumbnail
    },
    link() {
      return baseUrl + this.article.baseUrl
    }
  }
}
</script>

<style>

</style>
