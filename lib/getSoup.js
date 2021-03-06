import axios from 'axios'
import JSSoup from 'jssoup'

async function getContent(level, target) {
  const response = await axios(`https://www.sigure.tw/learn-japanese/vocabulary/${level}/${target}`)

  return response.data
}

async function getResponse({ level, target }) {
  const response = await getContent(level, target)


  const type = (target.match(/(?<=-).*(?=-)/) || [])[0]
  const category = (target.match(/(?<=-)[^-]*(?=\.php)/) || [])[0]

  const soup = new JSSoup(response)

  const td = soup.findAll('div')
  const tmpArr = []
  let tmpObj = {}
  const tmpHeader = []

  soup.findAll('th').forEach((item, idx) => {
    if (idx <= 4) {
      tmpHeader.push(item.nextElement._text)
    }
  })

  td.filter(x => x.attrs.class && x.attrs.class === 'content').forEach(item => {
    (item.find('table').findAll('tr') || []).forEach((tr, trIdx) => {

      tmpObj = {}

      tr.findAll('td').forEach((td, tdIdx) => {
        const content = td.nextElement._text || td.nextElement.text || td.nextElement.nextElement._text || td.nextElement.nextElement.text
        tmpObj[tmpHeader[tdIdx]] = String(content).replace(/-|(&nbsp;)/g, '')

      })

      if (trIdx !== 0) {
        delete tmpObj['發音']
        tmpObj['詞類'] = type
        tmpObj['分類'] = category
        tmpObj['難度'] = level
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
