/*
function ast(a){
    let age = 22
}
 {
      "type": "FunctionDeclaration",
      "id": { //遍历的时候会有个进入这个对象遍历再出来去遍历其他的这个操作
        "type": "Identifier",
        "name": "ast",
      },
      "params": [
        {
          "type": "Identifier",
          "name": "a",
        }
      ],
      "body": {
        "type": "BlockStatement",
        "body": [
          {
            "type": "VariableDeclaration",
            "declarations": [
              {
                "type": "VariableDeclarator",
                "id": {
                  "type": "Identifier",
                  "name": "age",
                },
                "init": {
                  "type": "Literal",
                  "value": 22,
                  "raw": "22",
                }
              }
            ],
            "kind": "let",
      },
      "generator": false,
      "expression": false,
      "async": false,
    }



*/