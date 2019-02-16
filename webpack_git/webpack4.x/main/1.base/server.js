
let express = require('express')

let app = express()

app.get('/api/user',(req,res)=>{
  res.json({name: 'feifei'})
})

app.listen(9999)