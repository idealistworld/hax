// Set up the control panel
var keypad1 = document.createElement("div");
keypad1.innerHTML = "<input placeholder ='month (Jan = 01)' id = 'month-input' style = 'z-index: 99999; margin-top: 100px'></input> <input placeholder ='Day (1st = 01)' id = 'day-input'></input> <input placeholder ='year' id = 'year-input'></input> <button id = 'set-date-button'>Set Starting Date</button><button id = 'clear-list'>Clear List</button><button id = 'view-list'>View List</button><button id = 'download-list'>Download List</button><br><br><input placeholder = 'Iteration Value' id = 'iteration-value'></input><input placeholder = 'Starting Date' id = 'starting-date' style = 'width:200px'></input>";
document.body.prepend(keypad1);

// Declare placeholder date variables
var dataMonth = 0
var dataDay = 0
var dataYear = 0
var iterationValue = 0

// Get the current date
const date = new Date();
let todayDay = date.getDate();
let todayMonth = date.getMonth() + 1;
let todayYear = date.getFullYear();
let currentDate = [todayMonth, todayDay, todayYear];

// Set month
chrome.storage.local.get(["month"]).then((result) => {
  dataMonth = result.month
});

// Set day
chrome.storage.local.get(["day"]).then((result) => {
  dataDay = result.day
});

// Set year
chrome.storage.local.get(["year"]).then((result) => {
  dataYear = result.year
});

// Clear the data inputs into the current list of scraped data
function clearList() {
  chrome.storage.local.get(["urlList"]).then((result) => {
    chrome.storage.local.set({ "urlList": [] }).then(() => {
      alert("List has been cleared")
    });
  });
}

// View the current list
function viewList() {
  chrome.storage.local.get(["urlList"]).then((result) => {
    alert("URL List Length: " + result.urlList.length + "\n\n\n" + result.urlList)
  });
}

// Set the date within the local Chrome storage
function setDate() {
  var newMonth = parseInt(document.getElementById("month-input").value)
  var newDay = parseInt(document.getElementById("day-input").value)
  var newYear = parseInt(document.getElementById("year-input").value)
  chrome.storage.local.set({ "iterate": 0 }).then(() => {
  });
  var compiledStartingDate = new Date(newYear, newMonth - 1, newDay).toJSON()
  chrome.storage.local.set({"startingDate": compiledStartingDate }).then(() => {
  });
  chrome.storage.local.set({ "month": newMonth }).then(() => {
  });
  chrome.storage.local.set({ "day": newDay }).then(() => {
  });
  chrome.storage.local.set({ "year": newYear }).then(() => {
  });
  chrome.storage.local.get(["iterate"]).then((result) => {
    alert("Starting date has been updated to " + newMonth + "/" + newDay + "/" + newYear + ". With an iteration of " + result.iterate)
  });
}

// Update link lists 
function updateDataList(newUrls) {
  var updatedLinks = []
  chrome.storage.local.get(["urlList"]).then((result) => {
    updatedLinks = result.urlList;
    for (var x = 0; x < newUrls.length; x++) {
      updatedLinks.push(newUrls[x])
    }
    chrome.storage.local.set({ "urlList": updatedLinks }).then(() => {
    });
  });
}

// Go to the next date
function nextDate() {

  // Set random timeout variables so Google doesn't get sus
  var firstRandomValue = 1000 * (Math.random() * 1.5)
  var secondRandomValue = 1000 * (Math.random() * 1.5)

  setTimeout(() => {
    // Navigate to the custom date selection page
    toolsButton = document.querySelector(".nfSF8e")
    toolsButton.click()
    anyTimebutton = document.querySelector(".KTBKoe")
    anyTimebutton.click()

    setTimeout(() => {
      customRangeButton = document.querySelector('span[role="menuitem"][tabindex="-1"][jsaction="EEGHee"]');
      customRangeButton.click()

      // Pull the URL data from the page
      listOfAllLinks = document.querySelectorAll(".yuRUbf")
      var listToInput = [];
      for (var x = 0; x < listOfAllLinks.length; x++) {
        var cleanLink = listOfAllLinks[x].innerHTML.substring(14)
        var cutoff = cleanLink.indexOf('"')
        cleanLink = cleanLink.substring(0, cutoff)
        listToInput.push(cleanLink)
      }

      setTimeout(() => {
        // Call function to update the database from the newly parsed links
        updateDataList(listToInput);

        // Add to the value of iteration to go to the next date
        chrome.storage.local.get(["iterate"]).then((result) => {
            var newIterationValue = parseInt(result.iterate) + 1
            chrome.storage.local.set({ "iterate": newIterationValue }).then(() => {
          // Set the next date within the loop
          setTimeout(() => {
            updateDataList(listToInput);
            chrome.storage.local.get(["startingDate"]).then((result) => {
              var storedJSONDate = result['startingDate'];
              var jsonToDate = new Date(storedJSONDate);

              var futureDate = new Date(jsonToDate.getTime());
              futureDate.setDate(jsonToDate.getDate() + newIterationValue);
               document.getElementById("OouJcb").value = (parseInt(futureDate.getMonth()) + 1) + "/" + futureDate.getDate() + "/" + futureDate.getFullYear();
               document.getElementById("rzG2be").value = (parseInt(futureDate.getMonth()) + 1) + "/" + futureDate.getDate() + "/" + futureDate.getFullYear();
               
               setTimeout(() => {
                document.querySelector(".Ru1Ao").click()
              }, 1000);
            });
  
            }, secondRandomValue);
            });

        });

      }, secondRandomValue);

    }, firstRandomValue);

  }, secondRandomValue)
}

// Download a CSV file containing all the links
const triggerCsvDownload = (fileName = 'link_list.csv') => {
  chrome.storage.local.get(["urlList"]).then((result) => {
    const urlList = result.urlList;
    const csvPayload = urlList.map(url => [url].join(',')).join('\n'); // Format URLs into rows
    
    const blob = new Blob([csvPayload], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', fileName)
    
    document.body.appendChild(a)
    a.click()
    
    document.body.removeChild(a)
  });
}


// Load in scripts to the control panel
setTimeout(() => {
  // Set iteration value 
chrome.storage.local.get(["iterate"]).then((result) => {
  iterationValue = result.iterate
  document.getElementById('iteration-value').value = "Iteration Value: " + iterationValue
});
chrome.storage.local.get(["startingDate"]).then((result) => {
  var startingDateObject = result.startingDate
  startingDateObject = startingDateObject.substring(0, 10).split("-")
  document.getElementById('starting-date').value = "Starting Date: " + startingDateObject[1] + " " + startingDateObject[2] + " " + startingDateObject[0]
});
  document.getElementById("set-date-button").addEventListener("click", setDate);
  document.getElementById("clear-list").addEventListener("click", clearList);
  document.getElementById("view-list").addEventListener("click", viewList);
  document.getElementById("download-list").addEventListener("click", triggerCsvDownload);
  nextDate();
}, 2000);