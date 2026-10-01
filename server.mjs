import express from 'express';
import {promises as fs} from 'fs';
import sfs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import cookie from 'cookie-session';
import { Readable } from 'node:stream';
import cors from 'cors'
import multer, { memoryStorage } from 'multer';
import { createClient } from '@supabase/supabase-js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express()

const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

      



app.use('/uploads', express.static('uploads'));
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const storageObject = supabase.storage

const bobo = storageObject.from('Unspeakable')


app.set('trust proxy', 1);

app.use((err, req, res, next) => {
  console.error("Caught global Express error:", err.stack);
  res.status(500).json({ 
    error: "Custom Server Error", 
    message: err.message 
  });
});

app.set('view engine', 'ejs');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(cookie({
  name: 'session',
  keys: [process.env.KEY_1, process.env.KEY_2],
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
sameSite: 'lax',
  secure: false
}));

const {data, error} =

app.get('/', async (req, res) => {
   const p = await supabase.from('prompts').select("name").eq("chosen", "yes")
   const del = await p.data
   console.log(del[0].name)
    res.render('home', {prompt: del[0].name})
})

app.get('/gallery', async (req, res) => {
    res.sendFile(__dirname + '/gallery.html')


})

app.get('/archive', async (req, res) => {
res.sendFile(__dirname + '/archive.html')


})

app.get('/add', async (req, res) => {
res.sendFile(__dirname + '/add.html')


})
app.get('/leaderboard', async (req, res) => {
res.sendFile(__dirname + '/leaderboard.html')


})

app.get('/board', async (req, res) => {
const datz = (await supabase.from('Projects').select('*')).data
console.log(datz)
res.json(JSON.stringify(datz))

})

app.get('/bo', async (req, res) => {

res.send("blessTheSingingTorpedoes")

})

app.post('/col', upload.single('P-image'), async (req, res) =>
{
    try{
    if(req.file){
    const base64Img = req.file.buffer.toString('base64');
const {data, error} = await bobo.upload(`${Date.now() + req.file.originalname}`, req.file.buffer)
const url = data.path
console.log(url + "url");

const lin = await supabase.from('Projects').insert([{ username: req.body.user, title: req.body.title, link: req.body.link, image: "https://anaqfrfcvaygapjjcyel.supabase.co/storage/v1/object/public/Unspeakable/" + encodeURIComponent(url)}])

res.send("https://anaqfrfcvaygapjjcyel.supabase.co/storage/v1/object/public/Unspeakable/" + encodeURIComponent(url))
}
else{
    res.statusCode(404).send("No photo try againzers")
    
}}
catch(err){
    console.log(err)
}
})

app.post('/prompts', async (req, res) =>
{
const z = await supabase.from('prompts').update({chosen: "no"}).eq("chosen", "yes")
const promptz = await supabase.from('prompts').insert([{ name: req.body.prompt, chosen: "yes"}])


res.send("Success!!")


})


app.listen(3002, (err, next)=>{
    if(err){console.log(err)}
    console.log('She might be listening...')
}
)
