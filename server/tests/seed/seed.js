const {ObjectId}=require('mongodb');
const {Todo}=require('./../../models/todo');
const jwt=require('jsonwebtoken');
const {User}=require('./../../models/user');

const useroneId=new ObjectId();
const usertwoId=new ObjectId();
const users=[{
  _id: useroneId,
  email:'asu@gmail.com',
  password:'useronepass',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:useroneId,access:'auth'},'abc123').toString()
  }]
},{
  _id:usertwoId,
  email:'asdf@gmail.com',
  password:'usertwopass'

}];

const todos=[{
  _id:new ObjectId(),
  text:"First test todo"
},{
  _id:new ObjectId(),
  text:"Second test todo",
  completed:true,
  completedAt:13433468545
}];

const populatetodos=(done)=>{
  Todo.remove({}).then(()=>{
  return Todo.insertMany(todos);
    //done();
  }).then(()=>done());
};

const populateusers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};


module.exports={todos,populatetodos,users,populateusers};
