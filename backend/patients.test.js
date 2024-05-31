const {MongoMemoryServer} = require('mongodb-memory-server')
const supertest = require('supertest');
const {server} = require('./server');
const requestWithSupertest = supertest(server)
const mongoose = require('mongoose');
const User = require("./models/User")
// const connection = process.env.MONGODB_URI;

let mongoServer;

let patient1ID;

let patient2ID;

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

  describe('Create patient for testing ', ()=>{
    test("should return success information", async()=>{
        const data = {
            firstName : "smith",
            lastName : "john",
            dateOfBirth : "1993-07-28",
            gender : "male",
            bloodGroup: "B",
            bloodPressure: "100",
            temperature: "98",
            pulse: "85",
            assignedDoctor: "Lin",
            status: "in-patient",
            email: "abc@gmail.com",
            phone: "123-458-8459",
            address: "123 main st",
          }
      const res = await requestWithSupertest.post('/patientsManager')
      .send(data)
      .then(async(response)=>{
        patient1ID = response.body.patient._id;
        // console.log("id" + patient1ID)
        expect(response.body.patient.firstName).toEqual("smith")
      })
      
    })
  })

  describe('Create another patient for testing ', ()=>{
    test("should return success information", async()=>{
        const data = {
            firstName : "ada",
            lastName : "wong",
            dateOfBirth : "1993-07-28",
            gender : "female",
            bloodGroup: "B",
            
            bloodPressure: "100",
            temperature: "98",
            pulse: "85",
            assignedDoctor: "Lin",
            status: "in-patient",
            email: "abc@gmail.com",
            phone: "123-458-8459",
            address: "123 main st",
          }
      const res = await requestWithSupertest.post('/patientsManager')
      .send(data)
      .then(async(response)=>{
        patient2ID = response.body.patient._id;
        // console.log("id" + patient1ID)
        expect(response.body.patient.firstName).toEqual("ada")
      })
      
    })
  })

  describe('Create  patient with missing field ', ()=>{
    test("should return error message", async()=>{
        const data = {
            lastName : "wong",
            dateOfBirth : "1993-07-28",
            gender : "female",
            bloodGroup: "B",
            bloodPressure: "100",
            temperature: "98",
            pulse: "85",
            assignedDoctor: "Lin",
            status: "in-patient",
            email: "abc@gmail.com",
            phone: "123-458-8459",
            address: "123 main st",
          }
      const res = await requestWithSupertest.post('/patientsManager')
      .send(data)
      .expect(400)
      .then(async(response)=>{
        // console.log("id" + patient1ID)
        expect(response.body).toEqual({ success: false, error: "Please provide all fields" })
      })
      
    })
  })

  describe('get all patient information', ()=>{
    test("checking with created patients", async()=>{
       
      const res = await requestWithSupertest.get('/patientsManager')
      .expect(200)
      .then(async(response)=>{
        // console.log("id" + patient1ID)
        expect(response.body.success).toEqual(true)
        expect(response.body.patients[0].firstName).toEqual("smith")
        expect(response.body.patients[1].firstName).toEqual("ada")
      })
      
    })
  })

  describe('get a specific patient information', ()=>{
    test("checking if we get right patient info", async()=>{
       
      const res = await requestWithSupertest.get(`/patientsManager/${patient1ID}`)
      .expect(200)
      .then(async(response)=>{
        // console.log("id" + patient1ID)
        expect(response.body.success).toEqual(true)
        expect(response.body.patient.firstName).toEqual("smith")
      })
      
    })
  })

  describe('get a specific patient with invalid patient id ', ()=>{
    test("should return error message", async()=>{
       
      const res = await requestWithSupertest.get(`/patientsManager/123`)
      .then(async(response)=>{
        // console.log("id" + patient1ID)
        expect(response.body).toEqual({ success: false, error: "Cast to ObjectId failed for value \"123\" (type string) at path \"_id\" for model \"Patient\""})
      })
      
    })
  })
  

  describe('delete a specific patient with patient id ', ()=>{
    test("should return error message", async()=>{
       
      const res = await requestWithSupertest.delete(`/patientsManager/${patient2ID}`)
      .expect(200)
      .then(async(response)=>{
       
        expect(response.body).toEqual({ success: true, message: "Patient deleted successfully" })
      })
      
    })
  })
  
  describe('delete a specific patient with invalid patient id ', ()=>{
    test("should return error message", async()=>{
       
      const res = await requestWithSupertest.delete(`/patientsManager/123`)
      .then(async(response)=>{
        // console.log("id" + patient1ID)
        expect(response.body).toEqual({ success: false, error: "Cast to ObjectId failed for value \"123\" (type string) at path \"_id\" for model \"Patient\""})
      })
      
    })
  })

  describe('Edit a specific patient with patient id ', ()=>{
    test("should return error message", async()=>{

        const data = {
            firstName : "locker",
            lastName : "heart",
            dateOfBirth : "1993-07-28",
            gender : "male",
            bloodGroup: "B",
            bloodPressure: "100",
            temperature: "98",
            pulse: "85",
            assignedDoctor: "Lin",
            status: "in-patient",
            email: "abc@gmail.com",
            phone: "123-458-8459",
            address: "123 main st",
          }
       
      const res = await requestWithSupertest.put(`/patientsManager/${patient1ID}`)
      .send(data)
      .expect(200)
      .then(async(response)=>{
       
        expect(response.body.success).toEqual(true)
        expect(response.body.patient.firstName).toEqual("locker")
      })
      
    })
  })

  describe('Edit a specific patient with invalid patient id ', ()=>{
    test("should return error message", async()=>{

        const data = {
            firstName : "locker",
            lastName : "heart",
            dateOfBirth : "1993-07-28",
            gender : "male",
            bloodGroup: "B",
            bloodPressure: "100",
            temperature: "98",
            pulse: "85",
            assignedDoctor: "Lin",
            status: "in-patient",
            email: "abc@gmail.com",
            phone: "123-458-8459",
            address: "123 main st",
          }
       
      const res = await requestWithSupertest.put(`/patientsManager/123`)
      .send(data)
      
      .then(async(response)=>{
       
        expect(response.body).toEqual({ success: false, error: "Cast to ObjectId failed for value \"123\" (type string) at path \"_id\" for model \"Patient\""})

      })
      
    })
  })
  
