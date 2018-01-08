//const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');

//var obj=new ObjectID()
//console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(error,db)=>{
  if(error)
  {
    return console.log('Unable to Connnect Mongodb Server!');
  }
  console.log('Connected to Mongodb Server');
/*db.collection('Todos').insertOne({
  text:'something to do',
  completed:false
},(err,result)=>{
  if(err){
  return  console.log('Unable to insert todo',err);//return will stop the program for further access
  }
  console.log(JSON.stringify(result.ops,undefined,2));

});*/
/*db.collection('Users').insertOne({
  _id:126,
  name:'Ashish',
  age:21,
  location:'Delhi India'
},(err,result)=>{
  if(err){
    return console.log('Unable to insert data in Users',err);
  }
  console.log(JSON.stringify(result.ops,undefined,2));//.ops shows all data
});*/
  db.close();//closes the connection
});
