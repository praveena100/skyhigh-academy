const express = require("express");
const supabase = require("../supabase");

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

    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      students: data
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

    const { error } = await supabase
      .from("enrollments")
      .delete()
      .eq("id", id);

    if (error) throw error;

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