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
    interestBtn.innerHTML = "Interest Sent";

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
