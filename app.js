const express = require('express')
const fs = require('fs')
const path = require('path')
const { nextTick } = require('process')
const app = express()
//register view engine
app.set('view engine', 'ejs')
app.set('views', 'view')

const d = new Date()
const date = d.getFullYear()


//middleware &static files
app.use(express.static('public'))

app.use((req,res,next)=>{
    if(!fs.existsSync(path.join(__dirname,"logs"))){
        fs.mkdir(path.join(__dirname,'logs'),()=>{
            console.log("opor")
        })
        fs.appendFile(path.join(__dirname, 'logs','requestlog.txt'),`${req.hostname}\t${req.path}\t${req.method}\n`,()=>{
            console.log("success")
        })
        next()
    }else{
        fs.appendFile(path.join(__dirname, 'logs','requestlog.txt'),`${req.hostname}\t${req.path}\t${req.method}\n`,()=>{
            console.log("success")
        })
        next()
    }
    
})

const blogs = [
    {title: 'post 1', snippet:'something to say 1'},
    {title: 'post 2', snippet:'something to say 2'},
    {title: 'post 3', snippet:'something to say 3'}
]

app.get('/',(req, res)=> {
    console.log(req.url, req.method)
    // res.sendFile(path.join(__dirname, 'view', 'index.html'))
    //render a view 
    res.render('index', {title: 'Home', blogs, date})
})
app.get('/about',(req, res)=> {
    console.log(req.url, req.method)
    // res.sendFile(path.join(__dirname, 'view', 'about.html'))
    res.render('about', {title: 'About', date})
})
app.get('/blogs/create', (req, res)=>{
    res.render('create', {title: 'create post', date})
})
app.get('/old-page', (req, res)=>{
    res.redirect('/about')
})
// .use is used for middlewares
app.use((req, res)=>{
    res.status(404).sendFile(path.join(__dirname, 'view', '404.html'))
})

app.listen(3500)
