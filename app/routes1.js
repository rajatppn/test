var mongoose = require('mongoose');
var express = require('express');
var validator = require('validator');
var userSchema = new mongoose.Schema({
         active: Boolean,
         email: { type: String, trim: true, lowercase: true },
         firstName: { type: String, trim: true },
         lastName: { type: String, trim: true },
         created: { type: Date, default: Date.now },
         lastLogin: { type: Date, default: Date.now },
     },
     { collection: 'user' }
);
userSchema.index({email : 1}, {unique:true});
var UserModel = mongoose.model( 'User', userSchema );

exports.addAPIRouter = function(app, mongoose) {

 	app.get('/*', function(req, res, next) {
 		res.contentType('application/json');
 		next();
 	});
 	app.post('/*', function(req, res, next) {
 		res.contentType('application/json');
 		next();
 	});
 	app.put('/*', function(req, res, next) {
 		res.contentType('application/json');
 		next();
 	});
 	app.delete('/*', function(req, res, next) {
 		res.contentType('application/json');
 		next();
 	});
  var router = express.Router();
router.get('/', function(req, res) {
       res.json({ message: 'hooray! welcome to our api!' });
});
router.post('/enroll', function(req, res) {
errStr = undefined;
// Structure required by Stormpath API
account = {};
account.givenName = account.surname = account.username = account.email
    = account.password = undefined;

if (undefined == req.param('firstName')) {
    errStr = "Undefined First Name";
    console.log(errStr);
    res.status(400);
    res.json({error: errStr});
    return;
} else if (undefined == req.param('lastName')) {
    errStr = "Undefined Last Name";
    console.log(errStr);
    res.status(400);
    res.json({error: errStr});
    return;
} else if (undefined == req.param('email')) {
    errStr = "Undefined Email";
    console.log(errStr);
    res.status(400);
    res.json({error: errStr});
    return;
}
if (!validator.isEmail(req.param('email'))) {
    res.status(400);
    res.json({error: 'Invalid email format'})
    return;
}
UserModel.find({'email' : req.param('email')}, function dupeEmail(err, results) {
    if (err) {
        console.log("Error from dupeEmail check");
        console.dir(err);
        res.status(400);
        res.json(err);
        return;
    }
    if (results.length > 0) {
        res.status(400);
        res.json({error: 'Account with that email already exists.  Please choose another email.'});
        return;
    } else {
        account.givenName = req.param('firstName');
        account.surname = req.param('lastName');
        account.username = req.param('email');
        account.email = req.param('email');

        //console.log(apiKey);
        var newUser = new UserModel(
            {
              active: true,
              email: account.email,
              firstName: account.givenName,
              lastName: account.surname,
            });
        newUser.save(function (err, user) {
            if (err) {
                console.log("Mongoose error creating new account for " + user.email);
                console.log(err);
                res.status(400);
                res.json({error: err});
            } else {
                console.log("Successfully added User object for " + user.email);
                res.status(201);
                res.json(user);
            }
        });
    }
});
});
  router.get('/get', function(req, res) {
    console.log('Wow');
    if (undefined == req.param('email')) {
        errStr = "Undefined email";
        console.log(errStr);
        res.status(400);
        res.json({error: errStr});
        return;
    }
    UserModel.find({'email' : req.param('email')}, function dupeEmail(err, results) {
        if (err) {
            console.log("Error from email search");
            console.dir(err);
            res.status(400);
            res.json(err);
            return;
        } else {
          if(results.length<=0) {
            res.status(400);
            res.json("Couldnt find user with that id");
            return;
          } else {
            res.json(results);
            return;
          }
        }
        });
    });
    router.delete('/delete', function(req,res) {
      console.log('deleting');
      if (undefined == req.param('email')) {
          errStr = "Undefined email";
          console.log(errStr);
          res.status(400);
          res.json({error: errStr});
          return;
      }
      UserModel.find({'email' : req.param('email')}, function dupeEmail(err, results) {
          if (err) {
              console.log("Error from email search");
              console.dir(err);
              res.status(400);
              res.json(err);
              return;
          } else {
              if(results.length<=0) {
                res.status(400);
                res.json("Couldnt find user with that id");
                return;
              } else {
                UserModel.remove({'email' : req.param('email')}, function removeEmail(err, results) {
                    if (err) {
                        console.log("Error from email search");
                        console.dir(err);
                        res.status(400);
                        res.json(err);
                        return;
                    } else {
                       res.json("Succesfully Deleted");
                       return;
                    }
                });
              }
          }
      });
    });
  router.put('/update', function(req,res) {
    console.log('Updating');
    if (undefined == req.param('email')) {
        errStr = "Undefined email";
        console.log(errStr);
        res.status(400);
        res.json({error: errStr});
        return;
    } else if (undefined == req.param('firstName')) {
        errStr = "Undefined firstName";
        console.log(errStr);
        res.status(400);
        res.json({error: errStr});
        return;
    }
     UserModel.update({'email' : req.param('email')}, { $set: { firstName: req.param('firstName')}}, { multi: true }, function(err, numAffected) {
       if(err) {
         console.log("Error updating");
         res.status(400);
         res.json(err);
         return;
       } else {
         res.json("Succesfully updated");
         console.log(numAffected + ' docs affected');
         return;
       }
     });
  });
  app.use('/api/v1.0', router);
}
