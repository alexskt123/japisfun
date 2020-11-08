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

export const setWords = async (dataSet) => {

  dataSet.forEach(data => {
    fire.firestore()
      .collection('words')
      .doc(data['日文']).set(data, { merge: true });
  })
}

export const getWords = async () => {
  const wordsSnapShot = await fire.firestore()
    .collection('words')
    .get()

  let dataSet = []

  wordsSnapShot.forEach(doc => {
    dataSet.push({ ...doc.data() })
  })

  return dataSet
}


export const getHistory = async (from) => {

  const historySnapShot = await fire.firestore()
    .collection('history')
    .where('from', '==', from)
    .limit(1)
    .get()

  let history = { ...translateData }

  historySnapShot.forEach(doc => {
    history = { ...doc.data() }
  })

  return history

}
