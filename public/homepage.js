const mainSection = document.getElementById("mainSection");

fetch("/everyone", {
    method: 'POST',
    headers: {"Content-type": "application/json"},
    body: ""
})
.then(res=> res.json())
.then(data=>{

data.data.forEach((u)=>{
console.log( `url('/${u.profileLink}')`)
let userDiv = document.createElement("div");
userDiv.className = "MAIN-USERS";
let imgDiv = document.createElement("div");
imgDiv.className = "MAIN-USERS-IMG";
imgDiv.style.background = `url('/${u.profileLink}')`;
imgDiv.style.backgroundSize = "cover"; 
imgDiv.style.backgroundPosition = "center";
let usernameDiv = document.createElement("div");
usernameDiv.className = "MAIN-USERS-USERNAME";
usernameDiv.innerHTML = `${u.username} (<span class="MAIN-USERS-COURSE">${u.course || "CSE"} </span><span class="MAIN-USERS-YEAR">${u.year || "1"}</span>)`;
userDiv.appendChild(imgDiv);
userDiv.appendChild(usernameDiv);
mainSection.appendChild(userDiv);
})
})