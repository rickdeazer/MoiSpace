// const img = document.querySelector('.profile-photo')
// const imgDiv = document.querySelector('.editable-photo')
// img.addEventListener('click',()=>{
//   if(img.classList.contains('clickedPhoto')){
//     img.classList.replace('clickedPhoto','profile-photo')
//     imgDiv.classList.toggle('editable-photo')
//   } else{
//     img.classList.replace('profile-photo','clickedPhoto')
//     imgDiv.classList.toggle('editable-photo')
//   }
// })
const img = document.querySelector('.profile-photo');
const imgDiv = document.querySelector('.editable-photo');

img.addEventListener('click', () => {
  [img.className, imgDiv.className] = img.classList.contains('clickedPhoto') 
    ? ['profile-photo', 'editable-photo'] 
    : ['clickedPhoto', ''];
});



const interestBtn = document.getElementById("intestBtn");
let foreignUserClicked = localStorage.getItem("forUsClicked");
let mainUser = JSON.parse(localStorage.getItem("mainUser"));
let interestState = false;
async function getStatus() {
  const res = await fetch("/getStatus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mainUser: mainUser,
      foreignUser: foreignUserClicked,
    }),
  });
  const data = await res.json();
  interestState = data.state;
}

function updateInterest() {
  if (interestState) {
    interestBtn.style.background = "red";
    interestBtn.style.color = "white";
    interestBtn.innerHTML = "Interested";

    interestBtn.addEventListener("click", () => {
      alert("Interest has already been sent");
    });
    interestBtn.disabled=true
  } else {
    interestBtn.addEventListener("click", async () => {
      interestState = true;
      updateInterest()
      await fetch("/sendInterest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainUser: mainUser,
          foreignUser: foreignUserClicked,
        }),
      });
      updateInterest();
    })
  }
}

(async () => {
  await getStatus();
  updateInterest();
})();