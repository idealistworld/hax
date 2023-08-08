console.log("asdf")

const date = new Date();
let todayDay = date.getDate() + 30;
let todayMonth = date.getMonth() + 1;
let todayYear = date.getFullYear();
let currentDate = [todayMonth, todayDay, todayYear];

var today = new Date();
var priorDate = new Date(new Date().setDate(today.getDate() + 30));

console.log(today)
console.log(priorDate);
var compiledStartingDate = new Date(1, 1, 2023)
console.log(compiledStartingDate)