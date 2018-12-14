let express = require('express') ;
let app = express() ;
app.use(express.static(__dirname)) ;//以当前目录作为静态目录

app.listen(4444) ;