<template>
  <section class="container">
    <h1>プープーテレビ検索</h1>
    <small><a href="http://portal.nifty.com/cs/dpztv/list/1.htm" target="_blank" rel="noopener">プープーテレビ</a>の全動画を検索します</small>

    <div>
      <div class="search">
        <input v-model="search" placeholder="検索">
      </div>

      <div class="authors">
        <button
          @click="selectedAuthor = null"
          :class="{selected: selectedAuthor === null}"
        >All ({{allArticles.length}})</button>
        <button
          v-for="author in authors"
          :key="author"
          :value="author"
          @click="selectedAuthor = author"
          :class="{selected: selectedAuthor === author}"
        >{{author}}
        </button>
      </div>

      <no-ssr>
        <div class="dateRange">
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
        </div>
      </no-ssr>

      →{{articles.length}}件
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <td>
              <button
                @click="isOlderFirst = !isOlderFirst"
              >{{ isOlderFirst ? '▼古い順' : '▲新しい順' }}</button>
            </td>
            <td>img</td>
            <td>author</td>
            <td>title</td>
            <td>desc</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="article in pagedArticles"
            :key="article.id"
          >
            <td>{{article.date | date}}</td>
            <td><img :src="article.thumbnail | link"></td>
            <td>{{article.author}}</td>
            <td><a :href="article.url | link" target="_blank" rel="noopener">{{article.title}}</a></td>
            <td>{{article.desc}}</td>
          </tr>
        </tbody>
      </table>

      <no-ssr>
        <infinite-loading @infinite="loadMore" ref="infiniteLoading">
          <span slot="no-results">
            no more articles
          </span>
          <span slot="no-more">
            no more articles
          </span>
        </infinite-loading>
      </no-ssr>
      <div class="page">
        {{pagedArticles.length}} / {{articles.length}}
      </div>
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
      return DateTime.fromMillis(time, { zone: 'Asia/Tokyo' }).toFormat('yyyy/MM/dd')
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
      selectedAuthor: null,
      search: '',
      dateSince: null,
      dateUntil: null,
      countPerPage: 30,
      showCounts: 0,
      isOlderFirst: false
    }
  },
  created() {
    this.initShowCounts()
  },
  computed: {
    ...mapState({ allArticles: 'articles' }),
    ...mapGetters(['authorMap']),
    articleFilters() {
      return [
        this.selectedAuthor,
        this.search,
        this.dateSince,
        this.dateUntil,
        this.isOlderFirst
      ].join()
    },
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
      if (this.isOlderFirst) {
        articles = articles.slice().reverse()
      }
      return articles
    },
    pagedArticles() {
      return this.articles.slice(0, this.showCounts)
    },
    authors() {
      return Object.keys(this.authorMap).sort(
        (a, b) => this.authorMap[b].length - this.authorMap[a].length
      )
    }
  },
  watch: {
    articleFilters() {
      this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
      this.initShowCounts()
    }
  },
  methods: {
    initShowCounts() {
      this.showCounts = this.countPerPage
    },
    loadMore($state) {
      setTimeout(() => {
        this.showCounts += this.countPerPage
        if (this.showCounts >= this.articles.length) {
          $state.complete()
        } else {
          $state.loaded()
        }
      }, 100)
    },
    dateFormatter(date) {
      return DateTime.fromJSDate(date, { zone: 'Asia/Tokyo' }).toFormat('yyyy/MM/dd')
    }
  }
}
</script>

<style lang="scss" scoped>
.authors {
  button {
    border: none;
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
}
.datePicker {
  display: inline-block;
}
.page {
  text-align: center;
}
</style>
