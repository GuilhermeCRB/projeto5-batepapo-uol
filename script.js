let user = { name: prompt("Qual nome de usuário gostaria de utilizar?") };
const chat = document.querySelector(".chat");
let intervalStatus; let intervalMessages;
let previousMessage; let lastMessage;

document.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {

        let btn = document.querySelector(".plane-icon");

        btn.click();

    }
});

checkUserName();

function checkUserName() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", user);
    promise.then(checkFunctions); promise.catch(warnError);
}

function checkFunctions() {
    intervalStatus = setInterval(checkUserStatus, 5000);
    intervalMessages = setInterval(checkForNewMessages, 3000);
}

function checkUserStatus() {
    if (window.closed) {
        clearInterval(intervalStatus);
    } else {
        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", user);
    }
}

function checkForNewMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(loadChat);
}

function warnError(error) {
    user.name = prompt(`Erro ${error.response.status}. Por favor, insira um nome válido.\nQual nome de usuário gostaria de utilizar?`);
    checkUserName();
}

function reloadWindow(error) {
    alert(`Erro ${error.response.status}. Erro de conexão, a página precisa ser recarregada.`)
    window.location.reload();
}

function loadChat(response) {
    chat.innerHTML = ""; //it was necessary to delete the previuos messages got from API to prevent system overload 
    for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].type === "status") {
            chat.innerHTML +=
                `
            <p class="message chat_${response.data[i].type}" data-identifier="message">
                <span class="time">(${response.data[i].time})</span> <span class="user-name">${response.data[i].from}</span> ${response.data[i].text}
            </p>
            `;
        } else if (response.data[i].type !== "private_message" || response.data[i].to === user.name || response.data[i].from === user.name) {
            chat.innerHTML +=
                `
            <p class="message chat_${response.data[i].type}" data-identifier="message">
                <span class="time">(${response.data[i].time})</span> <span class="user-name">${response.data[i].from}</span> para <span class="user-name">${response.data[i].to}</span>: &nbsp;${response.data[i].text}
            </p>
            `;
        }
    }
    scrolltoLastMessage();
}

function scrolltoLastMessage() {
    let messageArray = [...chat.querySelectorAll(".message")];
    lastMessage = messageArray[messageArray.length - 1]; console.log(lastMessage.innerText)
    if (lastMessage.innerText !== previousMessage) {
        messageArray[messageArray.length - 1].scrollIntoView();
    }
    previousMessage = lastMessage.innerText; console.log(previousMessage)
    //the condition here is necessary to prevent scrollIntoView if there are not any new messages
}

function sendMessage() {
    let textMessage = document.querySelector("input").value;
    if (textMessage !== "") {
        let message = {
            from: user.name,
            to: "Todos",
            text: textMessage,
            type: "message"
        }
        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message)
        promise.then(checkForNewMessages); promise.catch(reloadWindow);
        document.querySelector("input").value = "";
    }
    //the condition here is to prevent an error catching by th API
}

function openMessageMenu(element) {
    document.querySelector("aside").style.right = "0"; console.log(document.querySelector("aside").style.right)
    document.querySelector(".dark-screen").classList.remove("hidden");
}

function closeMessageMenu() {
    document.querySelector("aside").style.right = "-75%";
    document.querySelector(".dark-screen").classList.add("hidden");
}