import fire from '../config/fire-config'
import translateData from './data/translateData'
import shuffle from 'shuffle-array'

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

export const getWordCount = async () => {
  let count = { idCount: 0, ansCount: 0 }

  const settingRef = await fire.firestore()
    .collection('setting')
    .doc('word')

  const doc = await settingRef.get()
  if (doc.exists) {
    count = { ...count, ...doc.data() }
  }

  return count
}

export const mutateWordDoc = async (data) => {
  let newRec = false

  const word = await fire.firestore()
    .collection('word')
    .where('日文', '==', data['日文'])
    .limit(1)
    .get()

  let docId
  word.forEach(item => {
    docId = item.id
    data.id = item.data().id
  })

  newRec = docId ? false : true

  const doc = docId ? await fire.firestore().collection('word').doc(docId) : await fire.firestore().collection('word').doc()
  await doc.set(data, { merge: true })

  return newRec
}


export const setWordDoc = async (dataSet) => {

  const list = []
  let { idCount: count } = await getWordCount()

  dataSet.map(item => {
    count = count + 1
    return { ...item, id: count }
  }).forEach(data => {
    list.push(mutateWordDoc(data))
  })

  const newRecList = await Promise.all(list)

  return newRecList.filter(x => x).length

}

export const setWords = async (dataSet) => {

  const newRecCnt = await setWordDoc(dataSet)

  const increment = fire.firestore.FieldValue.increment(newRecCnt)

  await fire.firestore()
    .collection('setting')
    .doc('word')
    .set({ ['idCount']: increment }, { merge: true })

}

export const getWords = async () => {
  const wordsSnapShot = await fire.firestore()
    .collection('words')
    .get()

  const dataSet = []

  wordsSnapShot.forEach(doc => {
    dataSet.push({ ...doc.data() })
  })

  return dataSet
}

export const getRandWords = async () => {

  const { idCount, ansCount } = await getWordCount()

  const idCountList = [...Array(idCount)].map((_item, idx) => {
    return idx + 1
  })

  shuffle(idCountList)
  const randQuestionNo = idCountList.slice(0, ansCount)

  console.log(randQuestionNo)

  const wordsSnapShot = await fire.firestore()
    .collection('word')
    .where('id', 'in', randQuestionNo)
    .get()

  const dataSet = []

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
