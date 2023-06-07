const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/', userController.createUser)
router.post('/login', userController.loginUser)
router.put('/:id', userController.updateUser)
router.post('/logout', userController.logoutUser)
router.delete('/:id', userController.auth, userController.deleteUser)

module.exports = router