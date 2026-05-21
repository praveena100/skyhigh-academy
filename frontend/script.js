function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

let currentType = null;

function selectStudentType(type, el) {
  document.querySelectorAll('#studentTypeGroup .chip')
    .forEach(c => c.classList.remove('active'));

  el.classList.add('active');

  currentType = type;

  document.querySelectorAll('.dynamic-section')
    .forEach(s => s.classList.remove('visible'));

  const sec = document.getElementById('sec-' + type);

  if (sec) {
    sec.classList.add('visible');
  }
}

function toggleTuitionOrSkill() {
  const val = document.getElementById('prog4to9').value;

  const tuitionSec = document.getElementById('sec-4to9-tuition');
  const skillSec = document.getElementById('sec-4to9-skill');

  tuitionSec.classList.remove('visible');
  skillSec.classList.remove('visible');

  if (val === 'tuition') {
    tuitionSec.classList.add('visible');
  }
  else if (val === 'skill') {
    skillSec.classList.add('visible');
  }
  else if (val === 'both') {
    tuitionSec.classList.add('visible');
    skillSec.classList.add('visible');
  }
}

function toggleChip(el) {
  el.classList.toggle('active');
}

async function submitForm() {

  

  const name = document.getElementById('studentName').value.trim();
  const parent = document.getElementById('parentName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name) {
    alert('Please enter student name');
    return;
  }

  if (!parent) {
    alert('Please enter parent name');
    return;
  }

  if (!phone || phone.length < 10) {
    alert('Please enter valid phone number');
    return;
  }

  if (!currentType) {
    alert('Please select student category');
    return;
  }

  let extraDetails = {};

  // Grade 1–3
  if (currentType === "grade1to9") {

    extraDetails.standard =
      document.getElementById("standard1to9").value;

    extraDetails.board =
      document.getElementById("board1to9").value;

    extraDetails.batch =
      [...document.querySelectorAll("#sec-grade1to9 .chip.active")]
      .map(chip => chip.innerText)
      .join(", ");

      if (!extraDetails.standard) {
        alert("Please select standard");
        return;
      }
      
      if (!extraDetails.board) {
        alert("Please select board");
        return;
      }
      
      if (!extraDetails.batch) {
        alert("Please select preferred batch");
        return;
      }

  }

  // Grade 4–9
  if (currentType === "grade4to9") {

    extraDetails.standard =
      document.getElementById("standard4to9").value;

    extraDetails.program =
      document.getElementById("prog4to9").value;

    extraDetails.board =
      document.getElementById("board4to9")?.value || "";

    extraDetails.skills =
      [...document.querySelectorAll("#sec-4to9-skill .chip.active")]
      .map(chip => chip.innerText)
      .join(", ");

      if (!extraDetails.standard) {
        alert("Please select standard");
        return;
      }
    
      if (!extraDetails.program) {
        alert("Please select program interest");
        return;
      }
    
      // Tuition or Both → board required
    
      if (
        (extraDetails.program === "tuition" ||
         extraDetails.program === "both")
        &&
        !extraDetails.board
      ) {
        alert("Please select board");
        return;
      }
    
      // Skill or Both → at least one skill required
    
      if (
        (extraDetails.program === "skill" ||
         extraDetails.program === "both")
        &&
        !extraDetails.skills
      ) {
        alert("Please select at least one skill program");
        return;
      }

  }

  // High School
  if (currentType === "highschool") {

    extraDetails.programs =
      [...document.querySelectorAll("#sec-highschool .chip.active")]
      .map(chip => chip.innerText)
      .join(", ");

      if (!extraDetails.programs) {
        alert("Please select at least one program");
        return;
      }

  }

  // College
  if (currentType === "college") {

    extraDetails.details =
      [...document.querySelectorAll("#sec-college .chip.active")]
      .map(chip => chip.innerText)
      .join(", ");

      if (!extraDetails.details) {
        alert("Please select placement training details");
        return;
      }

  }

  const formData = {
    studentName: name,
    parentName: parent,
    phone,
    email,
    studentType: currentType,
    message,
    extraDetails
  };

  const btn = document.querySelector(".submit-btn");

btn.disabled = true;
btn.innerText = "Submitting...";

  try {

    const response = await fetch("https://skyhigh-backend-p60o.onrender.com/api/enroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const text = await response.text();

console.log(text);

const data = JSON.parse(text); 

    if (data.success) {

      btn.innerText = "Submitted Successfully";

      document.getElementById('enrollForm').style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    
    } else {
    
      alert("Failed to submit form");

      btn.innerText = "🚀 Submit Enrollment Request";
      btn.disabled = false;
    } 
  }catch (error) {

    console.error(error);
  alert("Server error");

  btn.innerText = "🚀 Submit Enrollment Request";
btn.disabled = false;
  }
}