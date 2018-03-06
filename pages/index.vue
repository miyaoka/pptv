<template>
  <section class="container">
    <h1>articles</h1>

    <div>
      <select v-model="selectedAuthor">
        <option :value="null">All ({{allArticles.length}})</option>
        <option
          v-for="author in authors"
          :key="author"
          :value="author"
        >{{author}} ({{authorMap[author].length}})
        </option>
      </select>
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <td>date</td>
            <td>img</td>
            <td>author</td>
            <td>title</td>
            <td>desc</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="article in articles"
            :key="article.id"
          >
            <td>{{article.date | date}}</td>
            <td></td>
            <td>{{article.author}}</td>
            <td><a :href="article.url | link" target="_blank" rel="noopener">{{article.title}}</a></td>
            <td>{{article.desc}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import EntryItem from '~/components/EntryItem.vue'
import { DateTime } from 'luxon'

const baseUrl = 'http://portal.nifty.com'
export default {
  filters: {
    date(time) {
      return DateTime.fromMillis(time, { zone: 'Asia/Tokyo' }).toFormat('yyyy年MM月dd日')
    },
    link(url) {
      return baseUrl + url
    }
  },
  components: {
    EntryItem
  },
  data() {
    return {
      selectedAuthor: null
    }
  },
  computed: {
    ...mapState({ allArticles: 'articles' }),
    ...mapGetters(['authorMap']),
    articles() {
      return this.selectedAuthor ? this.authorMap[this.selectedAuthor] : this.allArticles
    },
    authors() {
      return Object.keys(this.authorMap).sort(
        (a, b) => this.authorMap[b].length - this.authorMap[a].length
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.author {
  border: 1px solid #999;
  padding: 0.2rem;
  outline: none;
  font-size: 0.8rem;
  opacity: 0.7;
  &.selected {
    background: #ffe;
    opacity: 1;
  }
  &:hover {
    cursor: pointer;
  }
}
</style>
