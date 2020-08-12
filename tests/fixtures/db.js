const jwt = require('jsonwebtoken')
const moogoose = require('mongoose')
const User = require('../../src/models/User')
const Task = require('../../src/models/Task')

const sampleUserOneId = new moogoose.Types.ObjectId()
const sampleUserOne = {
    _id: sampleUserOneId,
    name: 'user_one',
    email: 'user_one@example.com',
    password: 'MyPass123!',
    tokens: [{
        token: jwt.sign({ _id: sampleUserOneId }, process.env.JWT_SECRET)
    }]
}

const sampleUserTwoId = new moogoose.Types.ObjectId()
const sampleUserTwo = {
    _id: sampleUserTwoId,
    name: 'user_two',
    email: 'user_two@example.com',
    password: 'YourPass123?',
    tokens: [{
        token: jwt.sign({ _id: sampleUserTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new moogoose.Types.ObjectId(),
    description: 'First Task',
    completed: false,
    owner: sampleUserOneId
}

const taskTwo = {
    _id: new moogoose.Types.ObjectId(),
    description: 'Second Task',
    completed: true,
    owner: sampleUserOneId
}

const taskThree = {
    _id: new moogoose.Types.ObjectId(),
    description: 'Third Task',
    completed: false,
    owner: sampleUserTwoId
}

const populateDatabase = async () => {
    await User.deleteMany()
    await new User(sampleUserOne).save()
    await new User(sampleUserTwo).save()

    await Task.deleteMany()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    sampleUserOneId,
    sampleUserOne,
    populateDatabase,
    sampleUserTwoId,
    sampleUserTwo,
    taskOne,
    taskTwo,
    taskThree
}