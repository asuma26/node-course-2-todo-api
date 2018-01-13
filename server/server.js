var express=require('express');
var bodyParser=require('body-parser');
const {ObjectId}=require('mongodb');

var {mongoose}=require('./db/mongoose');//destructuring
var {Todo}=require('./models/todo');
var {User}=require('./models/user');

var app=express();

app.use(bodyParser.json());

//post
app.post('/todos',(req,res)=>{
//  console.log(req.body);
var todo=new Todo({
  text:req.body.text
});

todo.save().then((doc)=>{
  res.send(doc);
},(e)=>{
  res.status(400).send(e);
});
});

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});  //by sending this in { } form u can add some custom status code

  },(e)=>{
    res.status(400).send(e);//console.log(e);
  });
});

app.get('/todos/:id',(req,res)=>{
   var id=req.params.id;// parameters of request bodyParser
   // res.send(req.params);
   if(!ObjectId.isValid(id))
   {
     return res.status(404).send({});
   }
   Todo.findById(id).then((todo)=>{
     if(!todo)
     {
       res.status(400).send({});
     }
     res.send({todo});
   },(e)=>{
     res.status(400).send({});
   });
});

app.listen(3000,()=>{
  console.log('started on port 3000');
});
module.exports={app};
