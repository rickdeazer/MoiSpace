const mainSection = document.getElementById("mainSection");
let searchInput= document.getElementById("HOME-SEARCH")
let searchInputBtn= document.getElementById("searchInputBtn")


function renderHomepage(arr) {
    mainSection.innerHTML=""

  arr.forEach((u) => {
    

    let profileImg =
      u.profileLink && u.profileLink !== ""
        ? u.profileLink
        : "/uploads/default.png";

    let userDiv = document.createElement("div");
    userDiv.className = "MAIN-USERS";

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
        localStorage.setItem('forUsClicked',`${u.username}`)
        form.submit(); 
      });
    
  });
}

fetch("/everyone")
  .then((res) => res.json())
  .then((data) => {
    renderHomepage(data.data);

    searchInputBtn.addEventListener("click", () => {
      let filter = searchInput.value.toLowerCase();
      renderHomepage(
        data.data.filter((u) => u.username.toLowerCase().includes(filter))
      );
    });
  });
