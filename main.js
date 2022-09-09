import { huffmanEncoding, encode, decode } from './huffman.js'
import Tree from './tree.js'

const companyTree = new Tree

const dictionary = {
  "INSERT": companyTree.insert,
  "PATCH": companyTree.update,
  "DELETE": companyTree.remove,
}

const trees = {}

async function readFile() {
  const file = await fetch('input.csv')
  .then(response => response.text())
  .then(data => {
    return data.split('\r\n')
      .filter(el => el != '')
      .map(operation => {
        const text = operation.split(';')
        return [text[0], JSON.parse(text[1])]
      })
  })

  return file
}

async function mainFunction(data) {
  data.forEach((item) => {
    const operationString = item[0]
    const person = item[1]
    /* person.companies.forEach(companie => {
      trees[companie] ? trees[companie] : new 
    }) */
    person.dpi = encode(person.dpi, dictLetters) // TODO: HERE
    person?.address
    person?.dateBirth
    dictionary[operationString](person)
  })
  companyTree.sortByDPI()

  console.log('SEARCH', companyTree.search({ dpi: encode('9323924104051', dictLetters) }).map(person => {
    return {...person, "dpi":decode(person.dpi, dictBinary)}
  }))
}

const { dictLetters, dictBinary } = huffmanEncoding('0123456789')
mainFunction(await readFile())