// This function is used to start and stop the scraping when a Google page is loaded 

export function startAndStopFunction () {
  chrome.storage.local.get(["startAndStop"]).then((result) => {
    if (result.startAndStop == "Stop"){
      chrome.storage.local.set({ "startAndStop": "Start" }).then(() => {
        alert("Set to Start")
      });
    }
    else 
    {
      chrome.storage.local.set({ "startAndStop": "Stop" }).then(() => {
        alert("Set to Pause")
      });
    }
  });
}