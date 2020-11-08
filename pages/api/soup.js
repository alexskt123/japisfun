const axios = require('axios').default

async function getContent(level, target) {

  
    
    const response = await axios(`https://www.sigure.tw/learn-japanese/vocabulary/${level}/${target}`)

    return response.data
}

export default  async (req, res) => {

    const {level, target} = req.query

    const witResponse = await getContent (level, target)
  
    res.statusCode = 200
    res.json(witResponse)
  }
  