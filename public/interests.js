let received= {}
let sent = {}

const data = async()=>{
    const interestsData = await fetch('/interests',{
    method: 'POST',
    headers: {'Content-type':'application/json'},
    body:  JSON.stringify({mainUser: JSON.parse(localStorage.getItem('mainUser'))})
})
const dataReceived  = await interestsData.json()
received = dataReceived.received
sent=  dataReceived.sent
console.log(sentData)
}
data()

setTimeout(() => {
    sent.forEach(u=>{
        let contact= document.createElement("div")
        contact.classList.add("CONTACTS")
        let contactPic= document.createElement("div")
        contactPic.classList.add("CONTACTS-PROFILEPIC")
    })

}, 500);


 <div class="CONTACTS">
                    <div       class="CONTACTS-PROFILEPIC"></div>
                    <div class="CONTACTS-INFO">
                        <h3 class="CONTACTS-USERNAME">Amani Kibet</h3>
                        <div class="INTERESTS-STATUS Interested">
                        <h3>Status: Interested</h3>
                        </div>
                    </div>
                </div>