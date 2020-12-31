const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var newItems = [];
app.get("/", function(req, res){
  var today = new Date(),
      options ={
        weekday: "long",
        day: "numeric",
        month: "long"
      },
      day = today.toLocaleDateString("en-US", options);
      res.render("list", { day: day, newItems: newItems });
});
app.post("/",function(req, res){
  var newItem = req.body.newItem;
  newItems.push(newItem)
  res.redirect("/");
})
app.listen(3000, function(){
  console.log("ok");
})
