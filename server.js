require("dotenv").config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const db = require("./db");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/register", async (req, res) => {
    const { email, password, empname, surname, department, contact, mentor, gender } = req.body;

    
    if (!email || !password|| !empname || !surname || !department || !contact || !mentor ||!gender  ) {
        return res.status(400).send("User Details  are required");
    }

    if (!email.includes("@")) {
        return res.status(400).send("Invalid email");
    }

    if (password.length < 6) {
        return res.status(400).send("Password must be at least 6 characters");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (email, password, empname, surname, department, contact, mentor, gender) VALUES (?,?,?,?,?,?,?,?)";

        db.query(sql, [email, hashedPassword, empname, surname, department, contact, mentor, gender], (err, result) => {
    console.log("DB query called");  
    if (err) {
        console.error(err);          
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).send("User already exists");
        }
        return res.status(500).send("Database error");
    }
    console.log("User inserted:", result.insertId);
   res.json({
    success: true,
    message: "User Registered Successfully!"
});
});

    } catch (error) {
        res.status(500).send("Server error");
    }
});

const getUserRole =(email) =>{

    console.log("Email:", email);
    
    if(email.includes("intern")){

        return "intern";
    } 
    else if(email.includes("cdm")){
        return "supervisor";
        
    }else if(email.includes("admin")){
        return "admin";
    }
    else{
        return "user";
    }
}

const authenticationToken = (req, res, next) =>{

    const authHeader = req.headers["authorization"];

    const token = authHeader &&  authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Access denied"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err , user) =>{

        if(err){
            return res.status(403).json({
                message:"Invalid token"
            });
        }

        req.user = user;
        next();
    });
};

app.post("/login", async(req ,res) => 
{
     const {email,password} = req.body;

     const sql ="SELECT * FROM users WHERE email = ?";

     db.query(sql,[email], async (err,result) =>{

        if(err) return res.status(500).send("Server Error!");

        if(result.length ===0){
            return res.status(400).send("User not Found");
        }
        
        const user= result[0];

        const  isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).send("Incorrect Password");
        }

        const role = getUserRole(email);

      const token = jwt.sign({

    email: String(user.email),

    role: role

}, process.env.JWT_SECRET);
        res.json({
        message:"Login Successful",
        token: token,
        role:role
       });
      
        
     });

});

app.post("/tasks", authenticationToken, (req, res) =>{

     const {employee_Id,task_description,department,date_task} = req.body;

      const assigned_by = req.user.email;

    try{
            if(!task_description || !department || !date_task || !employee_Id ){

                 return res.status(400).send("Missing required fields");
   
            }

            const sql ="INSERT INTO tblTasks (task_description,department,date_task,employee_Id, assigned_by)  VALUES (?,?,?,?,?)";
            
            const values= 
                [
                    task_description,
                    department,
                    date_task,
                    employee_Id,
                    assigned_by
                     
                ];

               

        db.query(sql,values, (err,result) =>{
              console.log("DB query is called");
               
              if (err) {
                console.error(err);
                return res.status(500).send("Database error");
             }

            console.log("Task inserted:", result.insertId);
            res.send({
                message: "Task stored successfully!",
                task_Id: result.insertId
            });
        });
          

        } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
})
;

app.post("/leave", authenticationToken, (req, res) => {

    const {
        start_date,
        end_date,
        reason,
        leave_type,
        status,
        manager_comment,
        department
    } = req.body;

    const employee_Id = req.user.email;

    try {

        if (!start_date || !end_date || !reason) {
            return res.status(400).send("Missing required fields");
        }

        const total_days =
            Math.floor(
                (new Date(end_date) - new Date(start_date)) /
                (1000 * 60 * 60 * 24)
            ) + 1;

        const leaveBalance = 15 - total_days;

       
        let leave_type_clean = (leave_type || "annual").toLowerCase();

        if (!["annual", "sick", "casual"].includes(leave_type_clean)) {
            return res.status(400).send("Invalid leave type");
        }

        const sql = `
            INSERT INTO tblLeave  
            (start_date, end_date, total_days, reason, leave_type, status, manager_comment, employee_Id, leaveBalance, department)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            start_date,
            end_date,
            total_days,
            reason,
            leave_type_clean,
            status || "pending",
            manager_comment || null,
            employee_Id,
            leaveBalance,
            department
        ];

        db.query(sql, values, (err, result) => {

            if (err) {
                console.error("DB ERROR:", err.sqlMessage);
                return res.status(500).send(err.sqlMessage);
            }

            res.json({
                success: true,
                message: "Leave stored successfully!",
                application_id: result.insertId
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

app.post("/tasksFed", authenticationToken,(req, res) => {


    const{task_Id ,feedback } = req.body;

    try{
        if(!feedback){
            return res.status(400).send("Feedback not Found");
        }
        const sql = "UPDATE tblTasks SET feedback = ? WHERE  task_Id = ?";
    
         db.query(sql,[feedback,task_Id], (err,result) =>
         {
                  console.log("update query called");

               if(err){
            console.error(err);
            return res.status(500).send("Database error");
          }

          if(result.affectedRows === 0){
            return res.status(404).send("Feedback not Found");
          }

              res.send({
                message: "Feedback Updated Successfully",
                task_Id: task_Id ,
               feedback: feedback
              }
              );
                
              
         }
    );
} catch(error){
        console.log(error);
        res.status(500).send("Server Error");
}
    
});

app.get("/leaveBalance", authenticationToken, (req,res) =>{

    const employee_Id = req.user.email;

    const sql ="SELECT leaveBalance FROM tblLeave WHERE employee_Id = ?";
  
    
    if(!employee_Id){
       return res.status(400).send("Employee ID is required");
    }
   db.query(sql,[employee_Id],(err,result) =>{

           if(err){
            console.error(err);
            return res.status(500).send("Database error");
           }

           if(result.length===0){
            return res.status(404).send("Balance not Found");
           }

            res.json({
              message:"Leave balance successful",
              employee_Id: employee_Id,
              leaveBalance: result[0].leaveBalance

        });
   });

  
    
});

app.post("/taskschal", authenticationToken, (req, res) => {
    const  employee_Id = req.user.email;
    
    const{task_Id ,challenges } = req.body;

    try{
        if(!challenges){
            return res.status(400).send("Challenges not Found");
        }
        const sql = "UPDATE tblTasks SET challenges = ? WHERE  task_Id = ? AND employee_Id = ?";
    
         db.query(sql,[challenges,task_Id,employee_Id], (err,result) =>
         {
                  console.log("update query called");

               if(err){
            console.error(err);
            return res.status(500).send("Database error");
          }

          if(result.affectedRows === 0){
            return res.status(404).send("Challenge not Found");
          }

              res.send({
                message: "Challenges Updated Successfully",
                task_Id: task_Id ,
                Challenges: challenges
              }
              );
                
              
         }
    );
} catch(error){
        console.log(error);
        res.status(500).send("Server Error");
}
    
});


            
app.post("/leaveStutusApp", authenticationToken, (req, res) => {

    const { application_id, status } = req.body;

    try {

        if (!application_id) {
            return res.status(400).json({
                success: false,
                message: "Application ID is required"
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        const sql =
            "UPDATE tblLeave SET status = ? WHERE application_id = ?";

        db.query(sql, [status, application_id], (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Leave application not found"
                });
            }

            console.log("Update successful!!");

            res.json({
                success: true,
                message: "Status Updated Successfully",
                status: status,
                application_id: application_id
            });

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

app.post("/updateLeaveStatus", (req, res) => {

    const {application_id, manager_comment } = req.body;

    if (!application_id) {
        return res.status(400).send("Application ID is required");
    }

    if (!manager_comment) {
        return res.status(400).send("Comment is required");
    }

    const sql = "UPDATE tblLeave SET manager_comment = ? WHERE application_id = ?";

    db.query(sql, [manager_comment, application_id], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Leave not found");
        }

        console.log("Update successful!!");

        res.send({
            message: "Comment Updated Successfully",
            application_id,
            manager_comment
        });
    });
});

app.get("/leaveStatusInt", authenticationToken, (req, res) => {

    console.log(req.user);

    const employee_Id = req.user.email;

    if (!employee_Id) {

        return res.status(400).json({

            success: false,

            message: "Employee ID missing in token"

        });
    }

    const sql = "SELECT * FROM tblLeave WHERE employee_Id = ?";

    db.query(sql, [employee_Id], (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({

                success: false,

                message: "Database error"

            });
        }

        res.status(200).json({

            success: true,

            data: results

        });

    });

});

app.get("/leavesDep", authenticationToken, (req, res) =>{

    const department = req.query.department;

    const sql = "SELECT application_id, start_date, end_date,leave_type,reason,leaveBalance,department,status FROM tblLeave WHERE department = ? ";

  if (!department) {
       return res.status(400).json({

        success :false,

        message:"department not found"
       })
    }
 
    db.query(sql, [department], (err, results ) => {

        if(err) return res.status(500).json({ success : false, message : "Database error"});

            res.status(200).json({
             success: true,
             data: results
           
        });
    });
});

app.get("/tasksREsEmpl",authenticationToken, (req, res) => {

    const employee_Id = req.user.email;  

    let sql = "SELECT task_Id, task_description, department, employee_Id, date_task, challenges, feedback FROM tblTasks WHERE employee_Id = ?";
   

    if (!employee_Id) {
       return res.status(400).json({
        success:false,
        message:"employee not found"
       })
    }

    db.query(sql, [employee_Id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });

        res.status(200).json({
            success: true,
            data: results
           
        });
  
    });
});

app.get("/myTasksSupervisor", authenticationToken, (req, res) => {
   
    const assigned_by = req.user.email;  

    let sql = "SELECT task_Id, task_description, department, employee_Id, date_task, challenges, feedback FROM tblTasks WHERE assigned_by= ?";
   

    if (!assigned_by) {
       return res.status(400).json({
        success:false,
        message:"employee not found"
       })
    }

    db.query(sql, [assigned_by], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });

        res.status(200).json({
            success: true,
            data: results
           
        });
  
    });

});

app.get("/tasksREs", (req, res) => {
    const task_Id = req.params.task_Id;  

    let sql = "SELECT task_Id, task_description, department, employee_Id , date_task FROM tblTasks";
    const params = [];

    if (task_Id) {
        sql += " WHERE task_Id = ?";
        params.push(task_Id);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });

        res.status(200).json({
            success: true,
            data: results
           
        });
  
    });
});

app.get("/feedback", (req,res) => {

    const task_Id = req.query.task_Id;

    let sql = " SELECT task_Id ,task_description,  feedback  FROM tblTasks";
     
    const params = [];

    if (task_Id){
        sql+="WHERE task_Id = ?";
        params.push(task_Id);
    }
    db.query(sql, params,(err, results)=>{
        if(err) return  res.status(500).json({success: false , message :"Database error"});

        res.status(200).json({
            success:true,
            data:results
        });
      });


});

app.get("/challenges", (req,res) => {

    const task_Id = req.query.task_Id;

    let sql = " SELECT task_Id ,challenges FROM tblTasks";
     
    const params = [];

    if (task_Id){
        sql+="WHERE task_Id = ?";
        param.push(task_Id);
    }
    db.query(sql, params,(err, results)=>{
        if(err) return  res.status(500).json({success: false , message :"Database error"});

        res.status(200).json({
            success:true,
            data:results
        });
      });


});

app.get("/alltasks",authenticationToken, (req,res) => {

    const task_Id = req.query.task_Id;

    let sql = " SELECT * FROM tblTasks";
     
    const params = [];

    if (task_Id){
        sql+="WHERE task_Id = ?";
        param.push(task_Id);
    }
    db.query(sql, params,(err, results)=>{
        if(err) return  res.status(500).json({success: false , message :"Database error"});

        res.status(200).json({
            success:true,
            data:results
        });
      });


});

app.get("/leave",authenticationToken, (req,res) => {

    let sql ="SELECT * FROM tblLeave";
    db.query(sql,(err,results)=>{
        if(err) return res.status(500).json({success: false, message: "Database error"});
        res.status(200).json({
            success:true,
            data:results
        });
    });


});

app.get("/", (req, res) => {
    res.send("MY SERVER IS DEFINITELY RUNNING");
});
app.listen(3000, () => {
    console.log("Running on port 3000 & Test route works");
});