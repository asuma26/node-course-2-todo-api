//const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');

var obj=new ObjectID("5a52615b4bf2d94058a3e8b1");
//console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(error,db)=>{
  if(error){
    return console.log('Unable to Connnect Mongodb Server!');
  }
  console.log('Connected to Mongodb Server');
// db.collection('Todos').deleteMany({test:'Eat lunch'}).then((result)=>{
//   console.log(result);
// });
// db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result)=>{
//   console.log(result);
// })

// db.collection('Todos').findOneAndDelete({completed:true}).then((result)=>{
//   console.log(result);
// });

// db.collection('Users').deleteMany({name:'Ashish'}).then((result)=>{
//   console.log(result);
// })

db.collection('Users').findOneAndDelete({_id:obj}).then((result)=>{
  console.log(result);
})
  //db.close();//closes the connection
});
