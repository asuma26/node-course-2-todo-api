const expect=require('expect');
const request=require('supertest');

const {app}=require('./../server');
const {Todo}=require('./../models/todo');
const {ObjectId}=require('mongodb');
const todos=[{
  _id:new ObjectId(),
  text:"First test todo"
},{
  _id:new ObjectId(),
  text:"Second test todo"
}];


// to clear the data in todos so that todos.length will be 1 on inserting 1st data
// let us run some code before each testcase
// we can some asynchronous here
beforeEach((done)=>{
  Todo.remove({}).then(()=>{
  return Todo.insertMany(todos);
    //done();
  }).then(()=>done());
});

describe('POST /todos',()=>{
  it('Should create a new todo',(done)=>{
    var text="Test todo text";

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);

    })
    .end((err,res)=>{
      if(err)
      {
        return done(err);//anything down below won't excuted

      }
      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=>done(e));// to catch the error if todo.find()
    });
  });

  it('Should not store todo on bad data',(done)=>{

    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err,res)=>{
      if(err)
      {
        return done(err);//anything down below won't excuted

      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
      //  expect(todos[0].text).toBe(text+'1');
        done();
      }).catch((e)=>done(e));// to catch the error if todo.find()
    });
  });
});

describe('Get /todos',()=>{
  it('should get all todos',(done)=>{
    request(app)
     .get('/todos')
     .expect(200)
     .expect((res)=>{
       expect(res.body.todos.length).toBe(2);
     })
     .end(done);
  });
});


describe('Get /todos/:id',()=>{
  it('Should return todo doc ',(done)=>{
  request(app)
  .get(`/todos/${todos[0]._id.toHexString()}`)
  .expect(200)
  .expect((res)=>{
    expect(res.body.todo.text).toBe(todos[0].text);
  })
  .end(done);
});

it('Should return 404 if todo not found',(done)=>{
  var id=new ObjectId();
  request(app)
  .get(`/todos/${id.toHexString()}`)
  .expect(404)
  .end(done);
});

it('Should return 404 for non-object ids',(done)=>{

  request(app)
  .get('/todos/122')
  .expect(404)
  .end(done);
})

});
