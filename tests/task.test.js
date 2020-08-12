const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/Task')
const {
    sampleUserOne,
    sampleUserOneId,
    populateDatabase,
    sampleUserTwo,
    taskOne
} = require('./fixtures/db')

beforeEach(populateDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${sampleUserOne.tokens[0].token}`)
        .send({
            description: 'Sample Task 1'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should provide all tasks for sample user one', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${sampleUserOne.tokens[0].token}`)
        .send()
        .expect(202)

    expect(response.body.length).toBe(2)
})

test('Should not allow second sample user to delete a task they do not own', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${sampleUserTwo.tokens[0].token}`)
        .send()
        .expect(404)
    
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks