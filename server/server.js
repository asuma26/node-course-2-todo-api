const _=require('lodash');
const express=require('express');
const bodyParser=require('body-parser');
const {ObjectId}=require('mongodb');

var {mongoose}=require('./db/mongoose');//destructuring
var {Todo}=require('./models/todo');
var {User}=require('./models/user');

const port=process.env.PORT||3000;
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
       return res.status(404).send({});
     }
     res.send({todo});
   },(e)=>{
     res.status(400).send({});
   });
});

app.delete('/todos/:id',(req,res)=>{
 var id=req.params.id;
    if(!ObjectId.isValid(id))
    {
      return res.status(404).send();
    }
  Todo.findByIdAndRemove(id).then((result)=>{
    if(!result)
    {
      return res.status(404).send();

    }
   res.status(200).send({todo:result});

  }).catch((e)=>{
    res.status(400).send(e);
  })

});

app.patch('/todos/:id',(req,res)=>{
  var id=req.params.id;
  var body=_.pick(req.body,['text','completed']);// pick takes the object and it pull off only usefull property if they exist

  if(!ObjectId.isValid(id))
  {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed)&&body.completed){
    body.completedAt=new Date().getTime();
  }
  else {
    body.completed=false;
    body.completedAt=null;
  }
  Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
    if(!todo)
    {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
});
app.listen(port,()=>{
  console.log(`started up at port ${port}`);
});
module.exports={app};
