var app, express, forum, store;

express = require("express");

forum = require("./routes/forum");

app = module.exports = express.createServer();

io = require('socket.io').listen(app);

app.configure(function() {
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "me"
  }));
  app.use(require("stylus").middleware({
    src: __dirname + "/public"
  }));
  app.use(app.router);
  return app.use(express["static"](__dirname + "/public"));
});

app.configure("development", function() {
  return app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure("production", function() {
  return app.use(express.errorHandler());
});

var sk;
io.sockets.on('connection', function (socket) {sk=socket;});

app.get("/", forum.latest);

app.post("/login", forum.home_post_handler);

app.get("/login", forum.home);


/*
* @Todo handle signups
app.get("/signup", forum.signup); 
app.post("/signup", forum.signup_post_handler);
*/

app.get("/latest", forum.latest);

app.get("/topic/:id",function  (req,res) {req.sockes=sk;forum.thread(req,res);});

app.post("/topic/:id",function  (req,res) {
      req.sockes=sk;
      forum.thread_post(req,res);
});

app.get('/category',forum.category)

app.get('/category/:id',forum.category_details);

app.get("/user/:id", forum.user_profile);

app.get("/page", forum.page);

app.get("/logout", forum.logout);

app.listen(4000);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);