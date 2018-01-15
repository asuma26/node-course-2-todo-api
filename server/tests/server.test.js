const expect=require('expect');
const request=require('supertest');

const {app}=require('./../server');
const {Todo}=require('./../models/todo');
const {ObjectId}=require('mongodb');
const {User} = require('./../models/user');
const{todos,populatetodos,users,populateusers}=require('./seed/seed');


// to clear the data in todos so that todos.length will be 1 on inserting 1st data
// let us run some code before each testcase
// we can some asynchronous here
beforeEach(populateusers);
beforeEach(populatetodos);

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

describe('DELETE /todos/:id',()=>{
  it('Should remove a todo',(done)=>{
    var hexid=todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexid}`)
    .expect(200)
    .expect((res)=>{

      expect(res.body.todo._id).toBe(hexid);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.findById(hexid).then((todo)=>{
           expect(todo).toBe(null);
           done();
      }).catch((e)=>done(e));
    });
  });
  it('Should return 404 if id is valid and not found! ',(done)=>{
    var id=new ObjectId();
    request(app)
    .get(`/todos/${id.toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('Should return 404 if object id is invalid ',(done)=>{
    request(app)
    .get('/todos/122')
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be the new text!!';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });
});

describe('Get/users/me',()=>{

  it('Should return user if authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('Should return 401 if not authenicated!',(done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    })
    .end(done);
  });

});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});
