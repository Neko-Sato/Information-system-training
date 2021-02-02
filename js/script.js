const query = function GetQueryString() {
  var result = {};
  if( 1 < window.location.search.length ) {
      var query = window.location.search.substring( 1 );
      var parameters = query.split( '&' );
      for( var i = 0; i < parameters.length; i++ ) {
          var element = parameters[ i ].split( '=' );
          var paramName = decodeURIComponent( element[ 0 ] );
          var paramValue = decodeURIComponent( element[ 1 ] );
          result[ paramName ] = paramValue;
      }
  }
  return result;
}();
function zeroPadding(NUM, LEN){
return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}

const event_summary = (!(typeof query.event_summary === "undefined")) ? query.event_summary : "test";
const calendar_id = (!(typeof query.calendar_id === "undefined")) ? query.calendar_id : "sme1cdcgci8jltpoksudbrif0g@group.calendar.google.com";//primary;

const PROJECT_ID = "quickstart-1598863599385";
const CLIENT_ID = "208166964656-rp34jcjntuur7e1okioanf4r8euucbmd.apps.googleusercontent.com";
const API_KEY = "AIzaSyCK0il-2a6-zh8LZqGjvZhJcqZoyRoZnN8";
const SCOPES = "https://www.googleapis.com/auth/calendar";

function date2dict(temp){
return {
  Year : temp.getFullYear(),
  Month : temp.getMonth() + 1,
  Date : temp.getDate(),
}
}

function date_a_is_b(a, b){
return a.Year == b.Year && a.Month == b.Month && a.Date == b.Date
}

function dict_date2string(Year, Month, Date){
return zeroPadding(Year, 4) + "-" + zeroPadding(Month, 2) + "-" + zeroPadding(Date, 2)
}

const today = (!(typeof query.date === "undefined")) ? date2dict(new Date(query.date)) : date2dict(new Date());

var event_id;

function step_1(args){
var request = gapi.client.init({
  apiKey : API_KEY,
  clientId : CLIENT_ID,
  scope: SCOPES,
})
request.then(step_2)
}

function step_2(args){
if(gapi.auth2.getAuthInstance().isSignedIn.get()){
  gapi.client.load('calendar', 'v3', step_3)
}else{
  var request = gapi.auth2.getAuthInstance().signIn()
  request.then(step_2)
}
}

function step_3(args){
var request = gapi.client.calendar.events.list({
  calendarId : calendar_id,
})
request.execute(step_4)
}

function step_4(args){
var event = (args.items.filter(function(i){
  return !(typeof i.start.date === "undefined")
})).filter(function(i){
  return date_a_is_b(date2dict(new Date(i.start.date)), today)
});
if(event.length == 0){
  step_5();
}else{
  step_7(event[0]);
}
}

function step_5(args){
resource = {
  summary : event_summary,
  start : {
    date : dict_date2string(today.Year, today.Month, today.Date),
  },
  end : {
    date : dict_date2string(today.Year, today.Month, today.Date+1),
  },
  location : "",
  description : "",
};

request = gapi.client.calendar.events.insert({
  calendarId : calendar_id,
  resource : resource,
});
request.execute(step_6);
}

function step_6(args){
step_3();
}
function step_7(args){
event_id = args.id
var date = document.getElementById("date");
date.value = dict_date2string(today.Year, today.Month, today.Date);
date.onchange = function(arg){
  window.location.href = "?date=" + date.value;
}.bind(this);
var text_box = document.getElementById("text_box");
text_box.style.width = (window.innerWidth * 0.9) + "px";
text_box.style.height = (window.innerHeight * 0.85) + "px";
text_box.value = (!(typeof args.description === "undefined")) ? args.description : "";
var entry = document.getElementById("entry");
entry.onclick = step_8.bind(this)
var startup = document.getElementById("startup");
startup.style.display = 'None';
var main = document.getElementById("main");
main.style.display = 'block';
var SignOut = document.getElementById("SignOut");
SignOut.onclick = function(arg){
  request = gapi.auth2.getAuthInstance().signOut()
  request.then(function(){
    window.location.reload(true)
  })
}
}
function step_8(args){
resource = {
  summary : event_summary,
    start : {
      date : dict_date2string(today.Year, today.Month, today.Date),
    },
    end : {
      date : dict_date2string(today.Year, today.Month, today.Date+1),
      },
  location : "",
  description : text_box.value,
  }
request = gapi.client.calendar.events.update({
  calendarId : calendar_id,
  eventId : event_id,
  resource : resource,
})
request.execute(function(arg){
  alert('登録しました',)
})
}

gapi.load("client:auth2", step_1);