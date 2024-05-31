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

  describe('Add a  room one to resource', ()=>{
    test("should return newly created room information", async()=>{
      const room = {
        roomType : "patient",
        roomNumber: "101",
        filledStatus: "0/20"
      }
      const res = await requestWithSupertest.post('/api/roomRoute/addRoom')
      .send(room)
      .expect(200)
      .then(async(response)=>{
        expect(response.body.data.roomNumber).toEqual(101)
        expect(response.body.data.filledStatus).toEqual("0/20")
      })
      
    })
  })
  
  describe('Add a  room two to resource', ()=>{
    test("should return newly created room information", async()=>{
      const res = await requestWithSupertest.post('/api/roomRoute/addRoom')
      .send({roomType : "patient", roomNumber: "300", filledStatus: "0/10"})
      .expect(200)
      .then(async(response)=>{
        expect(response.body.data.filledStatus).toEqual("0/10")
        expect(response.body.data.roomNumber).toEqual(300)
      })
      
    })
  })
  
  describe('Add a  room without required field empty ', ()=>{
    test("should return code 400", async()=>{
      const res = await requestWithSupertest.post('/api/roomRoute/addRoom')
      .send({roomType : "patient"})
      .expect(400)
      .then(async(response)=>{
        expect(response.body).toEqual({ success: false, message: "Room type, room number, and filled status are required" })
      })
      
    })
  })
  
  
  describe('Getting all room information', ()=>{
    test("should return all room informaion", async()=>{
      const res = await requestWithSupertest.get('/api/roomRoute/allRoom')
      .expect(200)
      .then(async(response)=>{
        roomid = response.body[0]._id;
        expect(response.body[0].filledStatus).toEqual("0/20")
        expect(response.body[0].roomNumber).toEqual(101)
        expect(response.body[1].filledStatus).toEqual("0/10")
        expect(response.body[1].roomNumber).toEqual(300)
      })
      
    })
  })

  describe('Search room information with date', ()=>{
    test("should return room informaion", async()=>{

      const data = {
        date: "2024-05-25",
        roomType : "patient"
      }

      const res = await requestWithSupertest.get('/api/processRoute/searchRooms')
      .send(data)
      .then(async(response)=>{
        expect(response.body).toEqual({})
        
      })
      
    })
  })
  
  describe('Delete room info from database', ()=>{
    test("should return message Rooms deleted successfully", async()=>{
      console.log("from" + roomid)
      const res = await requestWithSupertest.post('/api/roomRoute/deleteRooms')
      .send({ids : roomid})
      .expect(200)
      .then(async(response)=>{
        expect(response.body).toEqual({deletedCount: 1,message: "Rooms deleted successfully",success: true,})
       
      })
      
    })
  })
  
  describe('Delete room that does not exist ', ()=>{
    test("should return error", async()=>{
      console.log("from" + roomid)
      const res = await requestWithSupertest.post('/api/roomRoute/deleteRooms')
      .send({ids : 123})
      .expect(500)
      .then(async(response)=>{
        expect(response.body).toEqual({ success: false, message: "Error deleting rooms", error: "Cast to ObjectId failed for value \"123\" (type number) at path \"_id\" for model \"Room\""})
       
      })
      
    })
  })

  describe('get type of room ', ()=>{
    test("return room type", async()=>{
      const res = await requestWithSupertest.post('/api/processRoute/getRoomTypes')
      .then(async(response)=>{
        expect(response.body).toEqual({ })
      })
      
    })
  })