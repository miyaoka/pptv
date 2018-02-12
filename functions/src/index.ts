import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

exports.addVideo = functions.https.onRequest((req, res) => {
  const text = req.query.text
  admin
    .firestore()
    .collection('videos')
    .doc()
    .set({ text })
    .then((result) => {
      console.log('Document successfully written!')
    })
    .catch((error) => {
      console.error('Error writing document: ', error)
    })
})
