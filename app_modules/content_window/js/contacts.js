const fs = require('fs');
const path = require('path');

nameFirst = document.getElementById('nameFirst');
nameMid = document.getElementById('nameMid');
nameLast = document.getElementById('nameLast');
nickName = document.getElementById('nickName');
mobileNumber = document.getElementById('mobileNumber');

btnCreateContact = document.getElementById('btnCreateContact');

let pathName = path.join(__dirname,'test');

$(document).ready(function() {
    console.log("contact js ran");
btnCreateContact.addEventListener('click',function()
{
    console.log("btnCreateContact clicked");
    //creating a file with name using nicename
    let file = path.join(pathName,nickName.value);
    let contact = mobileNumber.value;
    // writing to fileSystem
    fs.writeFile(file,contact,function(err)
    {
      if(err)
      {
          return console.log(err);
      }
      console.log("The contact was sucessfully created");  
    })
});
});