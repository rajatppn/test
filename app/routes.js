var mongoose = require('mongoose');
var express = require('express');
var validator = require('validator');
var expenseSchema = new mongoose.Schema({
         created: { type: Date, default: Date.now , index:true},
         category: {type:String, trim: true, index:true},
         transactionType: {type:String, enum:['cash','credit'], index:true},
         amount: {type:Number, min:0, max:99999999}
     },
     { collection: 'expense' }
);
var ExpenseModel = mongoose.model( 'expense', expenseSchema );

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
router.post('/add', function(req, res) {
errStr = undefined;
// Structure required by Stormpath API
account = {};
account.category = account.transactionType = account.amount
    = undefined;

if (undefined == req.param('category')) {
    errStr = "Undefined First Name";
    console.log(errStr);
    res.status(400);
    res.json({error: errStr});
    return;
} else if (undefined == req.param('transactionType') && ('cash'!=req.param('transactionType')||'credit'!=req.param('transactionType'))) {
    errStr = "Bad transaction type Enter cash/credit(Lowercase)";
    console.log(errStr);
    res.status(400);
    res.json({error: errStr});
    return;
} else if (undefined == req.param('amount')) {
    errStr = "Undefined amount";
    console.log(errStr);
    res.status(400);
    res.json({error: errStr});
    return;
}
        account.category = req.param('category');
        account.amount = req.param('amount');
        account.transactionType = req.param('transactionType');

        //console.log(apiKey);
        var newExpense = new ExpenseModel(
            {
              transactionType: account.transactionType,
              amount: account.amount,
              category: account.category,
            });
        newExpense.save(function (err, expense) {
            if (err) {
                console.log("Mongoose error creating new account for " + expense.transactionType);
                console.log(err);
                res.status(400);
                res.json({error: err});
            } else {
                console.log("Successfully added expense object for " + expense.transactionType);
                res.status(201);
                res.json(expense);
            }
        });
});
  router.get('/getByTransactionType', function(req, res) {
    console.log('Wow');
    if (undefined == req.param('transactionType') && ('cash'!=req.param('transactionType')||'credit'!=req.param('transactionType'))) {
      search = {$or: [{'transactionType' : 'cash'}, {'transactionType' : 'credit'}]};
    } else {
      search = {'transactionType' : req.param('transactionType')};
    }
    ExpenseModel.find(search, function dupetransactionType(err, results) {
        if (err) {
            console.log("Error from transactionType search");
            console.dir(err);
            res.status(400);
            res.json(err);
            return;
        } else {
          if(results.length<=0) {
            res.status(400);
            res.json("Couldnt find data with that transaction type");
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
      if (undefined == req.param('category')) {
          errStr = "Undefined category";
          console.log(errStr);
          res.status(400);
          res.json({error: errStr});
          return;
      }
      ExpenseModel.find({'category' : req.param('category')}, function dupeCategory(err, results) {
          if (err) {
              console.log("Error from category search");
              console.dir(err);
              res.status(400);
              res.json(err);
              return;
          } else {
              if(results.length<=0) {
                res.status(400);
                res.json("Couldnt find data in that category");
                return;
              } else {
                ExpenseModel.remove({'category' : req.param('category')}, function removeCategory(err, results) {
                    if (err) {
                        console.log("Error from transactionType search");
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
    if (undefined == req.param('category')) {
        errStr = "Undefined category";
        console.log(errStr);
        res.status(400);
        res.json({error: errStr});
        return;
    } else if (undefined == req.param('amount')) {
        errStr = "Undefined amount";
        console.log(errStr);
        res.status(400);
        res.json({error: errStr});
        return;
    }
     ExpenseModel.update({'category' : req.param('category')}, { $set: { amount: req.param('amount')}}, { multi: true }, function(err, numAffected) {
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
