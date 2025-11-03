let sendBtn = document.getElementById("SEND-BTN");
let txtInput = document.getElementById("MESSAGE-INPUT");
let userName = document.getElementById("H-USERNAME");
let chat = document.getElementById("chatBody");
let userPic = document.getElementById("HEADER-PROFILEPIC");
let info2 = JSON.parse(localStorage.getItem("chatInfo2"));
let page = io();
userName.innerHTML="Rick"

let info1 = JSON.parse(localStorage.getItem("mainUser"))

userName.innerHTML = info2.username;
userPic.style.background = `url(${info2.piclink})`;
userPic.style.backgroundSize = "cover";

function send() {
  txtInput.style.height = 20 + 'px';
  let text = txtInput.value;
  if (text === "") return;
  let bubble = document.createElement("div");
  bubble.className = "RECEPIENT-TEXT";
  bubble.innerHTML = text;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
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
  console.log(data)
  if (data.to == info1 && data.from == info2.username) {
    let bubble = document.createElement("div");
    bubble.className = "SENDER-TEXT";
    bubble.innerHTML = data.text;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
  }
});

  txtInput.addEventListener('input', ()=>{
      if (txtInput.scrollHeight < 95) {
          txtInput.style.height = 'auto';
          txtInput.style.height = txtInput.scrollHeight + 'px';
      } else {
          txtInput.style.height = 95 + 'px'
      }
});
