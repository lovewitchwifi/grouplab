const express = require('express')
const morgan = require('morgan')
//const router = express.Router()
const userRoutes = require('./routes/userRoutes')
const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(morgan('combined'))
app.use('/users', userRoutes)

// router.post('/', userController.createUser)
// router.post('/login', userController.loginUser)
// router.put('/:id', userController.updateUser)
// router.post('/logout', userController.logoutUser)
// router.delete('/:id', userController.auth, userController.deleteUser)

module.exports = app