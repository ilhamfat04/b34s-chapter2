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

const blogs = [
    {
        title: 'Pasar Coding di Indonesia Dinilai Masih Menjanjikan',
        content: 'Ketimpangan sumber daya manusia (SDM) di sektor digital masih menjadi isu yang belum terpecahkan. Berdasarkan penelitian ManpowerGroup, ketimpangan SDM global, termasuk Indonesia, meningkat dua kali lipat dalam satu dekade terakhir. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam, molestiae numquam! Deleniti maiores expedita eaque deserunt quaerat! Dicta, eligendi debitis?',
        author: 'Ichsan Emrald Alamsyah',
        posted_at: '25 April 2022 9:30 WIB'
    }
]

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

const isLogin = false

// endpoint
app.get('/', function (req, res) {
    res.render('index', { title: "My Web" })
})

app.get('/contact-me', function (req, res) {
    res.render('contact')
})

app.get('/blog', function (req, res) {
    // console.log(blogs);

    // map = akses indeks array
    // spread opr = memanipulasi object setiap indeks
    let dataBlogs = blogs.map(function (data) {
        // console.log(data);
        return {
            ...data,
            isLogin: isLogin
        }
    })

    // console.log(dataBlogs);
    res.render('blog', { isLogin: isLogin, blog: dataBlogs })
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