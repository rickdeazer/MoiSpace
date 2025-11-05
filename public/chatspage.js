let sendBtn = document.getElementById("SEND-BTN");
let txtInput = document.getElementById("MESSAGE-INPUT");
let userName = document.getElementById("H-USERNAME");
let chat = document.getElementById("chatBody");
let mainSection= document.getElementById("MAIN-SECTION")
let userPic = document.getElementById("HEADER-PROFILEPIC");
let info2 = JSON.parse(localStorage.getItem("chatInfo2"));
let page = io();
userName.innerHTML = "Rick";

let info1 = JSON.parse(localStorage.getItem("mainUser"));

async function markAsRead(){
  await fetch("/markAsRead", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    mainUser: info1,
    receiver: info2.username,
  }),
});
}

async function openChat(){
fetch("/chat/path4", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name1: info1, name2: info2.username }),
})
  .then((res) => res.json())
  .then((data) => {
    chat.innerHTML = "";

    let received = data.msgReceivedH;
    let sent = data.msgSentH;

    let i = 0,
      j = 0;
    let allMsgs = [];

    while (i < received.length || j < sent.length) {
      if (j < sent.length) {
        allMsgs.push({ ...sent[j], type: "sent" });
        j++;
      }
      if (i < received.length) {
        allMsgs.push({ ...received[i], type: "received" });
        i++;
      }
    }
    let k = 0;
    function showNext() {
      if (k < allMsgs.length) {
        let msg = allMsgs[k];
        let bubble = document.createElement("div");

        if (msg.type === "sent") {
          bubble.className = "SENDER-TEXT";
          bubble.innerHTML = `<span class="msgText">${msg.text}</span>
          <span class="TIME">${msg.time}</span>`;
        } else {
          bubble.className = "RECEPIENT-TEXT";
          bubble.innerHTML = `<span class="msgText">${msg.text}</span>
          <span class="TIME">${msg.time}</span>`;
        }

        chat.appendChild(bubble);

        k++;
        setTimeout(showNext, 20);
      }
    }
    showNext();
  });
  markAsRead()
}
openChat()


userName.innerHTML = info2.username;
userPic.style.background = `url(${info2.piclink})`;
userPic.style.backgroundSize = "cover";

function send() {
  txtInput.style.height = 20 + "px";
  let text = txtInput.value;
  let time= `${new Date().getHours()}${new Date().getMinutes()}`
  if (text === "") return;
  let bubble = document.createElement("div");
  bubble.className = "SENDER-TEXT";
          bubble.innerHTML = `<span class="msgText">${text}</span>
          <span class="TIME">${time}</span>`;
          chat.appendChild(bubble);
  txtInput.value = "";

  page.emit("message", {
    from: info1,
    to: info2.username,
    text: text,
  });
}
sendBtn.addEventListener("click", () => {
  send();
});

page.on("serverReply", (data) => {
  console.log(data);
  if (data.to == info1 && data.from == info2.username) {
    let time= `${new Date().getHours()}${new Date().getMinutes()}`
    markAsRead()
    let bubble = document.createElement("div");
    bubble.className = "RECEPIENT-TEXT";
          bubble.innerHTML = `<span class="msgText">${data.text}</span>
          <span class="TIME">${time}</span>`;
    chat.appendChild(bubble);
  }
});

txtInput.addEventListener("input", () => {
  if (txtInput.scrollHeight < 95) {
    txtInput.style.height = "auto";
    txtInput.style.height = txtInput.scrollHeight + "px";
  } else {
    txtInput.style.height = 95 + "px";
  }
});
