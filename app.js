var express     = require("express");
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var app         = express();
var methodOverride  =require("method-override");
var expressSanitizer    =require("express-sanitizer");

mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine","ejs");;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema= mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
});

//var Blog= mongoose.model("Blog",blogSchema);
var Blog= mongoose.model("Blog",blogSchema);


app.get("/",function(req,res){
    res.redirect("/blogs");
});


app.post("/blogs",function(req,res){
    req.body.blog.body= req.sanitize(req.body.blog.body);  //sanitizer removes all scripts from body and leave html
   Blog.create(req.body.blog,function(err,newblog){
       if(err)
          res.redirect("/blogs");
       else
          res.redirect("/blogs");
       });
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
        
});

app.get("/blogs/new",function(req,res){
            res.render("new");
});


app.get("/blogs/:id",function(req,res){
       Blog.findById(req.params.id,function(err,blog){
           if(err)
                console.log(err);
            else{
                //console.log(blog);
                res.render("show",{blog:blog});
            }
       });
});




app.put("/blogs/:id",function(req,res){
    
     req.body.blog.body= req.sanitize(req.body.blog.body);  //sanitizer removes all scripts from body and leave html

    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
       if(err){
           console.log(err);
       }else{
          // console.log(blog);
           res.redirect("/blogs/"+req.params.id);
       }
    });
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log(err);
        }else{
            //console.log(blog);
             res.render("edit",{blog:blog});
        }
    });
   
});



app.get("/blogs",function(req,res){
    
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Error finding Blogs!");
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

app.listen(3001,function(){
    console.log("Blog server has started!") 
});