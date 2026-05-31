const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const supabase = require("../../supabase");

router.post("/", async (req, res) => {

  try {

    const data = req.body;

    const { error } = await supabase
  .from("enrollments")
  .insert([
    {
      student_name: data.studentName,
      parent_name: data.parentName,
      phone: data.phone,
      email: data.email,
      student_type: data.studentType,
      extra_details: Object.entries(data.extraDetails || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(" | "),
      message: data.message
    }
  ]);

if (error) {
  throw error;
}

console.log("Data inserted into Supabase");
    
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists =", !!process.env.EMAIL_PASS);

     const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Enrollment Request - Sky High Academy",
    
      html: `
  <div style="font-family: Arial, sans-serif; background:#f4f7fb; padding:30px;">

    <div style="
      max-width:700px;
      margin:auto;
      background:white;
      border-radius:16px;
      overflow:hidden;
      box-shadow:0 4px 20px rgba(0,0,0,0.08);
    ">

      <div style="
        background:linear-gradient(135deg,#0d2d5e,#1565c0);
        color:white;
        padding:25px;
        text-align:center;
      ">
        <h1 style="margin:0;">Sky High Academy</h1>
        <p style="margin-top:8px;font-size:14px;">
          New Enrollment Form Submission
        </p>
      </div>

      <div style="padding:25px;">

        <table style="width:100%; border-collapse:collapse;">

          <tr>
            <td style="padding:12px; font-weight:bold;">Student Name</td>
            <td style="padding:12px;">${data.studentName}</td>
          </tr>

          <tr style="background:#f8fbff;">
            <td style="padding:12px; font-weight:bold;">Parent Name</td>
            <td style="padding:12px;">${data.parentName}</td>
          </tr>

          <tr>
            <td style="padding:12px; font-weight:bold;">Phone</td>
            <td style="padding:12px;">${data.phone}</td>
          </tr>

          <tr style="background:#f8fbff;">
            <td style="padding:12px; font-weight:bold;">Email</td>
            <td style="padding:12px;">${data.email || "-"}</td>
          </tr>

          <tr>
            <td style="padding:12px; font-weight:bold;">Student Type</td>
            <td style="padding:12px;">${data.studentType}</td>
          </tr>

        </table>

        <h3 style="
          margin-top:30px;
          color:#1565c0;
        ">
          Program Details
        </h3>

        <div style="
  background:#f4f8ff;
  padding:18px;
  border-radius:10px;
  line-height:1.8;
">
  <pre style="margin:0; white-space:pre-wrap;">
${Object.entries(data.extraDetails || {})
  .map(([key, value]) => `${key}: ${value}`)
  .join(" | ")}
  </pre>
</div>

<h3 style="
  margin-top:30px;
  color:#1565c0;
">
  Additional Message
</h3>

<div style="
  background:#fafafa;
  padding:18px;
  border-radius:10px;
  border:1px solid #eee;
">
  ${data.message || "No message"}
</div>

    </div>

  </div>
`,
    };

    transporter.sendMail(mailOptions, (err, info) => {

      if (err) {
        console.log("EMAIL ERROR:");
        console.log(err);
      } else {
        console.log("EMAIL SENT");
        console.log(info);
      }
    
    });
    
    res.status(200).json({
      success: true,
      message: "Enrollment submitted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

module.exports = router;