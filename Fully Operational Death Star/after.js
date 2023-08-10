// Set up the control panel
chrome.storage.local.get(["showPopup"]).then((result) => {
  if (result.showPopup == "True") {
    var keypad1 = document.createElement("div");
    keypad1.innerHTML = "<style> @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200;0,6..12,300;0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;0,6..12,800;1,6..12,200;1,6..12,300;1,6..12,400;1,6..12,500;1,6..12,600;1,6..12,700;1,6..12,800&display=swap'); .page-insert {background-color: black !important; font-family: 'Nunito Sans', sans-serif !important; margin-top: 100px; height: 250px; display: flex; flex-direction: column; align-items: center; justify-content: center;  button {background-color: white; color: black; font-weight: 900; border-radius: 20px;} input {background-color: black; color: white; border-radius: 20px}</style><div class = 'page-insert'><div><input placeholder ='START MONTH' id = 'month-input' style = 'z-index: 99999;'></input> <input placeholder ='START DAY' id = 'day-input'></input> <input placeholder ='START YEAR' id = 'year-input'></input><button id = 'set-date-button'>SET STARTING DATE</button></div><br><div><button id = 'clear-list'>CLEAR LIST</button><button id = 'view-list'>VIEW LIST</button><button id = 'download-list'>DOWNLOAD LIST</button><button id = 'start-stop'>START AND STOP</button></div><br><div><input placeholder = 'TIME FRAME' id = 'time-frame'></input><button id ='set-time-frame-button'>SET TIME FRAME</button><br><br><input placeholder = 'ITERATION VALUE' id = 'iteration-value'></input><input placeholder = 'STARTING DATE' id = 'starting-date' style = 'width:200px'></input></div></div>";
    document.body.prepend(keypad1);
  }
});

function startAndStopFunction() {
  chrome.storage.local.get(["startAndStop"]).then((result) => {
    if (result.startAndStop == "Stop") {
      chrome.storage.local.set({ "startAndStop": "Start" }).then(() => {
        alert("Set to Start")
      });
    }
    else {
      chrome.storage.local.set({ "startAndStop": "Stop" }).then(() => {
        alert("Set to Pause")
      });
    }
  });
}

// Declare placeholder date variables
var iterationValue = 0

// Get the current date
const date = new Date();
let todayDay = date.getDate();
let todayMonth = date.getMonth() + 1;
let todayYear = date.getFullYear();
let currentDate = [todayMonth, todayDay, todayYear];

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

// Set time frame to scrape from
function setTimeFrame() {
  timeFrameToScrape = parseInt(document.getElementById("time-frame").value)
  chrome.storage.local.set({ "timeFrame": timeFrameToScrape }).then(() => {
    alert("The new time frame is " + timeFrameToScrape)
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
  chrome.storage.local.set({ "startingDate": compiledStartingDate }).then(() => {
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
      listOfDescriptions = document.querySelectorAll(".VwiC3b")

      var listToInput = [];
      for (var x = 0; x < listOfAllLinks.length; x++) {
        var cleanLink = listOfAllLinks[x].innerHTML.substring(14)
        var cutoff = cleanLink.indexOf('"')
        cleanLink = cleanLink.substring(0, cutoff)
        var indexOfGMAIL = listOfDescriptions[x].innerHTML.indexOf("@<em>")
        var gmailSection = listOfDescriptions[x].innerHTML.substring(indexOfGMAIL - 20, indexOfGMAIL)
        var indexOfSpace = gmailSection.indexOf(" ")
        gmailSection = gmailSection.substring(indexOfSpace, 40)
        gmailSection = gmailSection + "@gmail.com"

        var gmailRegex = /\b[A-Za-z0-9._%+-]+@gmail\.com\b/;
        var match = gmailSection.match(gmailRegex);

        cleanLink = cleanLink + " " + match
        listToInput.push(cleanLink)
      }

      setTimeout(() => {
        // Call function to update the database from the newly parsed links
        updateDataList(listToInput);

        // Add to the value of iteration to go to the next date
        chrome.storage.local.get(["iterate"]).then((result) => {
          var newIterationValue = parseInt(result.iterate) + 1

          // Set the next date within the loop
          setTimeout(() => {

            updateDataList(listToInput);
            chrome.storage.local.get(["startingDate"]).then((result) => {
              var storedJSONDate = result['startingDate'];

              var jsonToDate = new Date(storedJSONDate);

              var futureDate = new Date(jsonToDate.getTime());

              chrome.storage.local.get(["timeFrame"]).then((result) => {
                var timeSpanToIterate = result.timeFrame;
              
                // Calculate future date considering month changes
                var daysToAdd = (newIterationValue - 1) * timeSpanToIterate;
                var futureDate = new Date(jsonToDate.getFullYear(), jsonToDate.getMonth(), jsonToDate.getDate() + daysToAdd);
              
                document.getElementById("OouJcb").value = (futureDate.getMonth() + 1) + "/" + futureDate.getDate() + "/" + futureDate.getFullYear();
              
                // Update storage and set the next future date
                chrome.storage.local.set({ "iterate": newIterationValue }).then(() => {
                  daysToAdd = newIterationValue * timeSpanToIterate;
                  futureDate = new Date(jsonToDate.getFullYear(), jsonToDate.getMonth(), jsonToDate.getDate() + daysToAdd);
              
                  document.getElementById("rzG2be").value = (futureDate.getMonth() + 1) + "/" + futureDate.getDate() + "/" + futureDate.getFullYear();
              
                  setTimeout(() => {
                    document.querySelector(".Ru1Ao").click();
                  }, 1000);
                });
              });
              

            });

          }, secondRandomValue);

        });

      }, secondRandomValue);

    }, firstRandomValue);

  }, secondRandomValue)
}

// Download a CSV file containing all the links
const triggerCsvDownload = (fileName = 'link_list.csv') => {
  chrome.storage.local.get(["urlList"]).then((result) => {
    const urlList = result.urlList;

    var listOfRowsCSV = [];

    for (var x = 0; x < urlList.length; x++) {
      const emailMatch = urlList[x].match(/\b[A-Za-z0-9._%+-]+@gmail\.com\b/);
      if (emailMatch) {
        listOfRowsCSV.push(`${urlList[x].split(" ")[0]},${emailMatch[0]}`); // Link in the first column, Gmail in the second column
      } else {
        listOfRowsCSV.push(`"",`); // Link in the first column, empty in the second column
      }
    }

    const csvContent = "Links,Gmails\n" + listOfRowsCSV.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
  });
};




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
  document.getElementById("set-time-frame-button").addEventListener("click", setTimeFrame);

  chrome.storage.local.get(["startAndStop"]).then((result) => {
    if (result.startAndStop == "Start") {
      nextDate();
    }
  });

}, 3000);

setTimeout(() => {
  document.getElementById("start-stop").addEventListener("click", startAndStopFunction);
}, 1500)