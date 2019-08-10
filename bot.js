var express = require('express'),
    twitter = require('./twitter.js'), // this require() will log an error if you don't have your .env file setup correctly
    grammar = require('./loadgrammar.js').grammar,
    time = require('etime');


const winston = require('winston');
const fs = require('fs');

const timestamp = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp,
      level: 'info'
    }),
    new (winston.transports.File)({
      filename: 'winston.log',
      timestamp,
      level: 'info'
    })
  ]
});


function accords(str) {
 let str2 = str.replace("de un", "d'un")
  .replace(/leurs (nos|une|un|des|le|la|les|l')/gi, "leurs ")
  .replace(/nos (les|le|la|l'|une|un|des)/gi,"nos ")  
  .replace(/que un/i, "qu'un")
  .replace(/que un/i, "qu'un")
  .replace(/du un/i, "d'un")
  .replace(/du l/i, "de l")
  .replace(/du une/i, "d'une")
  .replace(/de des/i, "des")
//  .replace( "de l\'", "d\'")
  .replace(/de les/i, "des")
  .replace(/de le/i,"du")
   .replace(/(pas l\'|pas le|pas d\'un|pas de le|pas de la)/g,"pas de")
   .replace(/en tant que (l|d)es/g,"tant que")
  .replace(/"En tant que (le|les||lades|)/i, "en tant que");
    
  
  return  str2[0].toUpperCase() + str2.slice(1);

}




var allWords = []
function isRule(str) {
  return str[0] === "#";
}
var ar = grammar.raw.GP.concat(grammar.raw.nom.concat(grammar.raw.adjectif));

function wordList(ar) {
 ar.forEach(function(element){
   if (isRule(element)) {
     let strippedElement = element.replace(/#/g,"");
     let child = grammar.raw[strippedElement];
     ar.pop(element);
     ar.push(child);
     wordList(child);

   }
   else {
     allWords.push(element);
   }
   
   //ar.push(ar.filter(isRule))
 })
  return allWords.flat()
}
//var keys = flatArr.forEach( function(element) {element});

   

//avoid duplicates words in a sentence

 



var app = express();  

app.use(express.static('public')); // serve static files like index.html http://expressjs.com/en/starter/static-files.html
/*
function generateStatus() {
  // Generate a new tweet using our grammar
  
  let status = grammar.flatten("#origin#");
 // let status = "test jaune test jaune ejj ";

function hasDuplicate(element) {
  let test = new RegExp("("+element+".*){2}")
    return test.test(status)
  }
       console.log(status);  
   
  if ( wordList(ar).some(hasDuplicate) ) {
        console.log("DUPLICATE !!!");  
    
      generateStatus();
      return
        
        }
  else {
      //console.log("no duplicate");

    return accords(status);
    
  }
  

}
*/
    
function generateStatus() {
    let status = grammar.flatten("#origin#");
    return accords(status);

}  

app.all("/tweet", function (request, response) { // send a GET or POST to /tweet to trigger a tweet http://expressjs.com/en/starter/basic-routing.html
  var newStatus = generateStatus();

logger.info('HTTP request');
  
  
  
  if (twitter.tryToTweet(newStatus)){ // Some things could prevent us from tweeting. Find out more in twitter.js
   // if (fs.read === ) {
     response.sendStatus(200);  // We successfully tweeted
    
   // }
     
  } else {
    response.sendStatus(500); // Something prevented us from tweeting
  }
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
//  console.log('Your app is listening on port ' + listener.address().port);
});  


for (var i = 0; i < 10; i++) {
  console.log(i+"     "+ generateStatus());
}
  