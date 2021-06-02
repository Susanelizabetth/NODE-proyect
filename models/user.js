var mongoose = require("mongoose")
var Schema = mongoose.Schema

mongoose.Promise = global.Promise

mongoose.connect("mongodb://localhost:27017/fotos" ,{ useMongoClient: true })
    .then(()=>{console.log("EXITOSO")}).catch(err =>console.log(err))

var posibles_valores =  ['M','F']
var email_match = [/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,'Coloca un email valido']

var user_schema = new Schema({
    name: String, 
    lastname: String, 
    username: {
        type: String,
        required: true,
        maxlength: [50,'User muy largo' ]
    },
    password: {
        type: String,
        minlength: [8,'PW muy corto'],
        validate: {
            validator: function(p){
               return this.password_confirmation == p
            },
            message: 'No son iguales'
        }
    },
    age: {
        type:Number,
        min: [5,'No puede ser menor de 5'],
        max: [100,'No puede ser mayor de 100'
    ]},
    email: {
        type: String, 
        required: "***",
        match: email_match 
    },
    date_of_birth: Date,
    sex: {
        type: String,
        enum: {
            values: posibles_valores,
            message: 'Opción no valida'
        }
    }
})

user_schema.virtual("password_confirmation").get(function(){
    return this.p_c
}).set (function(password){
    this.p_c = password
})

var User = mongoose.model('User', user_schema)

module.exports.User = User