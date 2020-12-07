const express = require("express");
const bodyParser = require("body-parser");
var request = require('superagent');
const http = require('http');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('views'));




    app.get("/signup", function (req, res) {
        res.sendFile(__dirname + "/views/signup.html");
    });

    //mail chimp api: 2d32ce3be80c6d5f910dfd96f24d75fb-us7
    //unique id: 8d89432d4d

    var mailchimpInstance   = 'us7',
    listUniqueId        = '8d89432d4d',
    mailchimpApiKey     = '2d32ce3be80c6d5f910dfd96f24d75fb-us7';

app.post('/signup', function (req, res) {
    request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer.from('any:' + mailchimpApiKey ).toString('base64'))
        .send({
          'email_address': req.body.email,
          'status': 'subscribed',
          'merge_fields': {
            'FNAME': req.body.firstname,
            'LNAME': req.body.lastname
          }
        })
            .end(function(err, response) {
              if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                res.sendFile(__dirname+"/success.html")
              } else {
                res.sendFile(__dirname+"/failure.html")
              }
          });
});

app.post("/failure",function(req,res){
    res.redirect("/signup")
});



app.listen(process.env.PORT || 3000, function (req, res) {
    console.log("server is ruinnning");
});