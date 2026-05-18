const express = require("express");
const db = require("../db");

const router = express.Router();

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

router.get("/students", async (req, res) => {

  try {

    const sql = `
      SELECT * FROM enrollments
      ORDER BY id DESC
    `;

    const [result] = await db.query(sql);

    res.json({
      success: true,
      students: result
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false
    });
  }
});

router.delete("/delete/:id", async (req, res) => {

  try {

    const id = req.params.id;

    const sql = `
      DELETE FROM enrollments WHERE id = ?
    `;

    await db.query(sql, [id]);

    res.json({
      success: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false
    });
  }
});

module.exports = router;