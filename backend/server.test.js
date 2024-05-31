// server.test.js
const {MongoMemoryServer} = require('mongodb-memory-server')
const supertest = require('supertest');
const {server} = require('./server');
const requestWithSupertest = supertest(server)
const mongoose = require('mongoose');
const User = require("./models/User")
// const connection = process.env.MONGODB_URI;

let mongoServer;

let roomid;

beforeAll(async () => {
    await mongoose.disconnect();
    mongoServer = await MongoMemoryServer.create();
    const mongoUri =  mongoServer.getUri();
    await mongoose.connect(mongoUri)

    console.log("Database Connected Successfully");
});

afterAll(async () => {
    
    await mongoose.disconnect();
    await mongoServer.stop();
    await new Promise(resolve => server.close(resolve));
    console.log("Database Connection Closed");
  });


describe('create new account one', () => {
  test('should return success: true', async () => {
    const newUser = {
      data: {
        name: 'John Smith',
        email: 'smith@example.com',
        role: 'Doctor',
        department: 'IT',
        address: '123 Main St',
        gender: 'male',
        password: 'password123',
        phonenum: '1234567890'
      }
    };
    const res = await requestWithSupertest.post('/auth/newAccount')
    .send(newUser)
    .expect(200)
    .then(async(response)=>{
    expect(response.body.success).toEqual(true);
    console.log(response.statusCode)
    })
    
  })
})

describe('create new account tow', () => {
  test('should return success: true', async () => {
    const newUser = {
      data: {
        name: 'John Locker',
        email: 'locker@example.com',
        role: 'Doctor',
        department: 'IT',
        address: '342 Main St',
        gender: 'male',
        password: '123456789',
        phonenum: '1234567890'
      }
    };
    const res = await requestWithSupertest.post('/auth/newAccount')
    .send(newUser)
    .expect(200)
    .then(async(response)=>{
    expect(response.body.success).toEqual( true);
    console.log(response.statusCode)
    })
    
  })
})

describe('getting data from database ', () => {
  test('should return all users in database ', async () => {
    const res = await requestWithSupertest.get('/auth/allAccount')
    expect(res.statusCode).toEqual(200)
    console.log(res.body[0].email)
    expect(res.body[0].email).toEqual("smith@example.com")
    expect(res.body[1].email).toEqual("locker@example.com")
  })
})


describe('should return error if user already exist', ()=>{
  test("should return error message", async()=>{
    const existingUser = {
      data: {
        name: 'John Smith',
        email: 'smith@example.com',
        role: 'user',
        department: 'IT',
        address: '123 Main St',
        gender: 'male',
        password: 'password123',
        phonenum: '1234567890'
      }
    };
  
    const res = await requestWithSupertest.post('/auth/newAccount')
    .send(existingUser)
    .expect(200)
    .then(async(response)=>{
      expect(response.body).toEqual({success: false, error: "User already existed"})
    })
  })

})


describe('delete user from database', ()=>{
  test("should delete an existing user, and return success : true", async()=>{
    const res = await requestWithSupertest.post('/auth/deleteAccount')
    .send({email: "locker@example.com"})
    .expect(200)
    .then(async(response)=>{
      expect(response.body).toEqual({success: true})
    })
    
  })
})


describe('delete a user that is not exist from database', ()=>{
  test("should return error message", async()=>{
    const res = await requestWithSupertest.post('/auth/deleteAccount')
    .send({email: "error@example.com"})
    .expect(404)
    .then(async(response)=>{
      expect(response.body).toEqual({success: false, error: "User not found"  })
    })
    
  })
})

describe('test login feature with success login', ()=>{
  test("should return success : true ", async()=>{

    const dataSend = { 
        email: "smith@example.com",
        password : "password123"
          
    }
    const res = await requestWithSupertest.post('/auth/login')
    .send(dataSend)
    .then(async(response)=>{
      expect(response.body.success).toEqual(true)
    })
    
  })
})

describe('test login feature with invalid password', ()=>{
  test("should return success : true ", async()=>{

    const dataSend = { 
        email: "smith@example.com",
        password : "123"
          
    }
    const res = await requestWithSupertest.post('/auth/login')
    .send(dataSend)
    .then(async(response)=>{
      expect(response.body).toEqual({ success: false, error: "Invalid credentials" })
    })
    
  })
})

describe('recovery password for user', ()=>{
  test("should return success true ", async()=>{

    const dataSend = {
      data:{
        email: "smith@example.com",
        newPW : "123456"
      }
    }
    const res = await requestWithSupertest.post('/auth/passwordRecovery')
    .send(dataSend)
    .expect(200)
    .then(async(response)=>{
      expect(response.body).toEqual({success: true})
    })
    
  })
})

describe('recovery password for user that is not exist', ()=>{
  test("should return with status code 400 ", async()=>{

    const dataSend = {
      data:{
        email: "nonexist@example.com",
        newPW : "123456"
      }
    }
    const res = await requestWithSupertest.post('/auth/passwordRecovery')
    .send(dataSend)
    .expect(400)
    .then(async(response)=>{
      expect(response.body).toEqual({success: false, error : "Password recovery failed. No such user"})
    })
    
  })
})




describe('Get all users that are doctors', ()=>{
  test("should return doctors' information", async()=>{
    const res = await requestWithSupertest.get('/users/doctors')
    .expect(200)
    .then(async(response)=>{
      expect(response.body.doctors[0].email).toEqual("smith@example.com")
     
    })
    
  })
})


describe('Get all patients info', ()=>{
  test("should return patients' information", async()=>{
    let patientinfo = {
      firstName : "Allen",
      lastName : "Walker",
      dateOfBirth : "2022-03-25",
      gender: "male",
      bloodGroup : "A",
      bloodPressure : "123",
      temperature : "78",
      pulse : "99",
      assignedDoctor : "John Smith",
      status : "in-patient",
      email : "some@example.com",
      phone : "1234567892",
      address : "123 main street"
    }
    const res = await requestWithSupertest.post('/patientsManager')
    .send(patientinfo)
    .expect(200)
    .then(async(response)=>{
      expect(response.body.patient.email).toEqual("some@example.com")
     
    })
    
  })
})
