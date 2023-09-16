// npm modules
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();


// node core modules
const fs = require('fs'); 
const path = require('path');


// variables
const port = process.env.port || 3000;
let pageName;



// MIDDLEWARES
app.use(cors());
// set ejs as view engine
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));



/*********************************************
          multer configurations
*********************************************/

// set-up multer storage engine method
const fileStorageEngine = multer.diskStorage({
    destination: './public/images',
    
    filename: (req, file, cb) =>{
        //use "file" object to access the image
        const file_full_name = file.originalname;

        // replace any space occurrence in-between the file name with underscore sign.
        let file_fullName = file_full_name.replaceAll(" ","_");

        const split_fileFullName = file_fullName.split('.'); //split the name as ['<file-name>', '<extension name>']
        const fileName_only = split_fileFullName[0]; //assign the <file-name> to this variable
        const fileExtention_only = split_fileFullName[1]; //and assign the <extension name> to this variable

        // create a new format for the file name and pass the result to the Callback object
        const new_name = `${Date.now()}-${fileName_only}---paschalogba-fileManagerProject.${fileExtention_only}`;
        cb(null, new_name);
    }
});

// assign the storage engine method to multer
const uploadFileConfig = multer({storage: fileStorageEngine});



/********************************************
 *               APP ROUTES 
********************************************/
app.get('/', (req, res)=>{

    // path to folder containing all the images
    const imageDir = './public/images';
    pageName = 'Home'; //route name

    fs.readdir(imageDir, (err, imageFiles)=>{
        if(!imageFiles || err ){
            console.error(`error while reading directory---> ${err}`);
            res.status(500).send('Internal Server Error')
        }else{
            // Render the EJS template and pass imageFiles and pageName objects.
            console.log(imageFiles)
            res.render('index.ejs', {imageFiles, pageName});
        }
    });
});



// Upload file route
app.post('/upload',uploadFileConfig.single('send_file'), (req, res)=>{
    pageName = 'Upload File';
    try {
        return res.redirect("/");
    } catch (error) {
      console.error('Error uploading image:', err);
      res.status(500).send('Error uploading image');
    }
});



// Delete file route
app.get('/delete/:fileName', (req, res)=>{
    pageName = 'Delete';

    // get the file URL param name
    let fileName = req.params['fileName'];

    // create absolute path for the file using path.join()
    // let filePath = path.join(__dirname,'public','upload',fileName);
    let filePath = path.join(__dirname,'public','images',fileName);

    // pass the filePath to unlink() method of fs module to delete the file 
    fs.unlink(filePath,(err)=>{
        if (err) {
            console.error(`Error deleting image: ${err.message}`);
            res.status(500).send('Error deleting image');
        }else{
            // redirect back home after successful deletion
            res.redirect('/');
        }
    });
});



// Download file route
app.get('/download/:fileName', (req, res)=>{

    // get the file URI param name
    let fileName = req.params['fileName'];
    console.log("Download",fileName,"requested");

    // create absolute path for the <filename> using path.join() method
    let filePath = path.join(__dirname, 'public', 'images', fileName);

    // then pass the filePath to download method of res object to
    // download the file
    res.download(filePath, (err)=>{
        if (err) {
            // send Error Message
            res.sendStatus(404).send('file not found');
        }
    });

});



app.listen(port, ()=>{
    console.log(`server running on http://localhost:${port}`);
});
