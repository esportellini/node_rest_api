import express from 'express';
import dotenv from 'dotenv';
import { ValidationError } from 'yup';
import { registerUserSchema } from './validators/register-user-schema';
import { read } from 'fs';

const fs = require("fs");

dotenv.config();
const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/users', (req, res) => {  
  const data = fs.readFileSync('./data/users.json','utf8');
  return res.json({ message: JSON.stringify(data) });
});

app.get('/users/login', (req, res) => {  
  //let users = require('./data/users.json');
  const { body } = req;
  const data = registerUserSchema.validateSync(body, { abortEarly: false, stripUnknown: false });
  let reader = fs.readFileSync('./data/users.json','utf8');
  if(reader.includes(JSON.stringify(data))){
    console.log("user logged in")
    return res.json({ message: "OK" });
  }else{
    return res.json({ message: "FAILURE" });
  }

});

app.post('/users/register', (req, res) => {
  const { body } = req;

  try {
    const data = registerUserSchema.validateSync(body, { abortEarly: false, stripUnknown: false });

  fs.open('./data/users.json', 'a', 666, function( e, id ) {
    let reader = fs.readFileSync('./data/users.json','utf8');
    console.log(reader)
    if(reader.includes(JSON.stringify(data))){
      console.log("USER GUEI JA EXISTE")
      return;
    }
   fs.write( id, JSON.stringify(data) + "\n", null, 'utf8', function(){
    fs.close(id, function(){
     console.log('file is updated');
    });
   });
  });

    return res.json({ message: 'Success', data });
  } catch (e) {
    const error = e as ValidationError;

    return res.status(422).json({ errors: error.errors });
  }
});


app.listen(PORT, () => {
  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
