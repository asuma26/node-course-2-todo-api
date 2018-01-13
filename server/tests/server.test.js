const expect=require('expect');
const request=require('supertest');

const {app}=require('./../server');
const {Todo}=require('./../models/todo');

const todos=[{
  text:"First test todo"
},{
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

describe('Post /todos',()=>{
  it('should get all todos',(done)=>{
    request(app)
     .get('/todos')
     .expect(200)
     .expect((res)=>{
       expect(res.body.todos.length).toBe(2);
     })
     .end(done);
  });
})
