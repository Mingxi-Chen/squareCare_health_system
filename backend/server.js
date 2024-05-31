const port = process.env.PORT || 8000;
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

// WebSocket
const http = require("http");
const WebSocket = require("websocket");
const WebSocketServer = require("websocket").server;
const server = http.createServer(app);
const connections = new Map();
const wsServer = new WebSocketServer({
  httpServer: server,
});


// end
// require('dotenv').config();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req,file,cb){
    cb(null,'uploads/')
  },
  filename: function(req,file,cb){
    cb(null,Date.now() + '-' + file.originalname)
  }
})

const upload = multer({storage: storage});

require("./database");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/**
 * Junlin
 * connect to database
 */
require("./models/User");

// web socket
wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  connection.on("message", (message) => {
    const data = JSON.parse(message.utf8Data);
    if (data.eventType === "join" && data.roomId) {
      joinRoom(connection, data.roomId);
    } else if (data.eventType === "message") {
      broadcastToRoom(data, connection);
    }

    if(data.type === "authenticate"){
      connections.set(data.userId, connection);
    }

  });
});

function joinRoom(ws, roomId) {
  if (!connections.has(roomId)) {
    connections.set(roomId, new Set());
  }
  connections.get(roomId).add(ws);
}

function broadcastToRoom(message, sender) {
  const roomId = message.roomId;
  if (connections.has(roomId)) {
    connections.get(roomId).forEach((ws) => {
      if (ws !== sender && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }
}

// Function to send a notification to a specific user
function sendNotificationToUser(userId, message) {
  const connection = connections.get(userId);
  if (connection && connection.readyState === WebSocket.OPEN) {
    connection.send(JSON.stringify({ type: 'notification', message }));
  }
}
/**
 * Junlin
 * routes
 */
module.exports = {sendNotificationToUser,app,server};

app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/patientsManager", require("./routes/patients"));
app.use('/api/roomRoute', require('./routes/roomRoute'));
app.use("/messages", require("./routes/messages"));
app.use('/api/processRoute', require('./routes/processRoute'));
app.use('/medicine', require("./routes/medicine"))
app.use('/notification', require("./routes/notification"))

const File = require('./models/LabReport')
const fs = require('fs')

app.post('/upload', upload.single('file'), async (req,res)=>{
  const {patientId} = req.body; 
  if(!req.file){
    return res.status(400).send("No file uploaded");
  }

  try{
    //Save file information in MongoDB
    const newFile = new File({
      patient : patientId,
      filename : req.file.filename,
      path : req.file.path,
      uploadDate :  new Date()
    });
    await newFile.save();

    res.status(200).json({
      message : "File uploaded successfully!",
      file: {
        filename: req.file.filename,
        path:req.file.path,
        patient:patientId,
      }
    })
  }

  catch(error){
    res.status(500).send('Servwer error : ' + error.message);
  }

});

app.get(`/labreports/:patientId`, async(req,res)=>{
  try{
    const patientId = req.params.patientId; 
    const labReports = await File.find({patient:patientId}).select('filename uploadDate path')
    res.status(200).json(labReports);
  }
  catch(error){
    res.status(500).send("Server error " + error.message);
  }
})


app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename
  const file = path.join(__dirname,'uploads', filename);

  console.log(file);
  res.download(file);
});

app.delete('/deleteReport/:id', async (req,res) => {
  try{
    const file = await File.findById(req.params.id); 
    console.log("file " + file);
    if(!file){
      return res.status(404).send('File not found');
    }

    const filePath = path.join(__dirname, 'uploads', file.filename)
    fs.unlink(filePath, async err => {
      if(err){
        console.error("Error deleting file from filesystem: ", err);
        return res.status(500),send("Error deleting file");
      }
      try{

        await file.deleteOne();
        res.send("File deleted successfully");
      } 
      catch(dbError)
      {
        console.error("Error deleteing file from database: " , dbError);
        res.status(500).send("Error deleting file from database");
      }
    })
  }
  catch(error){
    console.error("Error deleting file: " , error);
    res.status(500).send("Error deleting file");
  }
})



app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => {
  let url = path.join(__dirname, "../build", "index.html");
  //if (!url.startsWith('/app/')) // since we're on local windows
  //  url = url.substring(1);
  res.sendFile(url);
});


server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

