
import { Fragment, useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

import { translateByQuery } from '../lib/translateByQuery'

export default function Home() {

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

      const translation = await translateByQuery(formValue.translate)
      console.log(translation.data)

      setTranslatedValue(translation.data)
    }
    setValidated(true)
  }

  useEffect(() => {

  }, [])

  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <Fragment>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>{`Translate`}</Form.Label>
              <Form.Control required name="translate" as="textarea" rows={3} onKeyUp={(e) => handleChange(e)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              {`Submit`}
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
