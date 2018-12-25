
class Subject{
    
    constructor(){
        this.status = 0 ;
        this.wacthers = [] ;
    }
    getState(){
        return this.status ;
    }
    setState(newState){
        this.status = newState ;
        this.notifyWacthers() ;
    }
    attach(wacther){
        this.wacthers.push(wacther)
    }
    notifyWacthers(){
        this.wacthers.forEach(item=>{
            item.update()
        })
    }

}

class Wacther {
    constructor(name,subject){
        this.name = name ;
        this.subject = subject ;
        this.subject.attach(this)
    }
    update(){
        console.log(`${this.name} update, state: ${this.subject.getState()}`)
    }
}

let s = new Subject() ;

let w1 = new Wacther('w1',s) ;
let w2 = new Wacther('w2',s) ;
let w3 = new Wacther('w3',s) ;

s.setState(1) ;
s.setState(3) ;
