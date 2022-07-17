const express = require('express')
const uuid = require('uuid');
const app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
// let allowCrossDomain = function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', "*");
//   res.header('Access-Control-Allow-Headers', "*");
//   next();
// }
// app.use(allowCrossDomain);
const cors = require('cors');


app.use(cors())



  let stacksData = [{id:1, stack:[12,211]}]

  let operandsData = ['add', 'substruct','multiply', 'divide']
  

  //Stacks Api
  app.get('/rpn/stack', (request, response) => {
    response.json(stacksData)
  })

  app.get('/rpn/stack/:id', (request, response) => {
    const id = request.params.id
    let stackById = stacksData.find(item => item.id == id)
    response.json(stackById)
  })

  app.post('/rpn/stack', (request, response) => {
    const newStack = {
      id: uuid.v4(),
      stack: []
    }
    stacksData.push(newStack)
    response.json(newStack.id)
  })

  app.delete('/rpn/stack/:id', (request, response) => {
    const id = request.params.id
    stacksData = stacksData.filter(item => item.id != id)
    response.json({deleted:true})
  })
  
  app.post('/rpn/stack/:id', (request, response) => {
    const id = request.params.id
    const value = request.body.value
    let stackById = stacksData.find(item => item.id == id)
    let stackIndex = stacksData.indexOf(stackById)
    stacksData[stackIndex].stack.push(value)
    
    response.json(stacksData[stackIndex])
  })


  //Operands Api
  app.get('/rpn/op', (request, response) => {
    response.json(operandsData)
  })
  
  app.post('/rpn/op/:op/stack/:id', (request, response) => {
    const stackId = request.params.id
    const operandName = request.params.op

    let stackById = stacksData.find(item => item.id == stackId)
    let tmpStack = stackById.stack
    let stackIndex = stacksData.indexOf(stackById)

    let values = tmpStack.splice(tmpStack.length-2)
    switch (operandName) {
      case 'add':
        tmpStack.push(values[0] + values[1])
        break;
      case 'substract':
        tmpStack.push(values[0] - values[1])
        break;
      case 'multiply':
        tmpStack.push(values[0] * values[1])
        break;
      case 'divide':
        tmpStack.push(values[0] / values[1])
        break;
    
      default:
        break;
    }
    stacksData[stackIndex].stack= tmpStack    
    response.json(stacksData[stackIndex])
  })



  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })