require('./config/config.js');

const _=require('lodash');
const express=require('express');
const bodyParser=require('body-parser');
const {ObjectId}=require('mongodb');

var {mongoose}=require('./db/mongoose');//destructuring
var {Todo}=require('./models/todo');
var {User}=require('./models/user');
var {authenticate}=require('./middleware/authenticate');
const port=process.env.PORT;
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


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


app.post('/users',(req,res)=>{
 var body=_.pick(req.body,['email','password']);
  var user=new User({
    email:body.email,
    password:body.password
  });
/// or var user=new User(body);
// u can remove the user in argument
user.save().then(()=>{
    //res.send(user);
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);//user is now set with token
  }).catch((e)=>{
    res.status(400).send(e);
  });

});
// app.post('/users', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   var user = new User(body);
//
//   user.save().then(() => {
//     return user.generateAuthToken();
//   }).then((token) => {
//     res.header('x-auth', token).send(user);
//   }).catch((e) => {
//     res.status(400).send(e);
//   })
// });
app.post('/users/login',(req,res)=>{

  var body=_.pick(req.body,['email','password']);
  //if user is not found catch get excuted!!
  User.findByCredentials(body.email,body.password).then((user)=>{
    return user.generateAuthToken().then((token) => {
       res.header('x-auth', token).send(user);
     });
  }).catch((e)=>{
    res.status(400).send();
  });


},(e)=>{
  res.status(404).send((e));
});

app.listen(port,()=>{
  console.log(`started up at port ${port}`);
});
module.exports={app};
