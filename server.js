const express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    GitHubStrategy = require("passport-github").Strategy,
    session = require("express-session"),
    flash = require("connect-flash"),
    cors = require("cors"),
    path = require("path"),
    app = express(),
    port = process.env.PORT || 3000

require("dotenv").config()

// MongoDB connection
mongoose.connect("mongodb+srv://mnorton2:V2HScJ3DrPsgJUlH@cs4241.hohzt.mongodb.net/a4DB?retryWrites=true&w=majority&appName=cs4241")
    .then(() => {
        console.log(`MongoDB connected to ${mongoose.connection.name}`)
    })
    .catch(err => {
        console.log("MongoDB connection error:", err)
    })

// Middleware
app.use(cors({ origin: 'https://a4-maeve-norton.glitch.me', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())


const userSchema = new mongoose.Schema({
    username: String,
    githubId: String
})

const User = mongoose.model("User", userSchema)



// Passport GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GitHubClientID,
    clientSecret: process.env.GitHubClientSecret,
    callbackURL: "https://a4-maeve-norton.glitch.me/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id })

        if (!user) {
            user = new User({
                githubId: profile.id,
                username: profile.username,
            })
            await user.save()
        }

        return done(null, user)
    } catch (err) {
        return done(err)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (err) {
        done(err, null)
    }
})


// Authenticate
app.get('/auth/github', passport.authenticate('github'))


app.get('/auth/github/callback',
    passport.authenticate('github', {
        successRedirect: '/ski-run-form',
        failureRedirect: '/',
    })
)

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out')
        }
        res.redirect('/login')
    })
})

//-------------------------------------------------------------------------------------------------------------------------------------------------

const skiRunSchema = new mongoose.Schema({
    trailName: String,
    difficulty: String,
    location: String,
    dateOfRun: String,
    rating: Number,
    numberOfRuns: Number,
    skiSeason: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

const skiRun = mongoose.model("SkiRun", skiRunSchema)

app.get("/auth/check", (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ status: "ok" })
    } else {
        return res.json({ status: "not_authenticated" })
    }
})


app.get("/skiRuns", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send("Not authenticated")
    }

    try {
        const skiRuns = await skiRun.find({ user: req.user.id })
        res.status(200).json(skiRuns)
    } catch (err) {
        res.status(500).send("Error fetching ski runs: " + err)
    }
})


app.post("/add", async (req, res) => {
    const skiData = req.body

    skiData.user = req.user.id

    // Calculate the ski season based on the date of the run
    function skiSeason(dateOfRun) {
        const date = new Date(dateOfRun)
        const month = date.getMonth() + 1

        if (month >= 11 && month <= 12) {
            return "Early Season"
        } else if (month >= 1 && month <= 2) {
            return "Peak Season"
        } else {
            return "Late Season"
        }
    }

    skiData.skiSeason = skiSeason(skiData.dateOfRun)

    try {
        const newSkiRun = new skiRun(skiData)
        await newSkiRun.save()
        res.status(200).json(newSkiRun)
    } catch (err) {
        res.status(500).send("Error adding ski run: " + err)
    }
})

// Update ski run
app.put("/update/:id", async (req, res) => {
    const id = req.params.id,
        updateData = req.body

    try {
        const updatedSkiRun = await skiRun.findByIdAndUpdate(id, updateData, { new: true })
        if (updatedSkiRun) {
            res.status(200).json(updatedSkiRun)
        } else {
            res.status(404).send("404 Error: File Not Found")
        }
    } catch (err) {
        res.status(500).send("Error updating ski run: " + err)
    }
})

// Delete ski run
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id

    try {
        const deletedSkiRun = await skiRun.findByIdAndDelete(id)
        if (deletedSkiRun) {
            res.status(200).json(deletedSkiRun)
        } else {
            res.status(404).send("404 Error: File Not Found")
        }
    } catch (err) {
        res.status(500).send("Error deleting ski run: " + err)
    }
})


app.use(express.static(path.join(__dirname, 'client','dist')))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
