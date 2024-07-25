import express from 'express';
import Usercontroller from './Usercontroller.js';
const controller = express.Router();
controller.use('/menstu',Usercontroller);
export default controller;