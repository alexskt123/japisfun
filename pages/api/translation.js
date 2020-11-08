//GET https://api.wit.ai/

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import translate from 'translate'
import { tify } from 'chinese-conv'

async function getMessage (inputText) {

  const text = await translate(inputText, { from: 'ja', to: 'zh' } );
  return tify(text)

}


export default  async (req, res) => {

  translate.engine = 'google'
  translate.key = process.env.GOOGLE_TRANSLATION_API


  const {query:q} = req.query
  const transResponse = await getMessage (q)

  res.statusCode = 200
  res.json(transResponse)
}
