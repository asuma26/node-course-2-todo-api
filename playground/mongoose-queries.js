const {ObjectId}=require('mongodb');
const {mongoose}=require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');
const {User}=require('./../server/models/user');
var id='5a59a5edabd4b143d19a4173';

if(!ObjectId.isValid(id)){
  console.log('Id nod VAlid!!!');
}
// Todo.find({
//   _id: id
// }).then((todos)=>{
//   console.log('Todos',todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo)=>{
//   console.log('Todos',todo);
// });

// Todo.findById(id).then((todo)=>{
//   if(!todo)
//   {// when the id is not found!!
//     return console.log('Id not found!');
//   }
//     console.log('Todo By id',todo);
// }).catch((e)=>console.log(e));

User.findById('5a59a5edabd4b143d19a4173').then((user)=>{
  if(!user)
  {// when the id is not found!!
    return console.log('Id not found!');
  }
    console.log(JSON.stringify(user,undefined,2));
}).catch((e)=>console.log(e));
