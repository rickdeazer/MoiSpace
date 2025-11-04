async function loadContacts() {
    try {
        const main = await fetch('/chats/main');
        const mainUserDetails = await main.json();
        const userDetails = mainUserDetails.userDetails
        const mainUser = userDetails.username
        localStorage.clear()
        localStorage.setItem('mainUser',JSON.stringify(mainUser))
        const response = await fetch("/chats/users");
        const userInfo = await response.json();
        let contBody = document.getElementById("CONTACTS-BODY");
        const info = userInfo.userData// wrap single object in array
        info.forEach((u) => {
            let cont = document.createElement("div");
            cont.className = "CONTACTS";
            let imgCont = document.createElement("div");
            imgCont.classList.add("CONTACTS-PROFILEPIC");
            let infoCont = document.createElement("div");
            infoCont.classList.add("CONTACTS-INFO");
            let nameCont = document.createElement("h3");
            nameCont.classList.add("CONTACTS-USERNAME");
            let noteCont = document.createElement("div");
            noteCont.classList.add("CONTACTS-NOTE");

            imgCont.style.background = `url('${u.piclink || "/default-pic.jpg"}')`;
            imgCont.style.backgroundSize = "cover";
            nameCont.innerHTML = `${u.username}`;  // changed from u.name to u.username
            noteCont.innerHTML = `${u.note || ""}`; // if you have a note field

            contBody.appendChild(cont);
            cont.appendChild(imgCont);
            cont.appendChild(infoCont);
            infoCont.appendChild(nameCont);
            infoCont.appendChild(noteCont);

            infoCont.addEventListener("click", () => {
                localStorage.setItem("chatInfo2", JSON.stringify(u));
                window.location.href = "/chatspage";
            });
        });
    } catch (err) {
        console.error("Error loading contacts:", err);
    }
}

// Call the function
loadContacts();
