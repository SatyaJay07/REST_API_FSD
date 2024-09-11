// Tho there are many ways of acheiving this 
// functionality I've choosen to do this 
// way, You can include
// Router, Controller etc
// and place all your code
// into structure.
const express = require('express');
const body_parser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(body_parser.json());

mongoose.connect('mongodb://localhost:27017/prac-app', {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

const pracSchema = new mongoose.Schema({
  "name": { type: String, required: true },
  "age": { type: Number, required: true }
});

const Obj = mongoose.model('Obj', pracSchema);  // THis is model instance name, we use it as the constructor.

app.post("/", async (req, res) => {
  try {
    const newObj = new Obj(req.body);  
    await newObj.save();
    res.status(201).send(newObj);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/", async (req, res) => {
  try {
    const result = await Obj.find();
    res.status(200).send(result);  
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put("/:name", async (req, res) => {  
  try {
   // const { name } = req.params;
    const updatedObj = await Obj.findOneAndUpdate({ name: req.params.name }, req.body, { new: true });  
    if (!updatedObj) {
      return res.status(404).send("Entry not found");  
    }
    res.status(200).send(updatedObj);  
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/:name", async (req, res) => {
    try {
      const deletedObj = await Obj.findOneAndDelete({ name: req.params.name });
      if (!deletedObj) {
        return res.status(404).send("Entry not found");
      }
      res.status(200).send(deletedObj);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
  
