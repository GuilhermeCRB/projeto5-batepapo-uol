let user = { name: prompt("Qual nome de usuário gostaria de utilizar?") };
const chat = document.querySelector(".chat");
let intervalStatus; let intervalMessages;

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
    messageArray[messageArray.length - 1].scrollIntoView();
}

function sendMessage() {
    let message = {
        from: user.name,
        to: "Todos",
        text: document.querySelector("input").value,
        type: "message"
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message)
    promise.then(checkForNewMessages); promise.catch(reloadWindow);
    document.querySelector("input").value = "";
}

function openMessageMenu(element) {
    document.querySelector("aside").style.right = "0";
    document.querySelector(".dark-screen").classList.remove("hidden");
}

function closeMessageMenu() {
    document.querySelector("aside").style.right = "-75%";
    document.querySelector(".dark-screen").classList.add("hidden");
}