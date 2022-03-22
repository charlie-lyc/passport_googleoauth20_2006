// Passport Middleware
module.exports = {
    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard')
        }
        next()
    },
    ensureAuth: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/') 
        }
        next()
    },
}