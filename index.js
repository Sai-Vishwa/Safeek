import express from 'express';
const PORT=process.env.PORT || 5000;
import controller from './Controller/index.js';
const app=express();
app.use(express.json());
app.use(controller)
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})
