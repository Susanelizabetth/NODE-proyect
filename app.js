var express = require("express")
var bodyParser = require("body-parser")
var User = require('./models/user').User
var app = express()
var cookiesSession = require("cookie-session")
var router_app = require("./routes_app")
var session_middleware = require("./middlewares/session")
var formidable = require("express-formidable")

var methodOverride = require("method-override")
app.use(express.static('public')) 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(methodOverride("_method"))

app.use(cookiesSession({
    name: "session",
    keys: ["llave-1","llave-2"]
}))

app.use(formidable({keepExtensions: true, uploadDir: true}))

app.set("view engine","jade")

app.get("/",function(req,res){
    console.log(req.session.user_id)
    res.render("index")
})

app.get("/signup",function(req,res){
    User.find(function(err,doc){
        console.log(doc)
        res.render("signup")
    }) 
})

app.get("/login",function(req,res){
    res.render("login")
})

app.post("/user",function(req,res){
    var user = new User({email: req.body.email,
                        password: req.body.password,
                        password_confirmation: req.body.password_confirmation,
                        username: req.body.username
                        })
    user.save().then(function(us){
        res.send('Guardamos el usuario exitosamente')
    },function(err){
        console.log(String(err))
        res.send('Hubo un error al guardar los datos')
    })

})

app.post("/sessions",function(req,res){
    console.log("ESTOY AUI EN SESSIONS *********************************")
    User.findOne({
        email: req.body.email,
        password:req.body.password
    },function(err,user){
        req.session.user_id = user._id
        res.redirect("/app")
    })

})

app.use("/app",session_middleware)
app.use("/app",router_app)
app.listen(3000)