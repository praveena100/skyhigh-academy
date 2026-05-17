const mysql = require("mysql2");
const express = require("express");

const router = express.Router();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "skyhigh_academy"
  });

router.post("/login", (req, res) => {

  const { password } = req.body;

  if(password === process.env.ADMIN_PASSWORD){

    res.json({
      success:true
    });

  }else{

    res.json({
      success:false
    });
  }
});

router.get("/students", (req, res) => {

    const sql =
      "SELECT * FROM enrollments ORDER BY id DESC";
  
    db.query(sql, (err, result) => {
  
      if(err){
  
        console.log(err);
  
        res.json({
          success:false
        });
  
      }else{
  
        res.json({
          success:true,
          students: result
        });
      }
    });
  });

  router.delete("/delete/:id", (req, res) => {

    const id = req.params.id;
  
    const sql =
      "DELETE FROM enrollments WHERE id = ?";
  
    db.query(sql, [id], (err, result) => {
  
      if(err){
  
        console.log(err);
  
        res.json({
          success:false
        });
  
      }else{
  
        res.json({
          success:true
        });
      }
    });
  });

module.exports = router;