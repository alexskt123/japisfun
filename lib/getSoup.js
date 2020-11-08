import axios from 'axios'
import JSSoup from 'jssoup';

async function getContent(level, target) {
    const response = await axios(`https://www.sigure.tw/learn-japanese/vocabulary/${level}/${target}`)

    return response.data
}

async function getResponse({ level, target }) {
    const response = await getContent(level, target)

    let soup = new JSSoup(response)

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
                    tmpObj[tmpHeader[tdIdx]] = td.nextElement._text || td.nextElement.text
                }

            })

            if (trIdx !== 0)
                tmpArr.push(tmpObj)

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
