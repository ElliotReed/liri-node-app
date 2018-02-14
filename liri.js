require("dotenv").config();
var keys = require('./keys');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');

var nodeArgs = process.argv;
var inputType = nodeArgs[2];

switch (inputType){
  case 'my-tweets':
    getTweets();
    break;
  case 'spotify-this-song':
    var song = "";
    for (var i = 3; i < nodeArgs.length; i++) {
      if (i > 3 && i < nodeArgs.length) {
        song = song + " " + nodeArgs[i];
      } else {
        song += nodeArgs[i];
      }
    }
    getSpotify(song);
    break;
  case 'movie-this':
    callOMDB();
    break;
  case 'do-what-it-says':
    doIt();
    break; 
  default:
  console.log(`${inputType} is not supported.`); 
}

function getTweets(){
  var client = new Twitter(keys.twitter);
  var params = {screen_name: '_Elliot_Reed_'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {
      for (var i = 0; i < 2; i++){ // change to 20 if I had that many tweets
        console.log(`At ${tweets[i].created_at} I tweeted "${tweets[i].text}"`);
      }
    }
  });
}

function getSpotify(song){
  var spotify = new Spotify(keys.spotify);

  if (song == null){
    song = "The Sign";
  } 
  spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log(data.tracks.items[0].name); 
    console.log(data.tracks.items[0].album.name);
    console.log(data.tracks.items[0].album.artists[0].name);
    console.log(data.tracks.items[0].preview_url); 
   });
}

function callOMDB(){
  // Create an empty variable for holding the movie name
  var movieName = "";
  // Loop through all the words in the node argument
  // And do a little for-loop magic to handle the inclusion of "+"s
  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      movieName = movieName + "+" + nodeArgs[i];
    } else {
      movieName += nodeArgs[i];
    }
  }
  // Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  // This line is just to help us debug against the actual URL.
  // console.log(queryUrl);

  // Then create a request to the queryUrl
  request(queryUrl, function(error, response, body){
    if (!error && response.statusCode === 200){
      console.log(`${JSON.parse(body).Title}`);
      console.log(`The release year is ${JSON.parse(body).Released}`);
      console.log(`IMDB Rating: ${JSON.parse(body).imdbRating}`);
      console.log(`Rotten Tomatoes give it a ${JSON.parse(body).Ratings[1].Value}`);
      console.log(`From ${JSON.parse(body).Country}`);
      console.log(`In ${JSON.parse(body).Language}`);
      console.log(`Plot: ${JSON.parse(body).Plot}`);
      console.log(`Starring ${JSON.parse(body).Actors}`);
    }
  });
}

function doIt(){
  fs.readFile("random.txt", "utf8", function(error, data) {
  // split the data into two parts
  var dataArr = data.split(','); 
    if (error) {
      return console.log(error);
    }

    switch (dataArr[0]){
      case 'my-tweets':
        getTweets();
        break;
      case 'spotify-this-song':
        getSpotify(dataArr[1]);
        break;
      case 'movie-this':
        callIMDB();
        break;      
    }
  
  });
}