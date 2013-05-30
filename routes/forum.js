var moment = require('moment');
var mysql = require("mysql");
var async = require('async');

var settings = {
  name: 'NodeBB',
  url: '',
  other: ''
};
   // host : 'localhost',
   // user: "asdqweasd",
   // password: "asdqweasd",
   // database: "dd6487cfdea52413ba1d2a6336dc9161f"

var Schema = require('jugglingdb').Schema;
var schema = new Schema('mysql', {
  database: 'forum',
  username: 'root'
});

var User = schema.define('user', {
  id: String,
  first_name: String,
  last_name: String,
  created_at: Date,
  status: Number,
  post_count: Number,
  thread_count: Number,
  email: String,
  about: String,
  password: String,
  nick_name: String,
  gender: String,
  username: String
});

var Topics = schema.define('topics', {
  id: String,
  topic: String,
  url_slag: String,
  description: String,
  category: String,
  post: Number,
  views: Number,
  likes: Number,
  created_at: String,
  updated_at: String
});

var Comments = schema.define('comments', {
  id: String,
  username: String,
  comment: String,
  likes: Number,
  created_at: String,
  topic_id: Number
});

var Likes = schema.define('likes', {
  id: String,
  post: Number,
  like_id: Number,
  user_id: String,
  created_at: String
});

var Category = schema.define('category',{
  id:String,
  created_at:String,
  updated_at:String,
  name:String,
  url_slag:String

});




var logerr="";


exports.logout = function(req, res) {
    logerr="";
    delete req.session.username;
    res.redirect('/');
};

exports.home_post_handler = function(req, res) {

    // Check the  wheather the username and password is correct
    User.count({username: req.body.username,password:req.body.password}, function(err, count) {
      console.log(count);
      if (count==1) {
        req.session.username = req.body.username;
        res.redirect('/');
      } else{
        logerr="invalid";
        res.redirect('/login');
      }

    });
};

exports.home = function(req, res) {
  // if user is not logged in, ask them to login
  if (typeof req.session.username == 'undefined') {
    
    res.render('home', {
        title: 'Login',
        msg:logerr,
        username: req.session.username,
        settings:settings
      });

  }else {

    res.redirect('/latest');
}};

exports.page = function(req, res) {
    var name = req.query.name;
    var contents = {
        about: 'We are nodebb nice to be here !!'
    };
    res.render('page', { 
      title: 'Ninja Store - ' + name,
      username: req.session.username, 
      content:contents[name] ,
      settings:settings
     });
};



/*
 *     @Discription
 *     Get all posts of the thread
 */

var msg='';
exports.thread = function(req, res) {
  settings.url = req.headers.host + '/topic/' + req.params.id;
  async.waterfall([
  function(callback) {
      Topics.all({where: {url_slag: req.params.id}}, function(e, top) {
        if (typeof top[0].id != 'undefined') {
          callback(null, top);
        } else {
          err = 'incorrect topic ' + req.params.id;
          callback(err, top);
        }
      });
  },function(top, callback) {
      // Increasing the like count when user likes the post and logined

      // @Todo - add [ && typeof req.session.username!='undefined' ] 
      //       - removed to demonstrate sockets

      if (typeof req.query.like!='undefined' ) {
        Comments.findOne({where: {id:req.query.like}}, function(e, com) {
            com.likes = com.likes + 1;
            Comments.upsert(com, function(e, o) {callback(null, top);});
            req.sockes.broadcast.emit('news2', { hello: (req.session.username|| 'Someone') +' liked a post on '+req.params.id,header:'Post Liked'});
        }
        );
      }else{
        callback(null, top);
      }
  }, function(top, callback) {
        Comments.all({where: {topic_id: top[0].id}}, function(e, com) {

        Category.findOne({where: {name:top[0].category}}, function(err, o) {
          callback(null, com, top[0],o);
        });

        });
  }
  ], function(err, com, top,caturl) {
    if (!err) {

      res.render('thread', {
        title: top.topic,
        data: com,
        username: req.session.username,
        topic: top,
        moment: moment,
        category:caturl,
        settings: settings
      });
    } else {
      res.redirect('/latest');
      console.log('Error - ' + err);
    }
  });
};


exports.user_profile = function(req, res) {
  User.findOne({
    username: req.params.id
  }, function(err, data) {
    if (typeof data != 'undefined') {
      res.render('profile', {
        title: 'Profile - ' + req.params.id,
        data: data,
        heading: 'Profile ' + req.params.id,
        settings: settings
      });
    } else {
      logerr = "invalid";
      res.redirect('/');
    }
  });
};


/*    
 *     @Discription
 *     New post in a thread is inserted to the database
 */
exports.thread_post = function(req, res) {

  Comments.create({
    comment: req.body.reply,
    topic_id: req.body.topic_id,
    username: req.session.username,
    id: 'NULL',
    likes:0,
    updated_at: 'Timestamp'
  },
  function (err, resp) {
    if (err != 'null') {

      Topics.find(req.body.topic_id, function(e, o) {

        o.updated_at = moment().format();
        o.post = o.post + 1;
        Topics.upsert(o, function(e, o) {});

      });

      req.sockes.broadcast.emit('news2', { hello: 'Reply posted on thread <br>'+req.params.id+' by '+req.session.username,header:'Reply Posted' });
      req.method = 'get';
      res.redirect('/topic/' + req.params.id);
    } else {
      console.log('Error : ' + err);
      res.redirect('/topic/' + req.params.id);
    }
  });
};


exports.category=function  (req,res) {
        Category.all({}, function(err,o) {
             res.render('category_list',{
              title: 'Latest',
              udata: req.session.user,
              data: o,
              moment: moment,
              username: req.session.username,
              settings: settings,
             });
        });
}

exports.category_details=function  (req,res) {
    
      msg={fail:'',sucss:''};
      Category.findOne({where: {url_slag:req.params.id}}, function(err, o) {
            
                   Topics.all({where: {category:o.name}}, function(err, o) {
                          res.render('category_details', {
                            title: o.name,
                            udata: req.session.user,
                            data: o,
                            moment: moment,
                            username: req.session.username,
                            settings: settings,
                            msg     : msg
                          });
                   });

      });

};



/*    
 *     @Discription  - Fetch all the threads and render them
 *     @url  -   host/latest
 */
exports.latest = function(req, res) {


  msg={fail:'',sucss:''};

  settings.url = req.headers.host + '/latest/';
  async.waterfall([
      function(callback){ 
        if (typeof req.query.like=='undefined') {

             callback(true);
        }else
        {
          if (typeof req.session.username=='undefined'){ 
            msg.fail='Please Login to like this';
            callback(true);
          }
          else
          {
              Likes.count({like_id:req.query.like , post:0, user_id: req.session.username}, function(err, com) 
              { 
                if (com==0) 
                {
                  Likes.create
                  (
                    {
                      id          : 'NULL',
                      post        : 0,
                      like_id     : req.query.like,
                      user_id     : req.session.username,
                      updated_at: 'Timestamp'
                    },
                    function( e,o )
                    {
                          msg.sucss='You Successfully like the topic';
                           callback(null,callback);
                    }
                  );
                }else{
                    msg.fail='You have already liked this';
                    err=true;
                    callback(err,callback );
                }


                }
              );
              
          }

        }

      },
      function(callback){

        if (typeof req.query.like=='undefined') {
          callback(null,callback);
        }
        else 
              Topics.findOne({where: {id:req.query.like}}, function(err, topic) {
                topic.likes=   topic.likes+1;
                Topics.upsert(topic, function(e, o) {


                  if (e) {
                    callback(null, o);
                  } else{
                    err="Error - "+e;
                    callback(err,callback);
                  }

                });

              });


      }
  ], function (err, o) {
     
      Topics.all({
        order: 'updated_at DESC'
      }, function(e, result) {

        res.render('latest', {
          title: 'Latest',
          udata: req.session.user,
          data: result,
          moment: moment,
          username: req.session.username,
          settings: settings,
          msg     : msg
        });

      });

  });
};




/*

  @Todo - Need to add a registeration page

exports.signup = function(req, res) {

  res.render('signup',{title:'Signup'});

};
exports.signup_post_handler= function(req, res) {

  //res.render('signup',{title:'Signup'});
  User.create({ username: req.body.username , password:req.body.password ,created_at:'Timestamp',id:'NULL'}, 
  function(err, user) {
       console.log(user instanceof User,user,err);
      
      if (typeof user != 'undefined') {
       res.redirect('/');
    }else {
    }
  });
};


*/