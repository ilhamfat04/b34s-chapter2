// pemanggilan package express
const express = require('express')

// import db connection
const db = require('./connection/db')

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

const month = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
]

const isLogin = true

// endpoint
app.get('/', function (req, res) {
    res.render('index', { title: "My Web" })
})

app.get('/contact-me', function (req, res) {
    res.render('contact')
})

app.get('/blog', function (req, res) {
    let query = `SELECT * FROM tb_blog;`

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, result) => {
            done()

            if (err) throw err

            let data = result.rows

            data = data.map((blog) => {
                return {
                    ...blog,
                    posted_at: getFullTime(blog.posted_at),
                    isLogin: isLogin
                }
            })

            res.render('blog', { isLogin: isLogin, blog: data })
        })
    })
})

app.get('/add-blog', function (req, res) {
    res.render('form-blog')
})

app.post('/blog', function (req, res) {
    let title = req.body.title
    let content = req.body.content
    let date = new Date()

    let blog = {
        title: title,
        content: content,
        author: "Ichsan Emrald Alamsyah",
        posted_at: getFullTime(date)
    }

    blogs.push(blog)

    res.redirect('/blog')
})

app.get('/delete-blog/:id', function (req, res) {
    let id = req.params.id

    if (!isLogin) {
        return res.redirect('/blog')
    }

    blogs.splice(id, 1)

    res.redirect('/blog')


})

app.get('/edit-blog/:id', function (req, res) {
    let id = req.params.id

    let blog = blogs[id]
    console.log(blog);

    res.render('edit-blog', { dataId: id, blog })
})

app.get('/blog/:id', function (req, res) {
    let id = req.params.id
    res.render('blog-detail', { dataId: id })
})

const port = 5000
app.listen(port, function () {
    console.log(`Server running on port : ${port}`);
})

function getFullTime(time) {
    // merubah format waktu -> butuh waktu yang akan diubah
    console.log(time)

    const date = time.getDate()
    const monthIndex = time.getMonth()
    const year = time.getFullYear()

    const hour = time.getHours()
    let minute = time.getMinutes()

    if (minute < 10) {
        minute = '0' + minute
    }

    return `${date} ${month[monthIndex]} ${year} ${hour}:${minute} WIB `
}