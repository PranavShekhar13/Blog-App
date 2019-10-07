var express           = require("express"),
    methodOverride    = require("method-override"),
    expressSantizer   = require("express-sanitizer"),
    mongoose          = require("mongoose"),
    bodyParser        = require("body-parser"),
    app               = express();

mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify:false});

app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSantizer());
app.use(methodOverride("_method"));


//Schema Setup

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    desc: String,
    created:{type:Date, default:Date.now}
});

var Blog= mongoose.model("Blog", blogSchema);

/*Comment Out From Here*/Blog.create({
    title:"Test Blog- Read More",
    image:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    desc: "This is test blog for basic content of this page, Comment it out the next time you load the server again, otherwise it will be added again to the database"
},
function(err,blog){
    if(err){
        console.log(err);
    }
    else{
        console.log(blog);
    }
}

); /* Comment out till Here*/


//Home Route redirects back to the Index Page
app.get("/", function(req,res){

    res.redirect("/blogs");

});

//Displays all the blogs on the Index Page
app.get("/blogs",function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {blogs: blogs});
        }
    });
});


//Creates and Posts New Blog on the Index Page after taking input from the Form
app.post("/blogs", function(req,res){

    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err,newBlog){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        }
    });
});

//Renders The Form Page to Create new Blog
app.get("/blogs/new",function(req,res){

    res.render("new");
});


//Renders the More Info Page about a Blog on Clicking
app.get("/blogs/:id", function(req,res){

    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    });
});

//Edit Route- Combination of the form and Create
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    });
});



//Update Route

app.put("/blogs/:id",function(req,res){

    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }

    });
});
//DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
    console.log(req.body.blog);
    Blog.findByIdAndRemove(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(blog);
            res.redirect("/blogs");
        }
    });
});


app.listen(3000,()=>{
    console.log("Blog App Serving at Port 3000 !");
}); 