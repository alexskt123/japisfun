import fire from '../config/fire-config'
import translateData from './data/translateData'

export const setHistory = async (from, to) => {
  const myTimestamp = fire.firestore.Timestamp.now().toDate()

  const data = {
    from: from,
    to: to,
    time: myTimestamp
  }

  fire.firestore()
    .collection('history')
    .add(data)

  const increment = fire.firestore.FieldValue.increment(1)

  fire.firestore()
    .collection('history')
    .doc('summary')
    .set({ [from]: increment }, { merge: true })
}

export const getHistory = async (from) => {

  const historySnapShot = await fire.firestore()
    .collection('history')
    .where('from', '==', from)
    .limit(1)
    .get()

  let history = {...translateData}

  historySnapShot.forEach(doc => {
    history = {...doc.data()}
  })

  return history

}
