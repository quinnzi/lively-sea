import express from 'express';
import {promises as fs} from 'fs';
import sfs from 'fs';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import classRouter from './classRouter.mjs';
import PostRouter from './PostRouter.mjs';
import NewsRouter from './NewsRouter.mjs';
import multer, { memoryStorage } from 'multer';
import {google} from 'googleapis';
import dotenv from 'dotenv';
import cookie from 'cookie-session';
import { Readable } from 'node:stream';
import cors from 'cors'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();


app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.set('trust proxy', 1);

app.use((err, req, res, next) => {
  console.error("Caught global Express error:", err.stack);
  res.status(500).json({ 
    error: "Custom Server Error", 
    message: err.message 
  });
});
const oauth2Client = new google.auth.OAuth2(
  process.env.DRIVE_CLIENT_ID,
  process.env.DRIVE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' 
);

oauth2Client.setCredentials({
  refresh_token: process.env.DRIVE_REFRESH_TOKEN
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });
/*var readverify =  await fs.readFile('./verify.json', (err, data)=>{
    if(err) throw err;
    console.log(err)})

const userData = JSON.parse(readverify)

for(let user in userData){
   userData[user] = await bcrypt.hash(userData[user], 10)
}

const data = JSON.stringify(userData)
   
fs.writeFile('./verify.json', data, (err)=>{
    if (err) throw err;
    console.log(err)
    })

console.log(userData) 
*/
app.set('view engine', 'ejs');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'vulgus')));
app.use(cookie({
  name: 'session',
  keys: [process.env.KEY_1, process.env.KEY_2],
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
sameSite: 'lax',
  secure: false
}));


const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

      



app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
  console.log(`[REQUEST RECEIVED] ${req.method} -> ${req.url}`);
  next();
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/vulgus/Homepage.html');
})

app.get('/getProjects', async (req, res) => {
    const projects = await connection.query(`SELECT * FROM projects WHERE type = 'Projects';`);
            res.json(projects[0]);


})
app.get('/getNews', async (req, res) => {
    const news = await connection.query(`SELECT * FROM projects WHERE type = 'News' ORDER BY id DESC;`);
            res.json(news[0]);


})
app.get('/login', (req, res) => {
    if(req.session){
    res.redirect('/Dashboard')
}
else{
    res.sendFile(__dirname + '/vulgus/Login.html')
}
});

app.get('/aboutus', (req, res) => {
    res.sendFile(__dirname + '/vulgus/AboutUs.html')});
app.get('/Calendar.html', (req, res) => {
    
     res.render('Calendar', 
    {user: req.session.username}
)
});
app.get('/Dashboard', (req, res) => {
    res.sendFile(__dirname + '/vulgus/Dashboard.html')});
app.get('/events', async (req, res) => {
    try{
            const data = await connection.query('SELECT  title, backgroundColor, start, end FROM events');
            res.json(data[0]); 
            console.log(data[0]);
                console.log('Calendar Data sent?');
             }
             
             catch(err){
                console.error(err);
             }
                }
)
app.get('/getEvents', async (req, res) => {
    try{
             const data = await connection.query('SELECT  title, backgroundColor, start, end, description FROM events');
            res.json(data[0]);
            console.log(data[0]);
                console.log('Calendar Data sent?');
             }
             
             catch(err){
                console.error(err);
             }
                }
)

app.get('/calendar', (req, res) => {
    console.log(req.session.username)
    console.log("user: " + req.session.username)
       res.render('Calendar', 
    {user: req.session.username}
)
});

app.get('/student-add', (req, res) => {
    res.sendFile(__dirname + '/LOTUS!/Student-Add.html')});



app.use('/classroom', classRouter);
app.use('/post', PostRouter);
app.use('/news', NewsRouter);
app.get('/getProjects', async (req, res) => {
    const projects = await connection.query(`SELECT * FROM projects WHERE type = 'Projects';`);
            res.json(projects[0]);


})

app.get('/aboutus', (req, res) => {
    res.sendFile(__dirname + '/vulgus/AboutUs.html')});

app.get('/events', async (req, res) => {
    try{
            const data = await connection.query('SELECT  title, backgroundColor, start, end FROM events');
            res.json(data[0]);
            console.log(data[0]);
                console.log('Calendar Data sent?');
             }
             
             catch(err){
                console.error(err);
             }
                }
)
app.get('/history', (req, res) => {
    res.sendFile(__dirname + '/vulgus/History.html')});
    
app.get('/page-not-found', (req, res) => {
    res.sendFile(__dirname + '/vulgus/404.html')});

app.get('/news', (req, res) => {
    res.sendFile(__dirname + '/vulgus/News.html');
})
app.get('/projects', (req, res) => {
    res.sendFile(__dirname + '/vulgus/Projects.html')});
app.get('/student-home', (req, res)=>
{
    if(req.session.student){
    res.sendFile(__dirname + '/LOTUS!/student-dashboard.html');}
    else{
        res.redirect('/login')
    }
})

app.get('/student-class', (req, res)=>
{
    
    res.sendFile(__dirname + '/LOTUS!/Class-Student.html');

})


app.get('/teacher-home', (req, res)=>
{
    res.sendFile(__dirname + '/LOTUS!/d-dashboard.html');})
app.get('/class-teacher', (req, res)=>
{
    res.sendFile(__dirname + '/LOTUS!/class.html');})
app.get('/addproject', (req, res)=>
{
    res.sendFile(__dirname + '/vulgus/Project-Add.html');
})

app.get('/eventlist', async (req, res) =>{
  const currentDate = new Date();

const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

console.log(currentDate);
const recentEvents = []
try{
  const recent = await connection.query("SELECT * FROM events WHERE start > ? ORDER BY start LIMIT 4",[currentDate]);
  for(const event of recent[0]){
    const eventDate = new Date(event.start);
    const eventData = {
        title: event.title,
        month: months[eventDate.getMonth()],
        day: eventDate.getDay(),
        desc: event.description,
        date: eventDate

    }
    recentEvents.push(eventData)
  }
    console.log(recent);
    res.json(recentEvents);
}
catch(err){
    console.error(err);
    res.send("not wroking" + err);
}
    
})






import hashedPassword from './verify.json' with {type: 'json'};
import console from 'console';

app.post('/login', async (req, res)=>{
    const {username, password} = req.body;
    const pass = password;
    const realpass =  hashedPassword[username];
    console.log("Stored Hash found?:", !!realpass);

    if (!realpass){
        return res.status(401).send("Invalid username");
    }
try{
    const matching = await bcrypt.compare(pass, realpass);
        if(matching){
            console.log("before" + req.session)
            req.session.username = username;
            console.log(req.session.username)
            user = req.session.username
            res.status(200).send('password correct!');
            
            
        }
        else {
            res.status(400).send('Password incorrect!');
        }
    }
    catch(err){
        return res.status(500).send("Server Error");
    }
    
})
let fileID;
let FileArray = []
app.post('/image-crusher', upload.single('Qimage'), async (req, res) =>
{
    const base64Img = req.file.buffer.toString('base64');
    const imageSrc = `data:${req.file.mimetype};base64,${base64Img}`;

    const newFile = {
      url: imageSrc,
      blob: req.body.blobUrl,
      name: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer 
    };
    
    FileArray.push(newFile)
    console.log(newFile)
    const url =  imageSrc;

res.json({url});

})
export{ user } 
app.post('/calendar', async (req, res)=>{
    const {eventstart, eventend, eventname, eventtype} = req.body;
        await connection.query(
            'INSERT INTO events SET start = ?, description = ?, end = ?, title = ?, backgroundColor = ?', [req.body.eventstart, req.body.eventdesc, req.body.eventend, req.body.eventname, req.body.eventtype]);
                
            res.send("Added!");

    
    })

let newsReset = []
let postReset = []
app.post('/saveProject', upload.single('cover-image'), async (req, res) =>
{
    let coverImgLink = "N/A";
    if(req.file){
const url = __dirname + `/uploads/temp/${req.file.originalname}`;
console.log(url + "From SP route");
    const img = req.file.originalname;
    const MIME = req.file.mimetype;
    try{
const fileStore = await drive.files.create({
  requestBody: {
    name: img,
    parents: [process.env.DRIVE_FOLDER_ID], 
  },

  media: {
    mimeType: MIME,
    body: Readable.from(req.file.buffer),
  },
  fields: 'id, webViewLink', 

  supportsAllDrives: true
});

    fileID = fileStore.data.id;
    await drive.permissions.create({
      fileId: fileStore.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

coverImgLink = `https://drive.google.com/thumbnail?id=${fileStore.data.id}&sz=w1000`;
}
catch(err){
        console.log(err)
        res.send(err)
    }
    }

try{
        await connection.query(
            'INSERT INTO projects SET title = ?, text = ?, type = ?, cover = ?, classroom = ?', [req.body.title, 
                req.body.text, req.body.type, coverImgLink, req.body.classroom]);
            console.log(req.body.text + "text to save");
            res.send("post proceesed?");
}
catch(err){
    res.send(err)
    console.log(err)
}
newsReset = [0]
postReset = [0]
newsReset = []
postReset = []
})
export let PostArray = newsReset
export let NewsArray = postReset

let img 
let buffer
let mime 
    
app.post('/savePimages', async (req, res)=>{
    const urle = req.body.urls;
    const urls = [urle];
    let files = [];

  

for (const url of urle) {
      console.log(urls)
for (const file of FileArray){
    console.log(urle)
    if(file.blob === url){
        
        img = file.name
        mime = file.mimeType
        buffer = file.buffer
        console.log(true)
    }
    else{console.log(false)}
}

const fileStore = await drive.files.create({
  requestBody: {
    name: img,
    parents: [process.env.DRIVE_FOLDER_ID], 
  },

  media: {
    mimeType: mime,
    body: Readable.from(buffer),
  },
  fields: 'id, webViewLink', 

  supportsAllDrives: true
});

    await drive.permissions.create({
      fileId: fileStore.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    console.log("ID: " + fileStore.data.id);
files.push(`https://drive.google.com/thumbnail?id=${fileStore.data.id}&sz=w1000`)
     console.log(files);
     console.log("DONE!!!");
   
}
  res.json({files})
FileArray = []
    })


app.get('/end', async (req, res) => {
        req.session = null
        user = null
        console.log("You're incompetent!")
        console.log(req.session)
        res.send("STOPIRT")
    }
) 

app.get('/:random', (req, res) => {
    res.redirect('/page-not-found')});


app.post('/checkAcc', async (req, res)=>{
    try{
       const id = req.body.studentID
       const student = await connection.query(
            `SELECT id FROM students WHERE studentID = ${id}`);
            console.log(student[0], student)
       const found = student[0]
        if(found.length === 0){
            res.status(404).send("New Student!")
        }
        else{
            req.session.student = req.session.studentName
            console.log("Student Found!")
            res.redirect('/')
        }    
          
}
catch(err){
    res.send(err)
    console.log(err)
}})

 app.post('/saveReq', async (req, res)=>{
       const{ studentName, studentID, studentEmail, parentEmail } = req.body

             try{
            await connection.query(
            'INSERT INTO students SET parentEmail = ?, parentPassword = ?, studentName = ?, studentID = ?, studentEmail = ?', [parentEmail, 
        studentName, studentID, studentEmail]);
             res.status(200).send("Request Made!")
            }
             catch(err){
                console.error(err)
                res.send(err)
             }
            
            

            }
    )


    app.get('/ephemeral', async (req, res)=>{
        
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numChars = "0123456789";
        const specialChars = "!@#$%&-_?";

          
            let chars
            chars = lower
            chars += upperChars
            chars += specialChars
            chars += numChars
           
            const length = Math.floor((Math.random() * 2) + 10)
            let parentPass = chars[length]
            console.log(length)
            console.log(chars)
            console.log(parentPass)
            const ray = new Uint32Array(1)
            for(let i = 0; i < length; i++){
            
   
            const n = crypto.getRandomValues(ray).toString()
            let ion = n % 71
            parentPass = parentPass + chars[ion]
            console.log("l " +ion)
            console.log("p " + parentPass)
            }
res.send(parentPass)
    })

app.listen(3002, (err, next)=>{
    if(err){console.log(err)}
    console.log('She might be listening...')
}
)
