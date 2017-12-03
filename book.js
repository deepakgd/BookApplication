var jwt = require('jsonwebtoken');
var moment = require('moment');


var payload = {
    iss: 'my.domain.com',
    sub: '5a22aee437fbb70d9e677bbc',
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };

var a = jwt.sign(payload, 'd12da630f321f49b89a50a8c364b5914cabc66494d54437da6de11900a6ede3a');

console.log(a)

jwt.verify(a, 'd12da630f321f49b89a50a8c364b5914cabc66494d54437da6de11900a6ede3a', function(err, decoded) {
  console.log(decoded) // bar
});