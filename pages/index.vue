<template>
  <section class="container">
    <header class="title">
      <h1>プープーテレビ検索</h1>
      <div><a href="http://portal.nifty.com/cs/dpztv/list/1.htm" target="_blank" rel="noopener">プープーテレビ</a>の全動画を検索します</div>
    </header>

    <div class="filters">
      <section>
        <h3>キーワード絞り込み</h3>
        <div class="search">
          <input v-model="search" placeholder="検索">
        </div>
      </section>

      <section>
        <h3>製作者別</h3>
        <div class="authors">
          <div
            @click="selectAuthor(null)"
            :class="{selected: selectedAuthor === null}"
          >指定なし</div>
          <hr>
          <div
            v-for="author in authors"
            :key="author"
            :value="author"
            @click="selectAuthor(author)"
            :class="{selected: selectedAuthor === author}"
          >{{author}}
          </div>
        </div>
      </section>

      <no-ssr>
        <section class="dateRange">
          <h3>日付別</h3>
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
        </section>
      </no-ssr>

    </div>

    <main class="main">
      <div v-if="pagedArticles.length > 0">
        <div
          class="date-order"
          @click="isOlderFirst = !isOlderFirst"
        >{{ isOlderFirst ? '▼古い順' : '▲新しい順' }}</div>

        <div class="articles">
          <div
            v-for="article in pagedArticles"
            :key="article.id"
            class="article"
          >
            <div>{{article.date | date}}</div>
            <div>
              <a :href="article.url | link" target="_blank" rel="noopener">
                <img class="thumb" :src="article.thumbnail | link">
              </a>
            </div>
            <div>
              <span class="author" @click="selectAuthor(article.author)">{{article.author}}</span>
            </div>
            <div class="article-body">
              <h3>
                <a :href="article.url | link" target="_blank" rel="noopener">
                  {{article.title}}
                </a>
              </h3>
              <div>{{article.desc}}</div>
            </div>
          </div>

        </div>

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
      <div v-else>
        見つかりませんでした。
      </div>
    </main>

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
      if (this.$refs.infiniteLoading) {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
      }
      this.initShowCounts()
    }
  },
  methods: {
    selectAuthor(author) {
      this.selectedAuthor = author
    },
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
@import '~assets/css/mixin/_mediaquery.scss';
@import '~assets/css/_vars.scss';

.title {
  background: $clr-1;
  text-align: center;
  padding: 1rem;
}
.filters {
  background: $clr-2;
  padding: 1rem;

  display: grid;
  grid-gap: 1rem;

  .authors {
    div {
      display: inline-block;
      padding: 0.2rem;
      font-size: 1rem;
      &.selected {
        background: $clr-3;
        color: $clr-w-l;
      }
      &:hover {
        color: $clr-w-l;
        background: $clr-3-d;
        cursor: pointer;
      }
    }
  }
  .datePicker {
    display: inline-block;
  }
}

.main {
  padding: 1rem;
  background: $clr-w-ll;
  color: $clr-b;

  .date-order {
    display: inline-block;
  }
  .author {
  }

  .date-order,
  .author {
    &:hover {
      cursor: pointer;
      background: $clr-2;
    }
  }

  .article {
    display: grid;
    grid-template-columns: 80px 70px 80px auto;
    grid-gap: 0.5rem;
    font-size: 0.9rem;

    @include mq() {
      grid-template-columns: auto;
      grid-template-rows: auto;
      margin: 1rem 0;
    }

    &-body {
      a {
        display: block;
        color: $clr-b-d;
        font-size: 1.4rem;
        margin-bottom: 0.2rem;
        &:hover {
          // background: $clr-1;
          color: $clr-3-d;
        }
      }
    }
    .thumb {
      width: 70px;
    }
  }
  .page {
    text-align: center;
  }
}
</style>
