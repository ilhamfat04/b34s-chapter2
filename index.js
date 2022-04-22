// pemanggilan package express
const express = require('express')

// menggunakan package express
const app = express()

// atur template engine
app.set('view engine', 'hbs')

// gunakan static folder
app.use('/public', express.static(__dirname + '/public'))
// set body parser
app.use(express.urlencoded({ extended: false }))

// request = client -> server
// response = server -> client

const isLogin = false

// endpoint
app.get('/home', function (req, res) {
    res.render('index', { title: "My Web" })
})

app.get('/contact-me', function (req, res) {
    res.render('contact')
})

app.get('/blog', function (req, res) {
    res.render('blog', { isLogin })
})

app.get('/add-blog', function (req, res) {
    res.render('form-blog')
})

app.post('/blog', function (req, res) {
    let title = req.body.title
    let content = req.body.content

    console.log(`Data title : ${title}`);
    console.log(`Data content : ${content}`);

})

app.get('/blog/:id', function (req, res) {
    let id = req.params.id
    res.render('blog-detail', { dataId: id })
})

const port = 5000
app.listen(port, function () {
    console.log(`Server running on port : ${port}`);
})