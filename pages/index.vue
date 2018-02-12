<template>
  <section class="container">
    <h1>videos</h1>
    <div
      v-for="(video, i) in videos"
      :key="i">
      {{video}}
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  fetch({ store }) {
    store.dispatch('bindVideos')
  },
  computed: {
    ...mapGetters(['videos'])
  },
  methods: {
    ...mapActions(['addVideo'])
  }
}
</script>

<style>

</style>
