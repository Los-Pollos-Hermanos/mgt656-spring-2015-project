'use strict';

var events = require('../models/events');
var validator = require('validator');

// Date data that would be useful to you
// completing the project These data are not
// used a first.
//
var allowedDateInfo = {
  months: {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  },
  minutes: [0, 30],
  hours: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
  ]
};

/**
 * Controller that renders a list of events in HTML.
 */
function listEvents(request, response) {
  var currentTime = new Date();
  var contextData = {
    'events': events.all,
    'time': currentTime
  };
  response.render('event.html', contextData);
}

/**
 * Controller that renders a page for creating new events.
 */
function newEvent(request, response){
  var contextData = {};
  response.render('create-event.html', contextData);
}

/**
 * Controller to which new events are submitted.
 * Validates the form and adds the new event to
 * our global list of events.
 */
function saveEvent(request, response){
  var contextData = {errors: []};

  if (validator.isLength(request.body.title, 5, 50) === false) {
    contextData.errors.push('Your title should be between 5 and 50 letters.');
  }
  
  if (validator.isLength(request.body.location, 5, 50) === false) {
    contextData.errors.push('Your location should be between 5 and 50 letters.');
  }

  if (validator.isURL(request.body.image) === false || (request.body.image.indexOf('.png') === -1 && request.body.image.indexOf('.gif') === -1)) {
    contextData.errors.push('Your image should be an URL and a gif or png file.');
  }
  
  if (validator.isInt(request.body.year) === false) {
   contextData.errors.push('Year must be an integer.');
 }
 
  var year = parseInt(request.body.year, 10);
  if (year > 2016 || year < 2015) {
   contextData.errors.push('Year should be between 2015 & 2016.');
 }
 
  if (validator.isInt(request.body.month) === false) {
   contextData.errors.push('Month must be an integer.');
 }
  
  var month = parseInt(request.body.month, 10);
  if (month > 11 || month < 0) {
   contextData.errors.push('Month should be between 0 = January and 11 = December.');
 }
 
  if (validator.isInt(request.body.day) === false) {
   contextData.errors.push('Day must be an integer.');
 }
 
 var day = parseInt(request.body.day, 10);
  if (day > 31 || day < 1) {
   contextData.errors.push('Day should be between 1 - 31.');
 }
 
  if (validator.isInt(request.body.hour) === false) {
   contextData.errors.push('Hour must be an integer.');
 }
 
  var hour = parseInt(request.body.hour, 10);
  if (hour > 23 || hour < 0) {
   contextData.errors.push('Hour should be between 0 and 23.');
 }
 
  if (validator.isInt(request.body.minute) === false) {
   contextData.errors.push('Minute must be an integer.');
 }
 
  var minute = parseInt(request.body.minute, 10);
  if (minute !== 0 && minute !== 30) {
   contextData.errors.push('Minute should be 0 or 30.');
 }
    var id = events.createNewId();
  if (contextData.errors.length === 0) {
    var newEvent = {
      title: request.body.title,
      location: request.body.location,
      image: request.body.image,
      date: new Date(),
      id: id,
      attending: []
    };
    events.all.push(newEvent);
    response.redirect(302,'/events/'+id);
  }else{
    response.render('create-event.html', contextData);
      }
}
 
function eventDetail (request, response) {
  var ev = events.getById(parseInt(request.params.id));
  if (ev === null) {
    response.status(404).send('No such event');
  }
  response.render('event-detail.html', {event: ev});
}

function rsvp (request, response) {
    
    var ev = events.getById(parseInt(request.params.id));
        if (ev === null) {
        response.status(404).send('No such event');
    }

    var email = request.body.email;
        if (validator.isEmail(request.body.email) && (request.body.email.toLowerCase().indexOf('@yale.edu') > -1)) {
        ev.attending.push(request.body.email);
        response.redirect('/events/' + ev.id);
    }
  
    else{
        var contextData = {errors: [], event: ev};
        contextData.errors.push('Invalid email');
        response.render('event-detail.html', contextData);    
    }

}

/*
if(validator.isEmail(request.body.email)){
      
    ev.attending.push(request.body.email);
    response.redirect('/events/' + ev.id);
  }else{
    var contextData = {errors: [], event: ev};
    contextData.errors.push('Invalid email');
    response.render('event-detail.html', contextData);    
  }
}
if (validator.isURL(request.body.image) === false || (request.body.image.indexOf('.png') === -1 && request.body.image.indexOf('.gif') === -1)) {
    contextData.errors.push('Your image should be an URL and a gif or png file.');
} */
  

function api(request, response){
  var output= {events: []};
  var search = request.query.search;
  if(search){
     for(var i=0; i < events.all.length; i++){
       if(events.all[i].title.indexOf(search) !== -1){
    output.events.push(events.all[i]);
  }
     }
  }else{
    output.events = events.all;
  
  }
 
  response.json(output);
}
/**
 * Export all our functions (controllers in this case, because they
 * handles requests and render responses).
 */
module.exports = {
  'listEvents': listEvents,
  'eventDetail': eventDetail,
  'newEvent': newEvent,
  'saveEvent': saveEvent,
  'rsvp': rsvp,
  'api': api
};