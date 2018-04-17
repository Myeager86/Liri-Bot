// import { constants } from "http2";

//Use the following arguments to interact with LIRI
// "my-tweets"
// "spotify-this-song"
// "movie-this"
// "do-what-it-says"

//these add other programs to this one
const fs = require('fs');
const dataKeys = require("./keys.js");
const twitter = require('twitter');
const spotify = require('spotify');
const request = require('request');

// var spotifyKey = new Spotify(keys.spotify);

const userSearch = function(caseData, functionData) {
    switch (caseData) {
      case 'my-tweets':
        getTweets();
        break;
      case 'spotify-this-song':
        SpotifyThis(functionData);
        break;
      case 'movie-this':
        movieThis(functionData);
        break;
      case 'do-what-it-says':
        doWhatItSays();
        break;
      default:
        console.log("LIRI doesn't know that");
    }
  }

//   Twitter function
  const getTweets = function() {
    const client = new Twitter(keys.twitter);
  
    const params = { screen_name: 'mikeYeager86', count: 10 };
  
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
  
      if (!error) {
        var data = []; 
        for (var i = 0; i < tweets.length; i++) {
          data.push({
              'Tweets: ' : tweets[i].text,
              'wrote at: ' : tweets[i].wrote_at
          });
        }
        console.log(data);
        writeToLog(data);
      }
    });
  };

const getArtistNames = function(artist) {
  return artist.name;
};

const SpotifyThis = function(songName) {
  //If it doesn't find a song, find Blink 182's What's my age again
  if (songName === undefined) {
    songName = 'The Sign';
  };

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      console.log(err);
      return;
    }

    let songs = data.tracks.items;
    let data1 = []; 

    for (var i = 0; i < songs.length; i++) {
      data1.push({
        'artist(s)': songs[i].artists.map(getArtistNames),
        'song name: ': songs[i].name,
        'preview song: ': songs[i].preview_url,
        'album: ': songs[i].album.name
      });
    }
    console.log(data);
    writeToLog(data);
  });
};


const movieThis = function(movieTitle) {

  if (movieTitle === undefined) {
    movieTitle = 'Mr. Nobody';
  }

  const movieURL = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";

  request(movieURL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let data = [];
      let jsonData = JSON.parse(body);

      data.push({
      'Title: ' : jsonData.Title,
      'Year: ' : jsonData.Year,
      'IMDB Rating: ' : jsonData.imdbRating,
      'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
      'Country: ' : jsonData.Country,
      'Language: ' : jsonData.Language,
      'Plot: ' : jsonData.Plot,
      'Actors: ' : jsonData.Actors
  });
      console.log(data);
      writeToLog(data);
}
  });

}

const doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    writeToLog(data);
    var dataArr = data.split(',')

    // if (dataArr.length == 2) {
    //   userSearch(dataArr[0], dataArr[1]);
    // } else if (dataArr.length == 1) {
    //   userSearch(dataArr[0]);
    // }

  });
}

const writeToLog = function(data) {
    fs.appendFile("log.txt", '\r\n\r\n');
  
    fs.appendFile("log.txt", JSON.stringify(data), function(err) {
      if (err) {
        return console.log(err);
      }
  
      console.log("log.txt was updated!");
    });
  }

//run this on load of js file
const runLiri = function(argOne, argTwo) {
  userSearch(argOne, argTwo);
};

runLiri(process.argv[2], process.argv[3]);