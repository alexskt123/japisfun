
import { Fragment, useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'

import { getWords, setHistory } from '../lib/firebaseResult.js'
import { getRandMCQuestion } from '../lib/data/dataProcess'


export default function Home({words}) {

  const [mc, setMC] = useState(null)
  const [nextMC, setNextMC] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [correct, setCorrect] = useState(null)

  const handleClick = async (question, answer) => {
    if (words
      .filter(x=> (x['假名']===question || x['日文']===question))
      .filter(x=> x['中文']===answer)
      .length) {
        setCorrectCount(correctCount + 1)
        setCorrect('啱！')
      }
      else {
        setCorrect('唔啱！')
      }

    setTotalCount(totalCount + 1)
    setNextMC(!nextMC)
  }

  useEffect(() => {
    (async () => {

      const question = await getRandMCQuestion(words)
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
          <Row className="pl-3 mt-3">
            <Alert variant='danger'>
              {`問題： ${mc.question}`}
            </Alert>
            <Alert variant='success'>
              {`${correctCount} / ${totalCount}`}
            </Alert>
            <Alert variant='info'>
              {correct}
            </Alert>
          </Row>

          <Row className="pl-3">
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

export async function getStaticProps() {
  const words = await getWords()

  return {
      props: {
        words
      },
  }
}
