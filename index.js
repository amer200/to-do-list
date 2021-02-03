const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");
mongoose.connect("mongodb://localhost:27017/todolistDB");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// item sechima
const itemSchema = {
  name: String
};
// item modell
const Items = mongoose.model("Item", itemSchema);

const item1 = new Items ({
  name: "item1"
});
const item2 = new Items ({
  name: "item2"
});
const item3 = new Items ({
  name: "item3"
});
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
}
const List = mongoose.model("List", listSchema);
app.get("/", function(req, res){
  Items.find({}, function(err, foundItems){
    if(foundItems.length ===0) {
      Items.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }
      })
      res.redirect("/");
    }else{
      res.render("list", { listTitle: "main", newItems: foundItems });
    }
  })
});
app.post("/delete", function(req, res){
  var item = req.body.item,
      ditem = req.body.listName;
      if(ditem === "Today"){
      Items.findByIdAndRemove(item, function(err){
          console.log("d = ok");
          res.redirect("/");
        });
    }else{
      List.findOneAndUpdate({name: ditem}, {$pull: {items: {_id: item}}}, function(err,foundlist){
        if(!err){
          res.redirect("/" + ditem);
        }
      });
    }
});
app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName}, function(err, foundlist){
    if(!err){
    if(!foundlist){
      const list = new List ({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/" + customListName);
    }else{
      res.render("list", { listTitle: foundlist.name, newItems: foundlist.items });
    }
  }
});
});
app.post("/",function(req, res){
  var itemName = req.body.newItem,
      listName = req.body.list;
  const item = new Items({
    name: itemName
  });
  if(listName === "main"){
    item.save();
    res.redirect("/")
  }else{
    List.findOne({name: listName}, function(err, foundlist){
      foundlist.items.push(item);
      foundlist.save()
      res.redirect("/" + listName);
    });
  }
})
app.listen(3000, function(){
  console.log("ok");
})
