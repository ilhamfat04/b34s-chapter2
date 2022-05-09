// pemanggilan package express
const express = require('express')
const { redirect } = require('express/lib/response')

// import package bcrypt
const bcrypt = require('bcrypt');

// import package express-session and express-flash
const flash = require('express-flash')
const session = require('express-session')

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

// use express-flash
app.use(flash())

// setup session middleware
app.use(
    session({
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 2
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    })
)

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


// endpoint
app.get('/', function (req, res) {
    res.render('index', {
        title: "My Web",
        isLogin: req.session.isLogin,
        user: req.session.user
    })
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
                    isLogin: req.session.isLogin
                }
            })

            res.render('blog', {
                isLogin: req.session.isLogin,
                user: req.session.user,
                blog: data
            })
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

app.get('/register', function (req, res) {
    res.render('register')
})

app.post('/register', function (req, res) {
    // const name = req.body.name
    // const email = req.body.email
    // const password = req.body.password

    const { name, email, password } = req.body

    const hash = bcrypt.hashSync(password, 10);

    db.connect((err, client, done) => {
        if (err) throw err

        let query = `INSERT INTO tb_user(name, email, password) 
                        VALUES('${name}','${email}','${hash}')`

        client.query(query, (err, result) => {
            done()
            if (err) throw err

            req.flash('success', 'Your account successfully registered')
            res.redirect('/login')
        })
    })
})

app.get('/login', function (req, res) {
    res.render('login')
})

app.post('/login', function (req, res) {
    const { email, password } = req.body

    db.connect((err, client, done) => {
        if (err) throw err

        let query = `SELECT * FROM tb_user WHERE email='${email}'`

        client.query(query, (err, result) => {
            done()
            if (err) throw err

            if (result.rowCount == 0) {
                req.flash('danger', 'account not found')
                return res.redirect('/login')
            }

            let isMatch = bcrypt.compareSync(password, result.rows[0].password);

            if (isMatch) {
                req.session.isLogin = true
                req.session.user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email,
                }

                req.flash('success', 'Login success')
                res.redirect('/blog')
            } else {
                req.flash('danger', 'Password doesnt match with your account')
                res.redirect('/login')
            }
        })
    })
})

app.get('/logout', function (req, res) {
    req.session.destroy()
    res.redirect('/')
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