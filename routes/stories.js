const express = require('express')
const { redirect } = require('express/lib/response')
const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')


const router = express.Router()

/**
 * @desc Show all stories
 * @route GET /stories
 * @access Private
 */
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('stories/index',{
            // user: req.user, // Set 'user' out of 'index.handlebars'
            stories 
        })
    } catch (error) {
        // console.log(error)
        res.render('error/500')
    }
})

/**
 * @desc Show add form page
 * @route GET /stories/add
 * @access Private
 */
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

/**
 * @desc Add story
 * @route POST /stories
 * @access Private
 */
router.post('/', ensureAuth, async (req, res) => {
    try {
        // console.log(req.user.id)
        // console.log(req.user._id)
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        // console.log(error)
        res.render('error/500')
    }
})

/**
 * @desc Get single story
 * @route GET /stories/:id
 * @access Private
 */
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const foundStory = await Story.findById(req.params.id)
            .populate('user')
            .lean()
        if (!foundStory) {
            res.render('error/404')
        } else {
            res.render('stories/read', { story: foundStory })
        }
    } catch (error) {
        // console.log(error)
        res.render('error/500')
    }
})

/**
 * @desc Get specific user's stories
 * @route GET /stories/user/:id
 * @access Private
 */
router.get('/user/:id', ensureAuth, async (req, res) => {
    try {
        const foundStories = await Story.find({
                user: req.params.id,
                status: 'public'
            }).populate('user')
            .lean()
        if (!foundStories) {
            res.render('error/404')
        } else {
            res.render('stories/index', { stories: foundStories })
        }
    } catch (error) {
        // console.log(error)
        res.render('error/500')
    }
})

/**
 * @desc Show edit form page
 * @route GET /stories/edit/:id
 * @access Private
 */
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const foundStory = await Story.findById(req.params.id).lean()
        if (!foundStory) {
            return res.render('error/404')
        }
        // console.log(foundStory.user.id)
        // console.log(foundStory.user._id)
        if (foundStory.user.toString() !== req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', { story: foundStory })
        }
    } catch (error) {
        // console.log(error)
        res.render('error/500')
    }
})

/**
 * @desc Edit story
 * @route PUT /stories/:id
 * @access Private
 */
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        const foundStory = await Story.findById(req.params.id).lean()
        if (!foundStory) {
            return res.render('error/404')
        }
        if (foundStory.user.toString() !== req.user.id) {
            res.redirect('/stories')
        } else {
            await Story.findOneAndUpdate({
                    _id: req.params.id,
                    user: req.user.id
                },{
                    title: req.body.title,
                    body: req.body.body,
                    status: req.body.status,
                    user: foundStory.user,
                    createdAt: foundStory.createdAt
                }, {
                    new: true,
                    runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch (error) {
        // console.log(error)
        res.render('error/500')
    }
})

/**
 * @desc Delete story
 * @route DELETE /stories/:id
 * @access Private
 */
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        const foundStory = await Story.findById(req.params.id).lean()
        if (!foundStory) {
            res.render('error/404')
        }
        if (foundStory.user.toString() !== req.user.id) {
            res.redirect('/stories')
        } else {
            await Story.findOneAndDelete({
                _id: req.params.id,
                user: req.user.id
            })
            res.redirect('/dashboard')
        }
    } catch (error) {
        // console.log(error)
        res.render('error/500')
    }
})

module.exports = router