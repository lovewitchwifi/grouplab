const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const server = app.listen(8080, () => console.log('testing on PORT 8080'))
const User = require('../models/user')
let mongoServer  

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
    await mongoose.connection.close()
    mongoServer.stop()
    server.close()
})

afterAll((done) => done())

describe('Test the users endpoints', () => {
    test('it should create a new user', async () => {
        const response = await request(app)
        .post('/users')
        .send({ name: 'Casper the Ghost', email: 'casper@gmail.com', password: 'pizza'} )

        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toEqual('Casper the Ghost')
        expect(response.body.user.email).toEqual('casper@gmail.com')
        expect(response.body).toHaveProperty('token')
    })

    test('It should log in a user', async () => {
        const user = new User ({ name: 'Casper the Ghost', email: 'casper@gmail.com', password: 'pizza'} )
        await user.save()

        const response = await request(app)
        .post('/users/login')
        .send({ email: 'casper@gmail.com', password: 'pizza'} )

        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toEqual('Casper the Ghost')
        expect(response.body.user.email).toEqual('casper@gmail.com')
        expect(response.body).toHaveProperty('token')
    })

    test('It should update a user', async () => {
        const user = new User ({ name: 'Casper the Ghost', email: 'casper@gmail.com', password: 'pizza'} )
        await user.save()

        const token = await user.generateAuthToken()

        const response = await request(app)
        .put(`/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Frankenstein', email: 'frank@gmail.com'})

        expect(response.statusCode).toBe(200)
        expect(response.body.name).toEqual('Frankenstein')
        expect(response.body.email).toEqual('frank@gmail.com')
    })

    /**************************check with group on this code block**************************/
    test('It should log out a user', async () => {
        const user = new User({ name: 'Casper the Ghost', email: 'casper@gmail.com', password: 'pizza' });
        await user.save();

        const token = await user.generateAuthToken()

        const logoutResponse = await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer ${token}`);

        expect(logoutResponse.statusCode).toBe(200);
        expect(logoutResponse.body.message).toEqual('User logged out successfully');
    })

    test('It should delete a user', async () => {
        const user  = new User ({ name: 'Casper the Ghost', email: 'casper@gmail.com', password: 'pizza'})
        await user.save()

        const token = await user.generateAuthToken()
        
        const response = await request(app)
        .delete(`/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('User deleted')
    })
})