const express = require('express')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const { render } = require('ejs')
const app = express()
const dburi = 'mongodb+srv://metroadmin:metroadmin\@nodetuts.1lgtazt.mongodb.net/nodetuts?retryWrites=true&w=majority'
mongoose.connect(dburi,{useNewUrlParser: true, useUnifiedTopology: true})
.then(res => app.listen(3500))
.catch(err => console.log(err))
//register view engine
app.set('view engine', 'ejs')
app.set('views', 'view')

const d = new Date()
const date = d.getFullYear()

//middleware &static files
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended:true}))

//mongoose and mongo
app.get('/add-blog',(req, res) => {
    const blog = new Blog({
        title:'new blog',
        snippet:'about my new blog',
        body: 'more about my blog'
    })

    blog.save()
    .then(result => {
        res.send(result)
    }).catch(err=>{
        console.log(err)
    })
})
app.get('/all-blogs', (req,res)=>{
    Blog.find()
    .then(resp => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send(resp)
    }).catch(err => console.log(err))
})

app.get('single-blog', (req,res)=>{
    Blog.findById('')
    .then(resp => res.send(resp)).catch(err => console.log(err))
})

//routes
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



app.get('/',(req, res)=> {
   res.redirect('/blogs')
})
app.get('/blogs/:id',(req, res)=>{
    const id = req.params.id
    Blog.findById(id)
    .then(ress => {
        res.render('details', {blog:ress, title:'blog details', date})
    }).catch(err=> console.log(err))
})
app.get('/about',(req, res)=> {
    console.log(req.url, req.method)
    // res.sendFile(path.join(__dirname, 'view', 'about.html'))
    res.render('about', {title: 'About', date})
})
app.post('/blogs',(req, res)=>{
    const blog = new Blog(req.body)
    blog.save()
    .then(resp => {
        res.redirect('/blogs')
    }).catch(err=> console.log(err))
})



//blog routes
app.get('/blogs', (req, res)=>{
    Blog.find().sort({createdAt: -1})
    .then(blogs => {
        res.render('index', {title: 'All blogs', blogs, date})
    }).catch(err => console.log(err))
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

