import axios from 'axios'
import JSSoup from 'jssoup'

async function getContent(level, target) {
  const response = await axios(`https://www.sigure.tw/learn-japanese/vocabulary/${level}/${target}`)

  return response.data
}

async function getResponse({ level, target }) {
  const response = await getContent(level, target)

  const soup = new JSSoup(response)

  const td = soup.findAll('div')
  const tmpArr = []
  let tmpObj = {}
  const tmpHeader = []

  td.filter(x => x.attrs.class && x.attrs.class === 'content').forEach(item => {
    (item.find('table').findAll('tr') || []).forEach((tr, trIdx) => {

      tmpObj = {}

      tr.findAll('td').forEach((td, tdIdx) => {

        if (trIdx === 0)
          tmpHeader.push(td.nextElement.text)
        else {
          tmpObj[tmpHeader[tdIdx]] = String(td.nextElement._text || td.nextElement.text).replace(/-|(&nbsp;)/g, '')
        }

      })

      if (trIdx !== 0) {
        delete tmpObj['發音']
        tmpArr.push(tmpObj)

      }

    })
  })

  return tmpArr

}

export const getSoup = async (grabItems) => {
  const soupArr = []
  let responseArr = []

  for (const item of grabItems) {
    responseArr = await getResponse(item)
    soupArr.push(...responseArr)
  }

  return soupArr
}
