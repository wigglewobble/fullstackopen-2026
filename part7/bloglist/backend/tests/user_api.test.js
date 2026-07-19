const { test, beforeEach,after, describe}=require('node:test')
const assert=require('node:assert')
const bcrypt=require('bcrypt')
const supertest=require('supertest')
const mongoose=require('mongoose')
const app=require('../app')
const User=require('../models/user')
const Blog=require('../models/blog')
const helper=require('./test_helper')
const api=supertest(app)
beforeEach(async()=>{
    await Blog.deleteMany({})
    await User.deleteMany({})
    const passwordHash=await bcrypt.hash('sekret',10)
    const user=new User({
        username:'root',
        name:'Superuser',
        passwordHash,
    })
    await user.save()
    await Blog.insertMany(helper.initialBlogs)
})
describe('user creation',()=>{
    test('succeeds with a fresh username',async()=>{
        const usersAtStart=await User.find({})
        const newUser={
            username:'boss',
            name: 'Boss',
            password: 'secret123',
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
        const usersAtEnd=await User.find({})
        assert.strictEqual(
            usersAtEnd.length,
            usersAtStart.length+1
        )
    })
    test('fails if username already exists',async()=>{
        const newUser={
            username:'root',
            name:'Duplicate',
            password:'secret123',
        }
        const result=await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        assert(
            result.body.error.includes(
                'expected username to be unique'
            )
        )
    })
    test('fails if password is too short',async()=>{
        const newUser={
            username: 'tiny',
            name: 'Tiny',
            password: '12',
        }
        const result=await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        console.log(result.body)
        assert(
            result.body.error.includes(
                'password must be at least 3 characters long'
            )
        )
    })
})
after(async()=>{
    await mongoose.connection.close()
})