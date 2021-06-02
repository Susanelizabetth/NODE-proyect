var express = require("express")
var Imagen = require("./models/imagenes")
var router = express.Router()
var fs = require("fs")

var findImage = require("./middlewares/find_image")

router.get("/",function(req,res){
    res.render("app/home")
})

router.get("/imagenes/new",function(req,res){
    res.render("app/imagenes/new")
})

router.all("/imagenes/:id*",findImage)

router.get("/imagenes/:id/edit",function(req,res){
    res.render("app/imagenes/edit")
})

router.route("/imagenes/:id")
    .get(function (req, res) {
        res.render("app/imagenes/show")
    })
    .put(function(req, res) {
        res.locals.imagen.title = req.body.title
        res.locals.imagen.save(function(err){
            if(!err){
                res.render("app/imagenes/show")
            }else{
                res.render("app/imagenes/"+req.params.id+"/edit")
            }
        })
    })
    .delete(function(req, res) {
        //ELIMINAR LAS IMAGENES 
        Imagen.findByIdAndRemove({_id: req.params.id},function(err){
            if (!err) {
                res.redirect("app/imagenes")
            } else {
                console.log(err)
                res.redirect("app/imagenes"+req.params.id)
            }
        })
    })

router.route("/imagenes")
    .get(function (req, res) {
        Imagen.find({creator: res.locals.user._id},function(err,imagenes){
            if (err) {
                res.redirect("/app");return
            } 
            res.render("app/imagenes/index",{imagenes: imagenes})
        })
    })
    .post(function(req, res) {
        console.log("YO SOY ARVIVO ============="+req.files.archivo.path.toString())
        var extension = req.files.archivo.name.split(".").pop()
        var pathArchivo = req.files.archivo.path
        var data = {
            title: req.body.title,
            creator: res.locals.user._id,
            extension: extension
        }
        var imagen = new Imagen(data)
        fs.rename(pathArchivo,"public/imagenes"+imagen._id+"."+extension)
        imagen.save(function(err){
            if(!err){
                console.log("AQUI********************************")
                res.redirect("/app/imagenes/"+imagen._id)
            }
            else{
                res.render(err)
            }
        })
    })

module.exports = router
