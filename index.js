require('dotenv').config();
const {MONGODB_URI} = process.env;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const UserModel = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connect to DB ok!'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  UserModel.find({})
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.post('/add', async (req, res) => {
  console.log('User add!!');
  const hn = req.body.hn;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const phone = req.body.phone;
  const email = req.body.email;

  console.log(`
    hn : ${hn} 
    firstname : ${firstname} 
    lastname : ${lastname} 
    phone : ${phone} 
    email : ${email} 
  `);

  try {
    if (hn === "" || firstname === "" || lastname === "" || phone === "" || email === ""){
      return res.status(400).json({message:"Bad Input"})
    }

    const hnUser = await UserModel.find({ hn: hn });
    if (hnUser.length === 0) {
      const newUser = new UserModel({
        hn,
        firstname,
        lastname,
        phone,
        email,
      });

      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
      console.log(`Add Complete!!
      ${savedUser}`);
    } else {
      console.log(hnUser);
      return res.status(409).json({ message: 'HN ที่ใส่ซ้ำกับท่านอื่น โปรดเปลี่ยน' });
    }
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      
      res.status(409).json({ message: 'Email ถูกใช้ไปแล้ว' });
      console.log('Duplicate email error:', error);
    } else {
      
      res.status(500).json({ message: 'Error saving user', error });
      console.error('Error saving user:', error);
    }
  }
});

app.put('/update', async (req, res) => {
  console.log('User update');

  const hn = req.body.hn;
  const updatedData = req.body;
  console.log('request body is :', req.body);

  try {
    const updatedUser = await UserModel.findOneAndUpdate({ hn }, updatedData, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Could not update user.' });
  }
});

app.delete('/delete/:hn', async (req, res) => {
  console.log('User delete');
  const hn = req.params.hn;

  console.log(hn);

  try {
    const deletedUser = await UserModel.findOneAndDelete({ hn });

    if (deletedUser) {
      res.json({ message: 'User deleted successfully.' });
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Could not delete user.' });
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server Start in Port ${port}`);
});
