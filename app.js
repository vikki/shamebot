var express = require('express'),
    http = require('http'),
    arDrone = require('ar-drone');

var app = express();
var client = arDrone.createClient();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

var BUILD_STATUS = {
  SUCCESS: 'passed',
  FAIL: 'failed',
  ERROR: 'error',
  PENDING: 'pending',
}

app.post('/', function(req, res) {
    console.log('fo shame');

    var buildDets = JSON.parse(req.body);
    console.dir(buildDets);

    var buildStatus = buildDets.payload.status_message.toLowerCase();
    var buildAuthor = {
       name: buildDets.payload.author_name,
       email: buildDets.payload.author_email
    };

    console.log('build status is ' + buildStatus);
    console.log('build author is ' + buildAuthor.name);

    client.takeoff();

    if (buildStatus === BUILD_STATUS.SUCCESS) {
      console.log("GREAT SUCCESS!");
      client
        .after(5000, function() {
          this.animate('theta20degYaw200deg', 15);
        });

    } else if (buildStatus === BUILD_STATUS.FAIL){
      console.log("fail >_<");
      client
        .after(5000, function() {
          this.animateLeds('doubleMissile', 5, 15);
        });
    } else {
      console.log("this happened: " + buildStatus);
      client
        .after(5000, function() {
          this.clockwise(0.5);
      });
    }

    client.after(1000, function() {
      this.stop();
      this.land();
    });

    var content = "boom!";
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content, 'utf-8');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
