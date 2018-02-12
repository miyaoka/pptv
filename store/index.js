import 'firebase/firestore'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const videosRef = db.collection('videos')

export const state = () => ({
  videos: [
    {
      url: '',
      title: '',
      author: '',
      date: 0,
      duration: 0,

      comment: '',
      thumbnail: '',

      commentator: '',
      commentary: '',

      youtube: '',
      flash: ''
    }
  ],
  authors: []
})
export const mutations = {
  ...firebaseMutations
}
export const getters = {
  videos: (state) => state.videos
}
export const actions = {
  addVideo: firebaseAction((ctx, { text }) => {
    videosRef.add({ text })
  }),
  bindVideos: firebaseAction(({ bindFirebaseRef }) => {
    bindFirebaseRef('videos', videosRef)
  })
}
// export const plugins = [(store) => store.dispatch('bindVideos')]
