const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
const path = require('path')
/*****************************************/ 
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')
/*****************************************/
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


//////////////////////////////////////////////////////////////////////////
// Load Config
dotenv.config({ path: './config/config.env' })

/***************************************/ 
// Passport Config
require('./config/passport')(passport)
/***************************************/ 

// Connect DB
const connectDB = require('./config/db')
connectDB()

//////////////////////////////////////////////////////////////////////////
const app = express()

// Logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

/*****************************************/
// Sessions for Persistent Login
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }, // For HTTPS
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }) // Sessions Connect to MongoDB
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

/*****************************************/
// Handlebars Template Engine
app.engine('handlebars', engine({ 
    defaultLayout: 'main', 
    extname: '.handlebars',
    helpers: require('./helpers/handlebars')
}))
app.set('view engine', 'handlebars')
app.set('views', './views')

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method Override
app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method
        delete req.body._method
        return method
    }
}))

//////////////////////////////////////////////////////////////////////////
// Set 'user' as Global Variable
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


//////////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`App running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})