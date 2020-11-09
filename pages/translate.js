import { Fragment, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'

import { translateByQuery } from '../lib/translateByQuery'
import { getHistory, setHistory } from '../lib/firebaseResult.js'


export default function Translate() {

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [translatedValue, setTranslatedValue] = useState('')

  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (form.checkValidity() === false) {
      event.stopPropagation()

    } else {



      const history = await getHistory(formValue.translate)
      let translation = history.to

      if (!translation) {
        translation = (await translateByQuery(formValue.translate)).data
      }

      await setHistory(formValue.translate, translation)
      setTranslatedValue(translation)
    }
    setValidated(true)
  }


  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <Fragment>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label><Badge variant='dark'><h4>{'翻譯 - 日 轉 中'}</h4></Badge></Form.Label>
              <Form.Control required name="translate" as="textarea" rows={3} onKeyUp={(e) => handleChange(e)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              {'Submit'}
            </Button>
          </Form>
          {
            translatedValue &&
            <Alert key='translate' variant='dark' className="mt-3">
              {translatedValue}
            </Alert>
          }
        </Fragment>
      </Container>

    </Fragment>
  )
}
