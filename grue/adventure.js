// SET US UP THE CONFIG
// the Twitter user for your adventure
var twitterUser = "andymboyle"
// how far back in the timeline to go
var tweetCount = 20
//
var commandVerbs = ['go','look','say','practice_python'];

var placeVerbs = ['You are in', 'You\'re standing next to', 'You seem to have fallen into'];
var places = ['a house in Nebraska', 'a dark and foreboding tunnel', 'a lonely bar in Boston', 'Southie', 'a giant pile of leaves, with more leaves swirling around you'];
var placeTransitions = ['There is a sign that says:', 'A girl walks by, muttering:', 'You notice ancient runes that say:'];

var thingVerbs = ['You notice', 'Upon further inspection, you discover', 'Suddenly out of the mist appears'];
var things = ['a bicycle', 'a cat', 'a Python how-to book', 'a taco bus', 'a burrito', 'a Get Up Kids hoodie', 'a beardfork', 'a giant squirrel with a camera'];
var thingTransitions = ['From beyond, you hear a haunting siren\'s call:', 'It bears a scroll that reads:', 'Somehow it communicates with you telepathically:'];

var peopleVerbs = ['As you sit in Burger King, you notice', 'You find it hard to believe, but you\'re standing next to', 'You feel an ominous presence. Looking up, you cower before'];
var people = ['a blue-haired girl', 'Bruce Springsteen', 'swimmer boyfriend', 'Bill Callahan', 'Rutledge Wood', 'someone from Southie', 'Zach Galifianakis', 'an improv class', 'Martin Frobisher', 'Tom Brokaw', 'a couple having an argument. You do not help'];
var peopleTransitions = ['Brandishing a +1 mace of crushing, they shout:', 'In a menacing whisper, they hiss:', 'Presenting you with a rose, they giggle:', 'Weeping, they plead with you:'];

var times_practiced = 0;

$(document).ready(function(){
    var url='https://api.twitter.com/1/statuses/user_timeline.json?screen_name='+twitterUser+'&count='+tweetCount.toString()+'&callback=?';
    
    var cmd = $('#adventure-entry');
    cmd.focus();

    $.getJSON(url, function(data) {
        // populate the adventure with user's tweets
        var tweetArray = new Array();
        $.each(data, function(i, tweets) {
            words = tweets.text;
            words = words.replace(/(\bhttp)\w+/g,'');
            tweetArray[tweetArray.length] = words;
        })
        
        // recast tweet pronouns to point at player and randomize
        var adventureArray = (meToYou(tweetArray));
        adventureArray.sort(getRandomOrder);

        // based on user command, refresh adventure
        function getNewAdventure(command) {
            if (adventureArray.length) {
                var arrValue = adventureArray.pop();
                switch (command) {
                    case 'go':
                        var value = buildAdventureText(placeVerbs, places, placeTransitions) + arrValue;
                        break;
                    case 'look':
                        var value = buildAdventureText(thingVerbs, things, thingTransitions) + arrValue;
                        break;
                    case 'say':
                        var value = buildAdventureText(peopleVerbs, people, peopleTransitions) + arrValue;
                        break;
                    case 'practice_python':
                        times_practiced ++;
                        if (times_practiced == 1) {
                            var value = 'Hahahaha. Just kidding. You don\'t know how to do that.';
                        } else if (times_practiced == 2) {
                            var value = 'Well now. You\'re persistent. @derekwillis would be proud.';
                        } else {
                            var value = 'Third time\'s a charm! Andy, you\'re a star, and you\'ve saved journalism.';
                        }
                        break;
                    default:
                        var value = arrValue;
                }
                var newAdventure = '<span class="adventure">'+value+'</span>';
                var thisAdventure = $('#adventure-wrapper .adventure:first');
                $(newAdventure).insertAfter(thisAdventure);
            }
            changeAdventure();
        }
        
        // on enter, test whether command starts with commandVerb
        function checkCommand(e) {
            if (e.keyCode == 13) {
                var newCommand = $(this).val().split(" ")[0];
                validateCommand(newCommand);
                $(this).val("");
            } 
        }
        
        // show fail message or get appropriate response for command
        function validateCommand(command) {
            if (commandVerbs.indexOf(command) == -1) {
                doNotUnderstand();
            } else {
                getNewAdventure(command);
            }
        }
        
        // set up the welcomes and goodbyes
        var firstAdventure = '<span class="adventure">You wake up in a strange room. You see a sign in front of you.</span>';
        var lastAdventure = '<span class="adventure">You died.</span>';
        var pastTheLastAdventure = '<span class="adventure">You\'re still dead.</span>';
        $('#adventure-wrapper').append(firstAdventure,lastAdventure,pastTheLastAdventure);
        
        // initialize and start taking commands
        $('#adventure-wrapper .adventure:first').fadeIn('slow');
        cmd.keydown(checkCommand);
    });
});

function changeAdventure() {
    var thisAdventure = $('#adventure-wrapper .adventure:first')
    var nextAdventure = thisAdventure.next()
    if (nextAdventure.length){
        thisAdventure.fadeOut('normal', function(){
            thisAdventure.remove();
            nextAdventure.fadeIn('normal');
        })
    } else {
        thisAdventure.fadeOut('normal', function(){
            thisAdventure.fadeIn('normal');
        })
    }
}

function doNotUnderstand() {
    var failMessage = '<span class="adventure">Sorry, but you can\'t do that. Here are the things you know how to do: '+commandVerbs.join(', ')+'</span>';
    var thisAdventure = $('#adventure-wrapper .adventure:first')
    $(failMessage).insertAfter(thisAdventure);
    changeAdventure();
}

function getRandomItem(array) {
    return array[Math.floor(Math.random()*array.length)];
}

function getRandomOrder() {
    return (Math.round(Math.random())-0.5);
}

function buildAdventureText(verbs, nouns, transitions) {
    return getRandomItem(verbs) + ' ' + getRandomItem(nouns) + '. ' + getRandomItem(transitions) + ' ';
}

// Al Shaw, yo! This all started with Al Shaw.
// https://gist.github.com/d4b74bce05e3b8ea227c
var MATCHERS = {
    "my"       : "your",
    "mine"     : "yours",
    "am"       : "are",
    "we'll"    : "you'll",
    "I'd"      : "you'd",
    "I'm"      : "you're",
    "(?:I|me)" : "you"
}

var meToYou = function(tweets) {
  for (var i = 0; i < tweets.length; i++) {
    for (matcher in MATCHERS) {
      var re = new RegExp("(^|\\W+)" + matcher + "(\\W+|$)", "gi");
      tweets[i] = tweets[i].replace(re, "$1" + MATCHERS[matcher] + "$2");
    }
  }
  return tweets;
};

