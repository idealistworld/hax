function activatePopup () {
    chrome.storage.local.set({ "showPopup": "True" }).then(() => {
        alert("Activated")
    });
}

function deactivatePopup () {
    chrome.storage.local.set({ "showPopup": "False" }).then(() => {
        alert("Deactivated")
    });
}

function createFirstList () {
    chrome.storage.local.set({ "urlList": [] }).then(() => {
        alert("List Created")
    });
}
    
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("activate-button").onclick = activatePopup
    document.getElementById("deactivate-button").onclick = deactivatePopup
    document.getElementById("list-button").onclick = createFirstList
})