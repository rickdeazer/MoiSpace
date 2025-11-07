const mainSection = document.getElementById("mainSection");

fetch("/everyone", {
  method: "POST",
  headers: {"Content-type": "application/json"},
  body: ""
})
  .then((res) => res.json())
  .then((data) => {
    data.data.forEach((u) => {
      let profileImg =
        u.profileLink && u.profileLink !== ""
          ? u.profileLink
          : "/mediafiles/africanGirl.jpg";

      let userDiv = document.createElement("div");
      userDiv.className = "MAIN-USERS";
      
        
      let form = document.createElement("form");
      form.method = "POST";
      form.action = "/user";
      
      let input = document.createElement("input");
      input.type = "hidden";
      input.name = "username";
      input.value = u.username;
      
      form.appendChild(input);
      userDiv.appendChild(form);

      userDiv.addEventListener('click', () => {
        form.submit(); 
      });
      let imgDiv = document.createElement("div");
      imgDiv.className = "MAIN-USERS-IMG";
      imgDiv.style.backgroundImage = `url('${profileImg}')`;
      imgDiv.style.backgroundSize = "cover";
      imgDiv.style.backgroundPosition = "center";
      
      let usernameDiv = document.createElement("div");
      usernameDiv.className = "MAIN-USERS-USERNAME";
      
      usernameDiv.innerHTML = `
        ${u.username} 
        (<span class="MAIN-USERS-COURSE">${u.course || "CSE"}</span> 
        <span class="MAIN-USERS-YEAR">${u.year || "1"}</span>)
      `;

      userDiv.appendChild(imgDiv);
      userDiv.appendChild(usernameDiv);
      mainSection.appendChild(userDiv);
    });
  })
  .catch((err) => console.error("Failed to fetch users:", err));
