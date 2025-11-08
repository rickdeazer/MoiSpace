async function loadContacts() {
    try {
        const main = await fetch('/chats/main');
        const mainUserDetails = await main.json();
        const userDetails = mainUserDetails.userDetails
        const mainUser = userDetails.username
        localStorage.setItem('mainUser',JSON.stringify(mainUser))
        const response = await fetch("/chats/users");
        const userInfo = await response.json();
        let contBody = document.getElementById("CONTACTS-BODY");
        const info = userInfo.userData// wrap single object in array
        const unRead = userInfo.count
        info.forEach((u) => {
        let unseen = undefined;
        let noOfUnread = undefined;
        const unreadDetails = (unRead[u.username])
        if (unreadDetails){
           noOfUnread = (unreadDetails.value)
           unseen = (unreadDetails.message)
        }
    let cont = document.createElement("div");
    cont.className = "CONTACTS";

    let imgCont = document.createElement("div");
    imgCont.classList.add("CONTACTS-PROFILEPIC");
    imgCont.style.background = `url(${u.piclink })`;

  
    let infoCont = document.createElement("div");
    infoCont.classList.add("CONTACTS-INFO");

    let pageTexts = document.createElement("div");
    pageTexts.classList.add("pageTexts");

    let topItems = document.createElement("div");
    topItems.classList.add("topItems");

    let nameCont = document.createElement("h3");
    nameCont.classList.add("CONTACTS-USERNAME");
    nameCont.textContent = u.username;


    topItems.appendChild(nameCont);
    pageTexts.appendChild(topItems);
    
    if (noOfUnread) {
    let msgCont = document.createElement("h4");
    msgCont.textContent = unseen;

    let badge = document.createElement("span");
    badge.classList.add("BADGE");
    badge.textContent = noOfUnread +' new';
    pageTexts.appendChild(msgCont);
    topItems.appendChild(badge);
    }

    let noteCont = document.createElement("div");
    noteCont.classList.add("CONTACTS-NOTE");
    noteCont.textContent = u.note || "Share your note";

    infoCont.appendChild(pageTexts);
    infoCont.appendChild(noteCont);
    cont.appendChild(imgCont);
    cont.appendChild(infoCont);
    contBody.appendChild(cont);

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
