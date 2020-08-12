const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/User')
const {sampleUserOne, sampleUserOneId, populateDatabase} = require('./fixtures/db')

beforeEach(populateDatabase)

test('Should signup a new user', async() => {
    const response = await request(app).post('/users').send({
        name: 'user_one_two',
        email: 'user_one_two@example.com',
        password: 'MyPass123!'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'user_one_two',
            email: 'user_one_two@example.com'
        },
        token: user.tokens[0].token
    })

    //Assert password is not being stored as plain text
    expect(user.password).not.toBe('MyPass123!')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: sampleUserOne.email,
        password: sampleUserOne.password
    }).expect(200)

    //Assert response token is the next stored token in database for existing user
    const user = await User.findById(sampleUserOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: sampleUserOne.email,
        password: ''
    }).expect(400)
})

test('Should get profile for existing user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${sampleUserOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for existing user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${sampleUserOne.tokens[0].token}`)
        .send()
        .expect(200)

    //Assert user document is not longer in database as expected
    const user = await User.findById(sampleUserOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${sampleUserOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(sampleUserOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${sampleUserOne.tokens[0].token}`)
        .send({
            name: 'user_one_two',
        })
        .expect(200)

    const user = await User.findById(sampleUserOneId)
    expect(user.name).toBe('user_one_two')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${sampleUserOne.tokens[0].token}`)
        .send({
            location: 'New City'
        })
        .expect(400)
})

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated