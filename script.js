
function openMessageMenu(element){
    document.querySelector("aside").style.right = "0";
    document.querySelector(".dark-screen").classList.remove("hidden");
}

function closeMessageMenu(){
    document.querySelector("aside").style.right = "-75%";
    document.querySelector(".dark-screen").classList.add("hidden");
}