import express from 'express';
import dotenv from 'dotenv';
import { ValidationError } from 'yup';
import { registerUserSchema } from './validators/register-user-schema';

const fs = require("fs");

dotenv.config();
const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/users', (req, res) => {  
  const data = require('./data/users.json');
  return res.json({ message: data });
});

app.get('/login', (req, res) => {  
  //let users = require('./data/users.json');
  const { body } = req;
  let test = body;
  const data = registerUserSchema.validateSync(body, { abortEarly: false, stripUnknown: false });
  console.log(test)
    return res.json({ message: "OK" });
});

app.post('/users/register', (req, res) => {
  const { body } = req;

  try {
    const data = registerUserSchema.validateSync(body, { abortEarly: false, stripUnknown: false });

  fs.open('./data/users.json', 'a', 666, function( e, id ) {
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
