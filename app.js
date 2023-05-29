const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const PORT = process.env.PORT || 3000;

const app = express();

mongoose.connect('mongodb://localhost:27017/mongo-1',
                    {
                        useNewUrlParser: true,
                    });


mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1'}`)
})

mongoose.connection.once("open",  () => {
    console.log("Connected successfully to mongoDB");
});


const Visitor = mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const VisitorEntity = mongoose.model('Visitor', Visitor);
/***************************************************/

app.get("/", async (req, res) => {
  const { query: { name } } = req;
  const paramName = name ? name : 'Anónimo';

  const visitorBody = {
    name: paramName,
  }

  const visitor = new VisitorEntity(visitorBody);

   try {
    await visitor.save();
    return res.status(200).send("<h1>El visitante fue almacenado con éxito</h1>");
  } catch (err) {
    return res.status(400).json({
      err
    })
  }
});




app.listen(PORT, () => {
  console.log("Server started on port 3000");
});
