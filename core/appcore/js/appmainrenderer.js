const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.remote.BrowserWindow;
const path = require("path");
const url = require("url");
const mysql = require('mysql');

console.log("this is appmain.js which is a render.js");

// Default loading windows at startup everytime
$("#menuleft").load("app_modules/menus/menuleft.html");

$("#main-content").load("app_modules/content_window/dashboard.html");

$("#menuright").load("app_modules/notification/notification.html");

// Default loading windows at startup only first time Login/Signup Button

// Load the signin/signup buttons here

//// Connecting to Database ////
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'simplerAccountsDb'
// });
// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Connected!');
// });

// Document ready function is a must as it ensures the default window has finished loading
$(document).ready(function() {
  ///// Capturing all clicks in the document /////
  $(document).on("click", function(clickedEvent) {
    // let returnedHtml;
    // let searchUrl= "./app_modules/content_window/preview_invoice.html";//modify to this to change the file.html to desired.html
    // $.get(searchUrl, function(returnedHtml) {
    //     console.log(returnedHtml);
    // });

    /// Hiding All Expanded Buttons ///
    jQuery(".collapse").collapse("hide");
    
    try {
      //mainly clicked event is an object I can access
      let btnValue = clickedEvent.target.attributes.value.value;

      // Use Case of the function
      // Loading Windows on button click

      if (btnValue != null) {
        // console.log($(clickedEvent.target)); //this is to see the availabe method& variables i can access
        // console.log(btnValue); //this is an example of above

        // It is simplified because changing only the contents of Mainwindow
        let urlBodyStr = "app_modules/content_window/replace.html";
        let urlCompleteStr = urlBodyStr.replace("replace", btnValue); //word to replace,replace with

        console.log("The Complete Url Directory of The Main Content to load "+urlCompleteStr);
        // This is always designed to be main-container
        $("#main-content").load(urlCompleteStr);
      }

      // console.log($(clickedEvent.target).text());// here this equals document
      // console.log($(clickedEvent.target).is("#all"));// here this equals document
    } catch (err) {
      console.log("Button value is empty");
    }
  });
});




