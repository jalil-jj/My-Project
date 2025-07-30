const Validator = require('fastest-validator')

const v = new Validator()

const schema = {
    name: { type: "string", min: 8, max: 20 },
    username: { type: "string", min: 8, max: 20 },
    email: { type: "email", min: 8, max: 20 },
    phone: { type: "string", max : 11 },
    password: { type: "string", min: 8, max: 20 },
    confirmPassword: { type: "equal", field: 'password' },
    $$strict: true
}

const chech = v.compile(schema)

module.exports = chech