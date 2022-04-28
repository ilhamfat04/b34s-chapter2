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
    let query = `SELECT * FROM tb_blog ORDER BY id DESC`

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

    let blog = {
        title: title,
        content: content,
        image: 'image.png'
    }

    db.connect((err, client, done) => {
        if (err) throw err

        let query = `INSERT INTO tb_blog(title, content, image) VALUES
                        ('${blog.title}','${blog.content}','${blog.image}')`
        client.query(query, (err, result) => {
            done()
            if (err) throw err

            res.redirect('/blog')
        })
    })
})

app.get('/delete-blog/:id', function (req, res) {
    let id = req.params.id

    if (!isLogin) {
        return res.redirect('/blog')
    }

    db.connect((err, client, done) => {
        if (err) throw err

        let query = `DELETE FROM tb_blog WHERE id=${id}`

        client.query(query, (err, result) => {
            done()
            if (err) throw err

            res.redirect('/blog')
        })
    })
})

app.get('/edit-blog/:id', function (req, res) {
    let id = req.params.id

    console.log(id)

    db.connect((err, client, done) => {
        if (err) throw err

        let query = `SELECT * FROM tb_blog WHERE id=${id}`
        client.query(query, (err, result) => {
            done()
            if (err) throw err

            result = result.rows[0]
            res.render('edit-blog', { blog: result })
        })
    })

})

app.post('/edit-blog/:id', function (req, res) {
    let id = req.params.id

    let title = req.body.title
    let content = req.body.content

    db.connect((err, client, done) => {
        if (err) throw err

        let query = `UPDATE tb_blog SET title='${title}', content='${content}' WHERE id=${id}`

        client.query(query, (err, result) => {
            done()
            if (err) throw err

            res.redirect('/blog')
        })
    })
})

app.get('/blog/:id', function (req, res) {
    let id = req.params.id

    db.connect((err, client, done) => {
        if (err) throw err

        let query = `SELECT * FROM tb_blog WHERE id=${id}`
        client.query(query, (err, result) => {
            done()
            if (err) throw err

            result = result.rows[0]
            console.log(result);
            res.render('blog-detail', { blog: result })
        })
    })
})

const port = 5000
app.listen(port, function () {
    console.log(`Server running on port : ${port}`);
})

function getFullTime(time) {
    // merubah format waktu -> butuh waktu yang akan diubah
    // console.log(time)

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