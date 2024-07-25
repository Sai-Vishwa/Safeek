import { dbname,client } from "../Model/index.js";
let mentor=[];
let student=[];
let assign=[];
let assign_mentor=[];
let previous_mentor=[];
const create_mentor = async (req, res) => {
    await client.connect();
    try {
        let db = client.db(dbname);
        let data = await db.collection('Mentor').findOne({ Mentor_name: req.body.Mentor_name });
        if (!data) {
            await db.collection('Mentor').insertOne(req.body);
            let data_mentor = req.body;
            mentor.push(data_mentor); 
            res.status(201).send({
                message: "Mentor created successfully",
                data: data_mentor
            });
        } else {
            res.status(400).send({
                message: "Mentor already exists"
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal server error"
        });
    }
    finally{
        await client.close();
    }
}


const create_student=async(req,res)=>{
    await client.connect();
    try{
        
        let db = client.db(dbname);
        let data = await db.collection('student').findOne({ Student_name: req.body.Student_name });
        if(!data){
            await db.collection('student').insertOne(req.body);
            let data_stu=req.body;
            student.push(data_stu);
            res.status(201).send({
                message:"Student created successfully",
                data:data_stu
            })
        }
        else{
            res.status(400).send({
                message: "student already exists"
            });
        }

    }
    catch(error){
        res.status(500).send({
            message:error.message || "Internal servor error"
        })
    }
    finally{
        await client.close();
    }

}


const assigning_mentor=async(req,res)=>{
    await client.connect()
    try{
        let db=client.db(dbname);
        let mentor_official=await db.collection('assign_mentor').findOne({mentor_name:req.body.mentor_name});
        if(!mentor_official){
              mentor_official={
                mentor_id:req.body.mentor_id,
                mentor_name:req.body.mentor_name,
                student_name:[]
              }
              assign_mentor.push(mentor_official);
              mentor_official.student_name.push(req.body.student_name);
              await db.collection('assign_mentor').insertOne(mentor_official);
            }
        else{
            await db.collection('assign_mentor').updateOne(
                {mentor_name:req.body.mentor_name},
                {$push:{student_name:req.body.student_name}});
        }
        res.status(200).send({
            message:" successfully assigned"
        })
        
    }
    catch(error){
        res.status(500).send({
            message:error.message || "Internal servor error"
        })
    }
    finally{
        await client.close();
    }

}
const changing_mentor = async(req, res) => {
    await client.connect();
    try {
       
        let db=client.db(dbname);
        let mentor_official=await db.collection('assign_mentor').findOne({mentor_name:req.body.new_mentor_name});
        if(!mentor_official){
              mentor_official={
                mentor_id:req.body.new_id,
                mentor_name:req.body.new_mentor_name,
                student_name:[]
              }
              assign_mentor.push(mentor_official);
              mentor_official.student_name.push(req.body.student_name);
              await db.collection('assign_mentor').insertOne(mentor_official);
            }
            else{
                await db.collection('assign_mentor').updateOne(
                    {mentor_name:req.body.new_mentor_name},
                    {$push:{student_name:req.body.student_name}});
            }
            await db.collection('assign_mentor').updateOne(
                {mentor_name:req.body.old_mentor_name},
                {$pull:{student_name:req.body.student_name}});

                let old_mentor = await db.collection('previous_mentor').findOne({ mentor_name: req.body.old_mentor_name });
                if (!old_mentor) {
                    old_mentor = {
                        mentor_id: req.body.old_id,
                        mentor_name: req.body.old_mentor_name,
                        student_name: req.body.student_name
                    };
                    await db.collection('previous_mentor').insertOne(old_mentor);
                } else {
                    await db.collection('previous_mentor').updateOne(
                        { mentor_name: req.body.old_mentor_name },
                        { $push: { student_name: req.body.student_name } }
                    );
                }
        res.status(200).send({
            message: "Mentor changed successfully"
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal server error"
        });
    }
    finally{
        await client.close();
    }
};

const new_mentor=async (req,res)=>{
       await client.connect()
        try{
            let db=client.db(dbname);
            let result=await db.collection('assign_mentor').find().toArray();
            res.status(200).send({
                message:"Mentor assigning to student data fetched successfully",
                data:result
            })
        }
        catch(error){
            res.status(500).send({
                message:error.message || "Internal servor error"
            })
}
finally{
    await client.close();
}
}
const old_mentor=async(req,res)=>{
    await client.connect()
        try{
            let db=client.db(dbname);
            let result= await db.collection('previous_mentor').find().toArray();
        res.status(200).send({
            message:"previous mentor data fetched successfully",
            data:result
        })
    }
    catch(error){
        res.status(500).send({
            message:error.message || "Internal servor error"
        })
}
finally{
    await client.close()
}
}













export default {create_mentor,create_student,assigning_mentor,changing_mentor,new_mentor,old_mentor}