// TIKETTI = TICKET + KITTY

var UI = require('ui');
var Vector2 = require('vector2');
//var Voice = require('ui/voice');
var ajax = require('ajax');
var apiKey = ''; // add API key
var favs = {};

// styles
var styles = {
  bgColor: '#0055AA', //'#199DDB',
  bgTransparent: '0055AA', //'clear',
  textColor: 'white',
  favColor: 'yellow',
  highlightBgColor: 'white',
  highlightTextColor: '#0055AA'//'#199DDB'
};

//var splashScreen = new UI.Window({ fullscreen: true });
var splashScreen = new UI.Window();
var splashImage = new UI.Image({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  image: 'images/tm_fav.png'
});
splashScreen.add(splashImage);
splashScreen.show();

function showMenu() {
  var mainMenu = new UI.Menu({
     sections: [{
       items: [{
         title: 'Search Events'
       }, {
         title: 'Favorites'
       }]
     }],
     backgroundColor: styles.bgColor,
     textColor: styles.textColor,
     highlightBackgroundColor: styles.highlightBgColor,
     highlightTextColor: styles.highlightTextColor
  });
  
  mainMenu.on('select', function(e) {
    console.log('mainMenu selected item: ' + e.itemIndex);
    
    switch (e.itemIndex) {
      case 0:
        showClassifications();
        break;
      case 1:
        showFavorites();
        break;
    }
  });
  
  mainMenu.show();
  splashScreen.hide();
}

setTimeout(showMenu, 5000);

function showClassifications() {
  console.log('lookup Classifications');
  
  ajax(
    {
      url: 'https://app.ticketmaster.com//discovery/v2/classifications.json?size=100&apikey='  + apiKey,
      type:'json'
    },
    function(data) {
      console.log('fetched Classifications');
      
      var classifications = data._embedded.classifications;
      var classificationsMenu = new UI.Menu({
        sections: [{
          items: classifications.map(function(cls) {
            return {
              title: cls.segment.name
            };
          })
        }],
        backgroundColor: styles.bgColor,
        textColor: styles.textColor,
        highlightBackgroundColor: styles.highlightBgColor,
        highlightTextColor: styles.highlightTextColor
      });  
      
      classificationsMenu.on('select', function(e) {
        var classification = classifications[e.itemIndex];
        var clsId = classification.segment.id;
        runSearch(clsId);
      });
      
      classificationsMenu.show();      
    },
    function(error) {
      console.log('Download failed: ' + error);
    }
  );
}


function parseFeed(eventsList) {
  var items = [];
  
  
  var length = eventsList.length;
  for (var i = 0; i < length; i++) {
    var event = eventsList[i];
    
    var title = event.name;
    var time = event.dates.start.localDate;

    items.push({
      title: title,
      subtitle: time
    });
  }

  // Finally return whole array
  return items;
}
  
function runSearch(clsId) {
  ajax(
    {
      url: 'https://app.ticketmaster.com/discovery/v2/events.json?classificationId='+ clsId + '&dmaId=324&apikey=' + apiKey,
      type:'json'
    },
    function(data) {
      var eventsList = data._embedded.events;
      
      showEvents(eventsList);
    },
    function(error) {
      console.log('Download failed: ' + error);
    }
  );
}

function showEvents(eventsList) {
     var menuItems = parseFeed(eventsList);
     var resultsMenu = new UI.Menu({
        sections: [{
          items: menuItems
        }],
        backgroundColor: styles.bgColor,
        textColor: styles.textColor,
        highlightBackgroundColor: styles.highlightBgColor,
        highlightTextColor: styles.highlightTextColor
      });
      resultsMenu.on('select', function(e) {
        var event = eventsList[e.itemIndex];
        showEvent(event);
      });
      resultsMenu.show();
  
}

function showEvent(event) {
        var title = event.name;
        var date = event.dates.start.localDate;
        var venue = event._embedded.venues[0];
        var venueName = venue.name; 
        var address = venue.address.line1;
        var price;
        
//         var eventImage = new UI.Image({
//           position: new Vector2(0, 0),
//           size: new Vector2(144, 168),
//           image: 'images/MISC_CUSTOM.png'
//         });
        var bulk1 = new UI.Text({
          position: new Vector2(0, 10),
          size: new Vector2(144, 10),
          text: '',
          font: 'gothic_24_bold',
          color:styles.textColor,
          backgroundColor: styles.bgTransparent,
          textOverflow:'ellipsis',
          textAlign:'center'
        });
        var bulk2 = new UI.Text({
          position: new Vector2(0, 88),
          size: new Vector2(144, 40),
          text: '',
          font: 'gothic_24_bold',
          color:styles.textColor,
          backgroundColor: styles.bgTransparent,
          textOverflow:'ellipsis',
          textAlign:'center'
        });

  
        var titleText = new UI.Text({
          position: new Vector2(0, 10),
          size: new Vector2(144, 88),
          text: title,
          font: 'gothic_24_bold',
          color:styles.textColor,
          backgroundColor: styles.bgTransparent,
          textOverflow:'ellipsis',
          textAlign:'center'
        });
        var dateText = new UI.Text({
          position: new Vector2(0, 105),
          size: new Vector2(144, 15),
          text: date,
          font: 'gothic_14_bold',
          color:styles.textColor,
          backgroundColor: styles.bgTransparent,
          textOverflow:'ellipsis',
          textAlign:'center'
        });
        var venueText = new UI.Text({
          position: new Vector2(0, 120),
          size: new Vector2(144, 15),
          text: venueName,
          font: 'gothic_14_bold',
          color:styles.textColor,
          backgroundColor: styles.bgTransparent,
          textOverflow:'ellipsis',
          textAlign:'center'
        });
        var placeText = new UI.Text({
          position: new Vector2(0, 135),
          size: new Vector2(144, 33),
          text: address,
          font: 'gothic_14',
          color:styles.textColor,
          backgroundColor: styles.bgTransparent,
          textOverflow:'fill',
          textAlign:'center'
        });
        var favText = new UI.Text({
          position: new Vector2(0, 88),
          size: new Vector2(144, 15),
          text: 'GONNA GO',
          font: 'gothic_14_bold',
          color:styles.favColor,
          backgroundColor: styles.bgTransparent,
          textOverflow:'fill',
          textAlign:'center'
        });
  
        var eventDetails = new UI.Window();
//         eventDetails.add(eventImage);
        eventDetails.add(bulk1);
        eventDetails.add(titleText);
        eventDetails.add(bulk2);  
        if (favs[event.id]) {
          eventDetails.add(favText);
        }
        eventDetails.add(dateText);
        eventDetails.add(venueText);
        eventDetails.add(placeText);
    
        eventDetails.on('click', function() {
          if (favs[event.id]) {
            delete favs[event.id];
            eventDetails.remove(favText);            
          } else {
            favs[event.id] = event;
            eventDetails.add(favText);
          }
          console.log(favs);
        });
  
        eventDetails.show();
}

function showFavorites() {
  var events=[];
  for (var eventId in favs) {
    if( favs.hasOwnProperty( eventId ) ) {
      events.push(favs[eventId]);
      console.log('fav: ' + favs[eventId].id);
    } 
  }  
  showEvents(events);
}
