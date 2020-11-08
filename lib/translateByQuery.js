import axios from 'axios'

export const translateByQuery = async query => {
  const response = await axios(`/api/translation?query=${query}`)

  return response
}
