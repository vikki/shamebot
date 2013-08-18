var express = require('express'),
    http = require('http'),
    arDrone = require('ar-drone'),
    autonomy = require('ardrone-autonomy');

var app = express();
//var client = arDrone.createClient({ ip: '192.168.43.240'});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

var BUILD_STATUS = {
  BROKEN: 1,
  FIXED: 0
};

var dist=0.5;

var CONTRIB = {
  'github@tom-fitzhenry.me.uk': {x:dist,y:dist, z:2},
  'ancaleuca2005@gmail.com': {x:-dist, y:dist, z:2},
  'andrewkerr9000@gmail.com': {x:-dist,y: -dist, z:2},
  'vikki.read@gmail.com': {x:dist, y:-dist, z:2}
};



app.post('/', function(req, res) {
    console.log('fo shame');

    console.dir(req.body);
    var buildDets = JSON.parse(req.body.payload);

    var buildStatus = buildDets.status;
    var buildAuthor = {
       name: buildDets.author_name,
       email: buildDets.author_email
    };

    console.log('build status is ' + buildStatus);
    console.log('build author is ' + buildAuthor.name);
    console.log('build email is ' + buildAuthor.email);


      
    

    var animate;

    if (buildStatus === BUILD_STATUS.FIXED) {
      console.log("GREAT SUCCESS!");
      
        /*client
          .after(5000, function() {
            this.animate('theta20degYaw200deg', 15);
          });
        };*/

    } else if (buildStatus === BUILD_STATUS.BROKEN){
      console.log("fail >_<");


      var breakingPerson = CONTRIB[buildAuthor.email];

      console.log('breaking person is' + breakingPerson);

      var mission  = autonomy.createMission({ ip: '192.168.43.240'})
                             .takeoff()
                             .zero()
                             .altitude(2)
                             .go(breakingPerson)
                             .hover(2000)
                             .task(function(callback) {
                                 console.log('this is ');
                                 console.dir(this);
                                 console.log('mission is ');
                                 console.log(mission);
                                 //mission.client().animateLeds('doubleMissile', 5, 15);
                                 mission.client().animate('flipAhead', 15);
                                 mission.client().after(5000,callback);
                               })
                             .hover(2000)
                             .go({x:0, y:0, z:2})
                             .hover(1000)
                             .land();

     mission.log('foo.csv');

      mission.run();
              /*mission.client()
                     .after(5000, function() {
                            this.animateLeds('doubleMissile', 5, 15);
                      });*/
          

    } else {
      console.log("this happened: " + buildStatus);
     /* animate = function() {
        client
          .after(5000, function() {
            this.clockwise(0.5);
        });
      };*/

    }

//<<<<<<< HEAD
    //client.after(10000, function() {
//=======
    /*client.takeoff(animate);

    client.after(1000, function() {
>>>>>>> stalk the person who broke the build
      this.stop();
      this.land();
    });*/

    var content = "boom!";
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content, 'utf-8');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
