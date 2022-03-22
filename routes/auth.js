const express = require('express')
const passport = require('passport')


const router = express.Router()

/**
 * @desc Authentication with Google
 * @route GET /auth/google
 * @access Public
 */
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

/**
 * @desc Callback from Google Authentication
 * @route GET /auth/google/callback
 * @access Private
 */
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/dashboard')
    }
)

/**
 * @desc Log out
 * @route Post /auth/logout
 * @access Private
 */
router.get('/logout', (req, res) => {
        // Passport Logout
        req.logout()
        // Session Destroy
        req.session.destroy()
        ///////////////////////////
        // Check Logged Out
        // console.log(req.user)
        // console.log(req.session)
        ///////////////////////////
        res.redirect('/')
    }
)

module.exports = router