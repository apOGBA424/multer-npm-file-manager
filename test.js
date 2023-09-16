const fs = require('fs');
const os = require('os');
const path = require('path');



// fs.readFile('./public/images', (err, data)=>{
fs.readdir('./public/images', (err, data)=>{
    if(err){
        console.log(err.message);
    }
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        console.log(`${os.homedir}  ${element}`);
    }
});



// console.log(fs);
// console.log(os);
// console.log(path);
