const express = require('express')
const router = express.Router()

const userController = require('../Controllers/users')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/:id', userController.getUser);

module.exports = router
       