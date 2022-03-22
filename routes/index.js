const express = require('express')
const { ensureGuest, ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')

const router = express.Router()

/**
 * @desc Show landing and login page
 * @route GET /
 * @access Public  
 */
router.get('/', ensureGuest, (req, res) => {
    // res.send('Login')
    ////////////////////
    /* render(<view_name>) */
    res.render('login', {
        layout: 'loginLanding',
    })
})

/**
 * @desc Get logged in user's stories
 * @route GET /dashboard
 * @access Private
 */
router.get('/dashboard', ensureAuth, async (req, res) => {
    // res.send('Dashboard')
    ///////////////////////////
    // Check Logged In
    // console.log(req.user)
    // console.log(req.session)
    ///////////////////////////
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (error) {
        // console.log(error)
        res.render('error/500')
    }
})

module.exports = router
