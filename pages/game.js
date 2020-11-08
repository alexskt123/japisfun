
import { Fragment, useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'

import { getWords } from '../lib/firebaseResult.js'
import { getRandMCQuestion } from '../lib/data/dataProcess'


export default function Home() {

  const [mc, setMC] = useState(null)
  const [words, setWords] = useState(null)
  const [nextMC, setNextMC] = useState(false)

  const handleClick = async (question, answer) => {
    words
      .filter(x=> (x['假名']===question || x['日文']===question))
      .filter(x=> x['中文']===answer)
      .length
      ? alert ('啱！') : alert ('唔啱！')
    setNextMC(!nextMC)
  }

  useEffect(() => {
    (async () => {

      const words = await getWords()
      const question = await getRandMCQuestion(words)

      setWords(words)
      setMC(question)

    })()

  }, [nextMC])

  if (!mc || !words) return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        {'Loading'}
      </Container>
    </Fragment>
  )

  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <Fragment>
          <Row>
            <Alert variant='dark'>
              {`問題： ${mc.question}`}
            </Alert>
          </Row>

          <Row>
            {mc.answer.map((item, idx) => {
              return (
                <Button onClick={() => { handleClick(mc.question, item) }}  key={idx} variant='outline-dark'>
                  {item}
                </Button>
              )
            })}
          </Row>


        </Fragment>
      </Container>

    </Fragment>
  )
}
