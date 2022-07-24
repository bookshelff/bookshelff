// Require the library
const mongoose = require('mongoose');
const env = require('./environment');

var uri = 'mongodb+srv://aditya:vNz03PflfsUH1ff4@cluster0.j3sjn.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(uri,{ useNewUrlParser: true });
const db = mongoose.connection;

// Error
db.on('error', console.error.bind(console, 'connection error:'));

// If up and running, print a message
db.once('open', function() {
  // we're connected!
  console.log("Successfully connected to Database!");
});


// // Require the library
// const mongoose = require('mongoose');
// const env = require('./environment');
// const uri = "mongodb+srv://aditya:hello@cluster0.j3sjn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// // Connect to Database
// mongoose.connect(
//   mongoAtlasUri,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   () => console.log(" Mongoose is connected"),
// );

// // mongoose.connect(`mongodb://localhost/${env.db}`, {useNewUrlParser: true, useUnifiedTopology: true});

// // Acquire the connection (to check if it's up and running)
// const db = mongoose.connection;

// // Error
// db.on('error', console.error.bind(console, 'connection error:'));

// // If up and running, print a message
// db.once('open', function() {
//   // we're connected!
//   console.log("Successfully connected to Database!");
// });

// // const { MongoClient, ServerApiVersion } = require('mongodb');
// // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// // client.connect(err => {
// //   const collection = client.db("test").collection("devices");
// //   // perform actions on the collection object
// //   client.close();
// // });