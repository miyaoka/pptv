<template>
  <section class="container">
    <h1>articles</h1>

    <div>
      著者：<select v-model="selectedAuthor">
        <option :value="null">All ({{allArticles.length}})</option>
        <option
          v-for="author in authors"
          :key="author"
          :value="author"
        >{{author}} ({{authorMap[author].length}})
        </option>
      </select>

      検索：<input v-model="search">

      期間：
      <datepicker
        class="datePicker"
        v-model="dateSince"
        :format="dateFormatter"
        placeholder="開始日"
        clear-button
      />
      -
      <datepicker
        class="datePicker"
        v-model="dateUntil"
        :format="dateFormatter"
        placeholder="終了日"
        clear-button
      />
      →{{articles.length}}件
    </div>
    <div>
      page:
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
import Datepicker from 'vuejs-datepicker'
import { mapGetters, mapState } from 'vuex'
import EntryItem from '~/components/EntryItem.vue'
import { DateTime } from 'luxon'

const baseUrl = 'http://portal.nifty.com'
export default {
  filters: {
    date(time) {
      return DateTime.fromMillis(time, { zone: 'Asia/Tokyo' }).toFormat('yyyy/MM/dd')
    },
    link(url) {
      return baseUrl + url
    }
  },
  components: {
    Datepicker,
    EntryItem
  },
  data() {
    return {
      selectedAuthor: null,
      search: '',
      dateSince: null,
      dateUntil: null,
      countPerPage: 30
    }
  },
  computed: {
    ...mapState({ allArticles: 'articles' }),
    ...mapGetters(['authorMap']),
    articles() {
      let articles = this.selectedAuthor ? this.authorMap[this.selectedAuthor] : this.allArticles
      if (this.dateSince) {
        const d = this.dateSince.valueOf()
        articles = articles.filter((article) => d <= article.date)
      }
      if (this.dateUntil) {
        const d = this.dateUntil.valueOf()
        articles = articles.filter((article) => article.date <= d)
      }
      if (this.search !== '') {
        const r = new RegExp(this.search.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'), 'i')
        articles = articles.filter((article) =>
          [article.title, article.desc].some((text) => text.match(r))
        )
      }
      return articles.slice(0, this.countPerPage)
    },
    authors() {
      return Object.keys(this.authorMap).sort(
        (a, b) => this.authorMap[b].length - this.authorMap[a].length
      )
    }
  },
  methods: {
    dateFormatter(date) {
      return DateTime.fromJSDate(date, { zone: 'Asia/Tokyo' }).toFormat('yyyy/MM/dd')
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
.datePicker {
  display: inline-block;
}
</style>
