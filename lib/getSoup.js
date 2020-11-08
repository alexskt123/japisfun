import axios from 'axios'
import JSSoup from 'jssoup';

async function getResponse (grabItems) {
    const response = await axios(`/api/soup`, {
        params: grabItems
    })
  
    let soup = new JSSoup(response.data)
  
    let td = soup.findAll('div')
    let tmpArr = []
    let tmpObj = {}
    let tmpHeader = []
  
    td.filter(x => x.attrs.class && x.attrs.class === 'content').forEach(item => {
        (item.find('table').findAll('tr') || []).forEach((tr, trIdx) => {
  
            tmpObj = {}
  
            tr.findAll('td').forEach((td, tdIdx) => {
  
                if (trIdx === 0)
                    tmpHeader.push(td.nextElement.text)
                else {
                    tmpObj[tmpHeader[tdIdx]] = String(td.nextElement._text || td.nextElement.text).replace(/-/g, '')
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
  let soupArr = []
  let responseArr = []

  for (const item of grabItems) {
    responseArr = await getResponse(item)
    soupArr.push(...responseArr)
  }

  return soupArr
}
