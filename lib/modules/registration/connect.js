module.exports = function routes (app) {
  app.post('/users', function (req, res) {
    var params = req.param.body;
    User.create(params, function (err, user) {
      if (err instanceof mongoose.ValidatorError) {
        res.render('new.jade');
      } else {
        res.redirect('/');
      }
    });
  });
};
