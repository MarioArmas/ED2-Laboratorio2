import { huffmanEncoding, encode, decode } from './huffman.js'

let mainRoot = null
let sortedByName = true

const compareByName = (person1, bool, person2) => {
  if (bool === '==') {
    return person1.name == person2.name
  }

  if (bool === '>') {
    return person1.name > person2.name
  }

  if (bool === '<') {
    return person1.name < person2.name
  }
}

const compareByDPI = (person1, bool, person2) => {
  if (bool === '==') {
    return person1.dpi == person2.dpi
  }

  if (bool === '>') {
    return person1.dpi > person2.dpi
  }

  if (bool === '<') {
    return person1.dpi < person2.dpi
  }
}

const insert = (key) => {
  const func = sortedByName ? compareByName : compareByDPI
  mainRoot = insertNode(mainRoot, key, func)
}

const remove = (key) => {
  sortByDPI()

  const func = sortedByName ? compareByName : compareByDPI
  mainRoot = removeNode(mainRoot, key, func)
}

const update = (key) => {
  updateNode(mainRoot, key)
}

const search = (key) => {
  sortByName()
  const items = searchNode(mainRoot, key, [])
  
  return items
}

const insertNode = (root, key, compare) => {
  if (root == null) {
    return Node = {
      "person": key,
      "left": null,
      "right": null,
      "height": 1
    }
  }
  if (compare(key, '<', root.person)) {
    root.left = insertNode(root.left, key, compare)
  }
  else {
    root.right = insertNode(root.right, key, compare)
  }

  // Balance
  root.height = 1 + Math.max(getHeight(root.left), getHeight(root.right))
  const balanceFactor = getBalance(root)

  if (balanceFactor > 1) {
    if (compare(key, '<', root.left.person)) {
      return rightRotation(root)
    }
    else {
      root.left = leftRotation(root.left)
      return rightRotation(root)
    }
  }

  if (balanceFactor < -1) {
    if (compare(key, '>', root.right.person)) {
      return leftRotation(root)
    }
    else {
      root.right = rightRotation(root.right)
      return leftRotation(root)
    }
  }

  return root
}

const removeNode = (root, key, compare) => {
  if (root == null) {
    return root
  }

  if (compare(key, '<', root.person)) {
    root.left = removeNode(root.left, key, compare)
  }
  else if (compare(key, '>', root.person)) {
    root.right = removeNode(root.right, key, compare)
  }
  else {
    if (root.left == null) {
      const temp = root.right
      root = null
      return temp
    }
    else if (root.right == null) {
      const temp = root.left
      root = null
      return temp
    }

    const temp = getMinValueNode(root.right)
    root.person = temp.person
    root.right = removeNode(root.right, temp.person, compare)
  }

 if (root == null) return root

  // Balance
  root.height = 1 + Math.max(getHeight(root.left), getHeight(root.right))  
  const balanceFactor = getBalance(root)

  if (balanceFactor > 1) {
    if (getBalance(root.left) >= 0) {
      return rightRotation(root)
    }
    else {
      root.left = leftRotation(root.left)
      return rightRotation(root)
    }
  }
  if (balanceFactor < -1) {
    if (getBalance(root.right) <= 0) {
      return leftRotation(root)
    }
    else {
      root.right = rightRotation(root.right)
      return leftRotation(root)
    }
  }
  return root
}

const updateNode = (root, key) => {
  if (root == null) return

  updateNode(root.left, key)
  if (root.person.name == key.name & root.person.dpi == key.dpi) {
    if (key.hasOwnProperty('address')) root.person.address = key.address
    if (key.hasOwnProperty('dateBirth')) root.person.dateBirth = key.dateBirth
    return
  }
  updateNode(root.right, key)
}

const searchNode = (root, key, items = []) => {
  sortByName()
  if (root == null) return

  if (key.name <= root.person.name) searchNode(root.left, key, items)
  if (root.person.name == key.name) items.push(root.person)
  if (key.name >= root.person.name) searchNode(root.right, key, items)

  return items
}

const getHeight = (root) => {
  if (root == null) return 0
  
  return getMinValueNode(root.left)
}

const getBalance = (root) => {
  if (root == null) return 0
  return getHeight(root.left) - getHeight(root.right)
}

const leftRotation = (z) => {
  y = z.right
  T2 = y.left
  y.left = z
  z.right = T2
  z.height = 1 + Math.max(getHeight(z.left), getHeight(z.right))
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right))
  return y
}

const rightRotation = (z) => {
  y = z.left
  T3 = y.right
  y.right = z
  z.left = T3
  z.height = 1 + Math.max(getHeight(z.left), getHeight(z.right))
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right))
  return y
}

const getMinValueNode = (root) => {
  if (root == null || root.left == null) return root
  return getMinValueNode(root.left)
}

const sortByName = () => {
  const items = inOrder(mainRoot)
  mainRoot = null
  sortedByName = true
  
  items.forEach(x => {
    insert(x)
  })
}

const sortByDPI = () => {
  const items = inOrder(mainRoot)
  mainRoot = null
  sortedByName = false
  
  items.forEach(x => {
    insert(x)
  })
}

const inOrder = (root, items = []) => {
  if (root == null) return

  inOrder(root.left, items)
  items.push(root.person)
  inOrder(root.right, items)

  return items
}

const showInOrder = (root) => {
  if (root != null) {
    showInOrder(root.left)
    console.log(root.person)
    showInOrder(root.right)
  }
}

const dictionary = {
  "INSERT": insert,
  "PATCH": update,
  "DELETE": remove,
}

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
    person.dpi = encode(person.dpi, dictLetters)
    person?.address
    person?.dateBirth
    dictionary[operationString](person)
  })

  console.log('SEARCH', search({ name: 'carmela' }).map(person => {
    return {...person, "dpi":decode(person.dpi, dictBinary)}
  }))
}

const { dictLetters, dictBinary } = huffmanEncoding('0123456789')
mainFunction(await readFile())