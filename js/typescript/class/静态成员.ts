
/**
 * 单例：创建一个Mysql对象，通过这个对象来操作数据库
 * 如果我们不加以限制的话，这个Mysql是可以new出来多个对象的。每个都会暂用资源，而我们只需一个就够了。
 *  1）私有化构造函数，声明公共静态实例
 *  
 */
class Mysql{
    public static instance ;

    host: string ;
    port: number ;
    username:string ;
    password: string ;
    dbname: string ;

    private constructor(host='120.0.0.1',port=3306,username='root',password='xxx',dbname='my_db'){
        this.host = host ;
        this.port = port ;
        this.username = username ;
        this.password = password ;
    }
    public static getInstance(){
        if(!Mysql.instance) Mysql.instance = new Mysql() ;
        
        return Mysql.instance ;
    }

    query(){} 
    insert(){} 
    update(){}

}
let db = Mysql.getInstance() ;

db.query()
db.insert()
db.insert()