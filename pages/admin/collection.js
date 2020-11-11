import { Fragment, useEffect, useRef, useState } from 'react'
import { ControlledEditor } from '@monaco-editor/react'
import Cookies from 'js-cookie'

import fire from '../../config/fire-config'

import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

export default function Collection() {
  const [formValue, setFormValue] = useState() // for debounce
  const [collectionName, setCollectionName] = useState(Cookies.get('collection')) // for query
  const [collections, setCollections] = useState([]) // for result
  const [value, setValue] = useState() // for editor

  const valueGetter = useRef()

  useDebounce(
    async () => {
      if (!formValue) return
      Cookies.set('collection', formValue)
      setCollectionName(formValue)
    },
    1000,
    [formValue]
  )

  useEffect(() => {
    if (!collectionName) return

    fire.firestore()
      .collection(collectionName)
      .onSnapshot(snapShot => {
        const list = snapShot.docs.map(doc => ({ _id: doc.id, ...doc.data() }))
        setCollections(list)
      })
  }, [collectionName])

  useEffect(() => {
    setValue(JSON.stringify(collections, null, 2))
  }, [collections])

  const handleEditorDidMount = ref => {
    valueGetter.current = ref
  }

  const handleCollectionChange = e => {
    setFormValue(e.target.value)
  }

  return (
    <Fragment>
      <div className="mt-5 p-5">
        <h1><label htmlFor="collectionName">Collection</label></h1>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text>Firestore/</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl id="collectionName" placeholder="Collection Name" onKeyUp={handleCollectionChange} defaultValue={Cookies.get('collection')} />
        </InputGroup>
        <h1>Editor</h1>
        <ControlledEditor
          height="100vh"
          language="json"
          theme="dark"
          value={value}
          editorDidMount={handleEditorDidMount}
        />
      </div>
    </Fragment>
  )
}

export function useDebounce(callback, timeout, deps) {
  const timeoutId = useRef()

  useEffect(() => {
    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(callback, timeout)

    return () => clearTimeout(timeoutId.current)
  }, deps)
}
