var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');
const fs = require('fs');
const fse = require('fs-extra');
var cmd = require('node-cmd')
var shell = require('shelljs');
const readline = require('readline');
var jsonfile = require('jsonfile');


var caleTest = "./rmt/examples/test.rmt";
var caleResult = "./rmt/examples/result.txt";
var caleResultEx = "./examples/result.txt";
var caleMaincode = "./examples/maincode.json";
var caleMaincodermt = "./rmt/examples/maincode.rmt";



app.set('port', process.env.PORT || 9502);
app.use(logger('dev'));
app.use(session({
	secret: 'bananana',
	saveUninitialized: false,
	resave: true

}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
require('./app/routes.js')(app);





app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

//app.post('/view', function (req, res) {
//    shell.cd('C:/Users/Sonia/Documents/Visual Studio 2015/Projects/Node/Nodejs/');
//
//    try {
//        fse.copySync('./rmt/examples/example1.rmt', './rmt/examples/test.rmt')
//        console.log("success!")
//    } catch (err) {
//        console.error(err)
//    }
//
//    fs.appendFile(caleTest, req.body.desc +';', function (error) {
//        
//        if (error) {
//            console.error("write error:  " + error.message);
//        } else {
//           
//            shell.cd('C:/Users/Sonia/Documents/Visual Studio 2015/Projects/Node/Nodejs/rmt/');
//            if (shell.exec('rmt.exe < examples/test.rmt > examples/result.txt').code !== 0) {
//                shell.echo('Error: rmt failed');
//                shell.exit(1);
//                shell.cd('C:/Users/Sonia/Documents/Visual Studio 2015/Projects/Node/Nodejs/');
//                fs.writeFile(caleTestMaincodermt, req.body.desc , function (err) {
//                    if (err) {
//                        return console.log(err);
//                    } else {
//
//                        console.log("The maincode.json was saved!");
//                    }
//                });
//            }
//            console.log("Successful Write to " + caleTest);
//
//           
//            
//        };
//        res.end();
//        var array = fs.readFileSync(caleResultEx).toString().split('\n');
//        var obj = {
//            table: []
//        };
//        obj.table.push({ square: req.body.desc  });
//        var jsonobj = JSON.stringify(obj);
//       
//        fs.writeFile(caleMaincode, jsonobj, 'utf8');
//        for (i in array) {
//            console.log('Array= '+ array[i]);
//            var string = array[i];
//            var substring = "loop";
//            
//            fs.readFile(caleMaincode, 'utf8', function readFileCallback(err, data) {
//                if (err) {
//                    console.log(err);
//                } else { 
//                    obj = JSON.parse(data); //now it an object
//                    obj.table.push({square: array[i] }); //add some data
//                    jsonobj = JSON.stringify(obj); //convert it back to json
//                    fs.writeFile(caleMaincode, jsonobj, 'utf8'); // write it back 
//                }
//            });
//
//          
//        }
//       
//    });
//    console.log('Json= ' + jsonobj);
//    res.send(jsonobj);
//    res.end();
//});



app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});




