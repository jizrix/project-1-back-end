const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const UserModel = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const uri =
  'mongodb+srv://weerapan:ttsoftware@ttsoftware.gxdgbyb.mongodb.net/ttsoftware?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> console.log(`connect to mongodb ok`)).catch((err) => console.log(err));

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
    hn : ${hn} \n
    firstname : ${firstname} \n
    lastname : ${lastname} \n
    phone : ${phone} \n
    email : ${email} \n
     `)

  const newUser = new UserModel({
    hn,
    firstname,
    lastname,
    phone,
    email,
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
    console.log(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error saving user', error });
  }
});

app.put('/update', async (req, res) => {
  console.log('User update');
  
  const hn = req.body.hn;
  const updatedData = req.body;
  console.log('request body is :',req.body)

  try {
    const updatedUser = await UserModel.findOneAndUpdate( {hn} , updatedData, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Could not update user.' });
  }
});

app.delete('/delete/:hn', async (req, res) => {
  
  console.log('User delete');
  const hn = req.params.hn;

  console.log(hn)

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
