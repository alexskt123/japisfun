import shuffle from 'shuffle-array'

export const getRandMCQuestion = async (dataSet) => {
  
    shuffle(dataSet)
  
    const mcQuestion = dataSet.reduce((acc,cur,idx)=> {
      if (idx === 0) {
        acc['question'] = cur['假名'] ? cur['假名'] : cur['日文']
        acc['sound'] = cur['重音']
        acc['answer'] = []
        acc['answer'].push(cur['中文'])
      }
      else if (idx>=1 && idx<=3) {
        acc['answer'].push(cur['中文'])
      }
      else acc
      return acc
    },{})

    shuffle(mcQuestion['answer'])
  
  
    return mcQuestion
  }