import { Fragment, useEffect, useRef } from 'react'

import Editor from 'jsoneditor'

export default function JSONEditor({ json }) {
  const ref = useRef(null)
  const editor = useRef(null)

  useEffect(() => {
    const container = ref.current
    const options = {}

    editor.current = new Editor(container, options)
  }, [ref])

  useEffect(() => {
    editor.current.set(json)
  }, [json])

  return (
    <Fragment>
      <div ref={ref}></div>
    </Fragment>
  )
}
