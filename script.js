let user = { name: prompt("Qual nome de usuário gostaria de utilizar?") };
const chat = document.querySelector(".chat");
let date; let time = { hours: "", minutes: "", seconds: "" };
let intervalStatus;

checkUserName();

function checkUserName() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", user);
    promise.then(loadChat); promise.catch(warnError);
}

function checkUserStatus() {
    if (window.closed) {
        clearInterval(intervalStatus);
        loadChat("User exit");
    } else {
        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", user);
    }
}


function warnError(error) {
    user.name = prompt(`Erro ${error.response.status}. Por favor, insira um nome válido.\nQual nome de usuário gostaria de utilizar?`);
    checkUserName();
}

function loadChat(response) {
    updateTime(); console.log(response);

    if (response === "User exit") {
        chat.innerHTML +=
            `
                <p class="message chat_status-message">
                    <span class="time">(${time.hours}:${time.minutes}:${time.seconds})</span> <span class="user-name">${user.name}</span> saiu da sala...
                </p>
            `;
    } else {
        chat.innerHTML +=
            `
                <p class="message chat_status-message">
                    <span class="time">(${time.hours}:${time.minutes}:${time.seconds})</span> <span class="user-name">${user.name}</span> entra na sala...
                </p>
            `;

        intervalStatus = setInterval(checkUserStatus, 5000);
    }
}

function updateTime() {
    date = new Date();
    time.hours = date.getHours(); time.minutes = date.getMinutes(); time.seconds = date.getSeconds();

    if (time.hours < 10) {
        time.hours = "0" + time.hours.toString();
    }

    if (time.minutes < 10) {
        time.minutes = "0" + time.minutes.toString();
    }

    if (time.seconds < 10) {
        time.seconds = "0" + time.seconds.toString();
    }
}

function openMessageMenu(element) {
    document.querySelector("aside").style.right = "0";
    document.querySelector(".dark-screen").classList.remove("hidden");
}

function closeMessageMenu() {
    document.querySelector("aside").style.right = "-75%";
    document.querySelector(".dark-screen").classList.add("hidden");
}