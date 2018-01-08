//const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');

//var obj=new ObjectID()
//console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(error,db)=>{
  if(error){
    return console.log('Unable to Connnect Mongodb Server!');
  }
  console.log('Connected to Mongodb Server');
      // toArray returns a promise
  // db.collection('Todos').find({completed: false}).toArray().then((docs)=>{
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs,undefined,2));//undefined for filter , 2 for spacing
  // },(err)=>{
  //   console.log('Unable to fetch data',err);
  // });
  db.collection('Users').find({name:'Ashish'}).toArray().then((docs)=>{
  //  console.log(`Todos count: ${count}`);
  console.log('Todos: ');
  console.log(JSON.stringify(docs,undefined,2));
  //undefined for filter , 2 for spacing
  },(err)=>{
    console.log('Unable to fetch data',err);
  });
  //db.close();//closes the connection
});
