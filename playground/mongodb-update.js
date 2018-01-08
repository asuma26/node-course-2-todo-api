//const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');

var obj=new ObjectID("5a52615b4bf2d94058a3e8b1");
//console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(error,db)=>{
  if(error){
    return console.log('Unable to Connnect Mongodb Server!');
  }
  console.log('Connected to Mongodb Server');

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a53848a4dd91d68505d3776')
  }, {
    $set: {
      name:'Mishra'
    },
    $inc:{
      age:1
    }

  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  //db.close();//closes the connection
});
