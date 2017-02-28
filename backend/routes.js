var mongoose = require('mongoose');
var UserSchema = require('./app/models/UserSchema');
var PostSchema = require('./app/models/PostSchema');
var CommentSchema = require('./app/models/CommentSchema');
var PictureSchema = require('./app/models/PictureSchema');
var gravatar = require('gravatar');
var Room = require('./app/models/Room');
var Message = require('./app/models/message');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var uuidV1 = require('uuid/v1');
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var fs = require('fs');

// var AWS = require('aws-sdk');
// AWS.config.loadFromPath('config.json');
// var s3 = new AWS.S3();
// var bucketParams = {Bucket: 'myBucket'};
// s3.createBucket(bucketParams)
// var s3Bucket = new AWS.S3( { params: {Bucket: 'myBucket'} } )
// var S3FS = require('s3fs');
// var s3fsImpl = new S3FS('', {
//   accessKeyId: '',
//   secretAccessKey: ''
// });
// s3fsImpl.create();

module.exports = (app) => {

    app.get('/', (req, res) => {
        res.render('home.ejs', {
            user: req.session.user
        });
    });

    // GET signup view
    app.get('/signup', (req, res) => {
        res.render('signup', {
            user: req.session.user
        });
        // res.sendFile(__dirname + '/public/views/signup.html');
    });

    // POST signup
    app.post('/signup', (req, res) => {


        var User = mongoose.model('User', UserSchema);

        var newUser = new User();
        newUser.email = req.body.email;
        newUser.password = req.body.password;

        if (req.body.password != req.body.confirm_password) {
            res.redirect('/signup');
        }

        newUser.save((error) => {
            if (error)
                res.send('Error: ' + error);

            req.session.user = newUser;
            res.redirect('/');
        });
    });

    // POST signup
    app.post('/api/signup', (req, res) => {

      // console.log("password", req.body.password);
      // console.log("Confirm password", req.body.confirm_password);

        var User = mongoose.model('User', UserSchema);

        var newUser = new User();
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.username = req.body.email;
        newUser.avatarUrl = 'https:' + gravatar.url(req.body.email) + '?d=identicon';
        newUser.rate_value=0;
        newUser.rate_number=0;
        newUser.resetToken=undefined;
        newUser.resetExpires=undefined;

        if (req.body.password != req.body.confirm_password) {
            return res.redirect('/signup');
        }


        newUser.save((error) => {
            if (error)
                return res.send(error);

            req.session.user = newUser;
            res.json(200, newUser);
            // res.redirect('/');
        });
    });

    //rate a user
    // app.post('/rate/:postID',function(req, res){
    //   var User = mongoose.model('User', UserSchema);
    //   var Post = mongoose.model('Post', PostSchema);
    //
    //   User.findOne( {'_id': req.body.userId}, function(err, user){
    //     var value = user.rate_value * user.rate_number + req.body.rate;
    //     user.rate_number++;
    //     user.rate_value= value/user.rate_number;
    //     user.save(function(err){
    //       if(err) {
    //         console.log(err);
    //         return res.end(error);
    //       }
    //       Post.findById(req.params.postID, function(err, post){
    //         post.rate_valid=false;
    //         post.save(function(err){
    //           if(err) {
    //             return res.end(error);
    //           }
    //           res.send("Rate Successfully");
    //         });
    //       });
    //     });
    //   });
    // });

    //rate a user/enpowered version
    app.post('/rate/:postID',function(req, res){
    async.waterfall([function(done){
      var User = mongoose.model('User', UserSchema);
      var Post = mongoose.model('Post', PostSchema);
      Post.findById(req.params.postID, function(err, post){
        post.rate_valid=false;
        post.save(function(err){
          done(err, User);
        });
      });
    },function(User, done){
      User.findOne( {'_id': req.body.userId}, function(err, user){
        var value = user.rate_value * user.rate_number + req.body.rate;
        user.rate_number++;
        user.rate_value= value/user.rate_number;
        user.save(function(err){
          res.json(200, user);
        });
      });
    }],function(err) {
        if (err) return res.end(err);
          res.redirect('back');
    });
  });

    // GET login view
    app.get('/login', checkNotLogin);
    app.get('/login', (req, res) => {
        res.render('login', {
            user: req.session.user
        });
        // res.sendFile(__dirname + '/public/views/login.html');
    });


    // POST login
    app.post('/login', checkNotLogin);
    app.post('/login', (req, res) => {
        var User = mongoose.model('User', UserSchema);

        User.findOne({'email': req.body.email}, (error, user) => {
            if (!user) {
                console.log(error);
                return res.redirect('/login'); // Return back to login page
            } else {
                if (user.password == req.body.password) {
                    req.session.user = user;
                    res.redirect('/');

                } else {
                    res.redirect('/login');
                }
            }
        })
    });

    app.post('/api/login', (req, res) => {
        var User = mongoose.model('User', UserSchema);
        User.findOne({'email': req.body.email}, (error, user) => {
            if (!user) {
                console.log(error);
                return res.redirect('/login'); // Return back to login page
            } else {
                if (user.password == req.body.password) {
                      req.session.user = user;
                      res.json(200, user);  // Successfully login
                } else {
                    res.redirect('/login');
                }
            }
        })
    })

    // POST logout
    app.get('/logout', checkLogin);
    app.get('/logout', (req, res) => {
      _userId = req.session.user._id;
        req.session.user = null;

        res.redirect('/');  // Successfully logout

    });

    //forget password
    app.post('/forget', function(req,res){
      async.waterfall([
        function(done){
          crypto.randomBytes(4, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done){
          var User = mongoose.model('User', UserSchema);
          User.findOne({ 'email': req.body.email }, function(err, user){
            if (!user) {
              return res.json(100, "The user with this email doesn't exist.");
            }
              user.resetToken = token;
              user.resetExpires = Date.now() + 1800000; // 30min
              user.save(function(err) {
                done(err, token, user);
              });
            });
        },
        function(token, user, done){
          var helper = require('sendgrid').mail;
          var from_email = new helper.Email('noreply@pixell.com');
          var to_email = new helper.Email(user.email);
          var subject = 'Account password reset';
          var content = new helper.Content('text/plain', 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/\n\n' +
          'Your password reset token is ' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n');

          var mail = new helper.Mail(from_email, subject, to_email, content);
          var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
          });

          sg.API(request, function(error, response) {
            if (error) {
              console.log(response.statusCode);
              console.log(response.body);
              console.log(response.headers);
              res.json(100, "send fail");
            }
            else {res.json(200, "send success");}
          });
        }
      ], function(err) {
          if (err) return res.end(err);
            // res.redirect('back');
      });
    });

    //To reset password page
    app.get('/reset', function(req,res){
      res.render('forget_password_new.ejs', { message: req.flash('message'), success: req.flash('success') });
    });

    //reset password
    app.post('/reset', function(req,res){
      var User = mongoose.model('User', UserSchema);
      User.findOne({ 'resetToken': req.body.token, 'resetExpires': { $gt: Date.now() } }, (error, user) => {
          if (!user) {
              req.flash('message', "Password reset token is invalid or has expired.");
              res.redirect('/reset');
          } else {
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            if (req.body.password != req.body.confirm_password) {
              req.flash('message',"The passwords entered are different.");
              res.redirect('/reset');
            }
            user.save(function(err) {
              if (err){
                res.end(err);
              }
              req.flash('success',"Success! Your password has been changed.");
              res.redirect('/reset');
            });
          }
      });
    });

    // GET a post by id
    app.get('/post/:id', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);

        Post.findOne({ '_id': req.params.id }, (error, post) => {
            if (error) {
                return res.end(error);
            }
            res.json(200, post);
        });
    });

    //get posts bought by this user
    app.get('/post/:user', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);

        Post.find({ 'buyer': req.params.user }, (error, post) => {
            if (error) {
                return res.end(error);
            }
            res.json(200, post);
        });
    });

    //End transaction
    app.post('/post/:postID/done', function(req, res){
      Post.findById( req.params.postID , (error, post) => {
          if (error) {
              return res.end(error);
          }
          post.avalability=false;
          post.buyer=req.body.userId;
          post.save(function(err){
            if (err) {
                return res.end(error);
            }
            res.send("Trade is complete!");
          });
      });
    });

    // GET post_form view
    // check whether login, only login could make a post
    app.get('/post', checkLogin);
    app.get('/post', (req, res) => {
        res.render('post_form', {
            user: req.session.user
        });
        // res.sendFile(__dirname + '/public/views/post_form.html');
    });

    // POST Make a post
    app.post('/post', checkLogin);
    app.post('/post', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);

        var newPost = new Post();

        newPost.owner = req.session.user._id;
        newPost.description = req.body.description;
        newPost.price = req.body.price;
        newPost.title = req.body.title;
        newPost.condition = req.body.condition;
        newPost.pictures = req.body.pictures;
        newPost.createdAt = new Date();
        newPost.updatedAt = new Date();
        newPost.type = req.body.type;

        newPost.save((error) => {
            if (error)
                res.send('Error: ' + error);

            res.json(200, newPost);
        });
    });

    // POST Make a post
    app.post('/api/user/:userid/post', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);

        var newPost = new Post();

        newPost.owner = req.params.userid;
        newPost.description = req.body.description;
        newPost.price = req.body.price;
        newPost.title = req.body.title;
        newPost.condition = req.body.condition;
        newPost.pictures = req.body.pictures;
        newPost.createdAt = new Date();
        newPost.updatedAt = new Date();
        newPost.type = req.body.type;
        console.log(newPost.avalability);
        console.log(newPost.rate_valid);
        newPost.save((error) => {
            if (error)
                res.send('Error: ' + error);

            res.json(200, newPost);
        });
    });

    // POST update a post
    app.post('/user/:userId/post/:postId/edit', checkLogin);
    app.post('/user/:userId/post/:postId/edit', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var currentUser = req.session.user;

        Post.findOne({_id: req.params.postId}, (error, post) => {
            if (!post) {
                console.log(error);
                return res.end(error);
            }

            post.description = req.body.description;
            post.price = req.body.price;
            post.title = req.body.title;
            post.condition = req.body.condition;
            post.pictures = req.body.pictures;
            post.updatedAt = new Date();
            post.type = req.body.type;

            post.save((error) => {
                if (error)
                    res.send('Error: ' + error);

                res.json(200, post);
            });
        });
    });

    // GET Delete a post
    app.get('/user/:userId/post/:postId/delete', checkLogin);
    app.get('/user/:userId/post/:postId/delete', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var currentUser = req.session.user;

        Post.remove({_id: req.params.postId}, (error) => {
            if (error) {
                console.log(error);
                return res.end(error);
            }

            res.json(200, 'Successfully removed post');
        });
    });

    // GET all posts
    app.get('/posts', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);

        Post.find({}, (error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.render('post_list', {
                user: req.session.user,
                posts: posts
            });
        });
    });

    // POST save a picture
    // app.post('/api/picture/upload', (req, res) => {
    //   var stream = fs.createReadStream(req.body.path);
    //   var uid = uuidV1() + req.body.format;
    //   return s3fsImpl.writeFile(uid, stream).then(function(){
    //     // fs.unlink(req.body.path, function(err){
    //     //   if (err)
    //         // console.log("Sending failed");
    //       res.send( 'https://s3.amazonaws.com/pixell/' + uid);
    //     // });
    //   });
    // });
    //
    // // POST save multiple pictures
    // app.post('/pictures', (req, res) => {
    //   var urls = [];
    //   for (i=0; i < req.body.number; i++) {
    //     var stream = fs.createReadStream(req.body.paths[i]);
    //     var uid =uuidV1() + req.body.formats[i];
    //     return s3fsImpl.writeFile(uid, stream).then(function(){
    //       fs.unlink(req.body.paths[i], function(err){
    //         if (err)
    //           console.log("Sending failed");
    //         urls[i] = 'https://s3.amazonaws.com/pixell/' + uid;
    //       });
    //     });
    //   }
    //   res.json(200, urls);
    // });

    // Post make a comment on Post
    app.post('/post/:id/comment', () => {
        var Post = mongoose.model('Post', PostSchema);

        var newPost = new Post();

        newPost.description = req.body.description;
        newPost.price = req.body.price;
        newPost.title = req.body.title;
        newPost.condition = req.body.condition;
        newPost.pictures = req.body.pictures;

        newPost.save((error) => {
            if (error)
                res.send('Error: ' + error);

            res.json(200, newPost);
        });
    });

    // API
    app.get('/api/posts', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({})
        .sort({ updatedAt: -1, createdAt: -1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });



    //Time descending
    app.get('/api/posts/timeDes', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({})
        .sort({ updatedAt: -1, createdAt: -1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //Time ascending
    app.get('/api/posts/timeAsc', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({})
        .sort({ updatedAt: 1, createdAt: 1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //Price Descending
    app.get('/api/posts/priceDes', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({})
        .sort({ price: -1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //Price ascending
    app.get('/api/posts/priceAsc', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({})
        .sort({ price: 1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //Price range ascending
    app.get('/api/posts/price/asc/:_up/:_down', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({"price": {"$gte": req.params._down, "$lt": req.params._up}})
        .sort({ price : 1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //Price range descending
    app.get('/api/posts/price/des/:_up/:_down', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({"price": {"$gte": req.params._down, "$lt": req.params._up}})
        .sort({ price : -1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //Name descending
    app.get('/api/posts/nameDes', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({})
        .sort({ title: -1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //Name ascending
    app.get('/api/posts/nameDes', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({})
        .sort({ title: 1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //condition
    app.get('/api/posts/condition/:_type', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({"condition": {"$eq": req.params._type}})
        .sort({ price: 1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //condition multiple version
    app.get('/api/condition/:_type', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        req.body.post.find({"condition": {"$eq": req.params._type}})
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //category
    app.get('/api/posts/category/:_type', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({"type": {"$eq": req.params._type}})
        .sort({ price: 1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //category multiple version
    app.get('/api/category/:_type', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);
        req.body.post.find({"type": {"$eq": req.params._type}})
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });

      //avalability
    app.get('/api/posts/avalability/:_type', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({"avalability": {"$eq": req.params._type}})
        .sort({ price: 1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //avalability multiple version
    app.get('/api/posts/avalability/:_type', (req, res) => {

        req.body.post.find({"avalability": {"$eq": req.params._type}})
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.find({"avalability": {"$eq": req.params._type}})
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });

    app.get('/api/post/:id', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.findOne({ '_id': req.params.id })
        .populate('comments')
        .exec((error, post) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, post);
        });
    });


    app.get('/api/post/:id/comments', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.findOne({ '_id': req.params.id })
        .populate('comments')
        .exec((error, post) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, post.comments);
        });
    });

    // Post make a comment on Post
    app.post('/api/post/:id/comment', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var Comment = mongoose.model('Comment', CommentSchema);

        Post.findOne({ '_id': req.params.id }, (error, post) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            var newComment = new Comment();

            newComment.content = req.body.content;
            newComment.owner = req.session.user;

            newComment.save((error) => {
                if (error)
                    res.send('Error: ' + error);

                post.comments.push(newComment);

                post.save((error) => {
                    if (error)
                        res.send('Error: ' + error);

                    res.json(200, newComment);
                });
            });
        });
    });

    //get room with a special user
    app.get('/rooms/:name', function(){
      Room.find({ 'between': req.params.name } , function(err, rooms){
        if (err) {
            console.log(error);
            return res.end(error);
        }
        res.json(200, rooms);
      });
    });

    // get all messages for a specific channel
    app.get('/messages/:room', function(req, res) {
      Message.find({'roomId': req.params.room }, function(err, data) {
        if(err) {
          console.log(err);
          return res.end(error);
        }
        res.json(200, data);
      });
    });

    //If cannot find a room with specific users, then create a new one
    app.post('/rooms/new_room', function(req, res) {
      var User = mongoose.model('User', UserSchema);
      Room.findOne({ 'between': req.body.between } , function(err, room){
        if (!room) {
          var newRoom = new Room();
          newRoom.between=req.body.between;
          newRoom.save(function (err, data) {
            if(err) {
              console.log(err);
              return res.end(error);
            }
            User.findone({ '_id': req.body.userId }, function(err, user){
              if (!user || err) {
                return res.end(error);
              }
              if(!user.orderHistory.indexOf(req.body.postId) ){
                user.orderHistory.push(req.body.postId);
                user.save(function(err){
                  if (err) return res.end(error);
                  res.json(200, "Add new history");
                  res.json(200, "New room created");
                });
              } else {res.json(200, "New room created");}
            });
          });
        }
        if (err) {
          console.log(err);
          return res.end(error);
        }
        User.findone({ '_id': req.body.userId }, function(err, user){
          if (!user || err) {
            return res.end(error);
          }
          if(!user.orderHistory.indexOf(req.body.postId) ){
            user.orderHistory.push(req.body.postId);
            user.save(function(err){
              if (err) return res.end(error);
              res.json(200, "Add new history");
              res.json(200, "Enter existed room");
            });
          } else {res.json(200, "Enter existed room");}
        });

      });
    });

    //create new message
    app.post('/new_message', function(req, res) {
      var newMessage = new Message();
      message.roomId = req.body.roomId;
      newMessage.text = req.body.text;
      newMessage.user = req.body.user;
      newMessage.createAt = Date.now();
      newMessage.save(function (err, data) {
        if(err) {
          console.log(err);
          return res.end(error);
        }
        res.json(200, data);
      });
    });

    // Get post by user id
    app.get('/api/user/:userid/posts', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);

        Post.find({owner: req.params.userid})
        .sort({ updatedAt: -1, createdAt: -1 })
        .populate('comments')
        .exec((error, posts) => {
            if (error) {
                console.log(error);
                res.end('error');
            }

            res.json(200, posts);
        });
    });
    //get Order History
    app.get('/api/:userid/orderHistory', (req, res) => {
        var Post = mongoose.model('Post', PostSchema);
        var User = mongoose.model('User', UserSchema);
        User.findOne({'_id': req.params.userid }) // { $in: req.body.wishlist }
        .sort({ updatedAt: -1, createdAt: -1 })
        .populate()
        .exec((error, user) => {
            if (!user) {
                console.log(error);
                res.end('error');
            }

            Post.find({ '_id': { $in: user.orderHistory } })
            .populate('owner')
            .exec((error, posts) => {
                if (!posts) {
                    console.log(error);
                    res.end('error');
                }

                res.json(200, posts);
            })
        });
    });
    // Add post to wishlist
    app.get('/api/user/:userid/post/:postid/wishlist/toggle', (req, res) => {
        var User = mongoose.model('User', UserSchema);

        User.findOne({'_id': req.params.userid}, (error, user) => {
            if (!user) {
                console.log(error);
                res.end('error');
            } else {
                var index = user.wishlist.indexOf(req.params.postid);

                if (index >= 0) {
                    user.wishlist.splice(index, 1);
                } else {
                    user.wishlist.push(req.params.postid);
                }

                user.save(function(error, user) {
                    if (error) {
                        console.log(error);
                        res.end('error');
                    }

                    res.json(200, user);
                });
            }
        });
    });

    // Get wishlist by userid
    app.get('/api/user/:userid/wishlist', (req, res) => {
        var User = mongoose.model('User', UserSchema);
        var Post = mongoose.model('Post', PostSchema);

        User.findOne({'_id': req.params.userid }) // { $in: req.body.wishlist }
        .sort({ updatedAt: -1, createdAt: -1 })
        .populate()
        .exec((error, user) => {
            if (!user) {
                console.log(error);
                res.end('error');
            }

            Post.find({ '_id': { $in: user.wishlist } })
            .exec((error, posts) => {
                if (!posts) {
                    console.log(error);
                    res.end('error');
                }

                res.json(200, posts);
            })
        });
    });

    // Update User name
    app.post('/api/user/:userid/edit', (req, res) => {
        var User = mongoose.model('User', UserSchema);


        User.findOne({'_id': req.params.userid }) // { $in: req.body.wishlist }
        // .sort({ updatedAt: -1, createdAt: -1 })
        // .populate()
        .exec((error, user) => {
            if (!user) {
                console.log(error);
                res.end('error');
            }

            user.username = req.body.username;
            user.avatarUrl = req.body.avatarUrl;

            user.save((error, user) => {
                if (error) {
                    console.log(error);
                    res.end('error');
                }

                res.json(200, user);
            })
        });

    });
};

    function checkLogin(req, res, next) {
            if (!req.session.user) {
                // req.flash('error', 'You haven\'t login!');
                res.redirect('/login');
            } else {
                next();
            }
        }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            // req.flash('error', 'You have logged in!');
            res.redirect('back'); // return the previous page
        } else {
            next();
        }
    }
