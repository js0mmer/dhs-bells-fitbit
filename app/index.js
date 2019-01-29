/*
 * Entry point for the watch app
 */
import document from "document";
import { readFileSync } from "fs";

var date = new Date();
var period = document.getElementById("period");
var ending = document.getElementById("ending");
var nextPeriod = document.getElementById("nextPeriod");
var nextPeriodTime = document.getElementById("nextPeriodTime");

function init() {
  var day = date.getDay();

  if (day != 0 && day != 6) {
    var file = 'normal';
    
    if (day == 3) {
      file = 'wednesday';
    }
    
    // Sem 1 Finals
    if (date.getMonth() === 11) {
      if (date.getDate() === 18) {
        file = 'finals1/tuesday';
      } else if (date.getDate() === 19) {
        file = 'finals1/wednesday';
      } else if (date.getDate() === 20) {
        file = 'finals1/thursday';
      } else if (date.getDate() === 21) {
        file = 'finals1/friday';
      }
    } else if (date.getMonth() === 4) { // Sem 2 Finals
      if (date.getDate() === 25) {
        file = 'finals2/friday';
      } else if (date.getDate() === 29) {
        file = 'finals2/tuesday';
      } else if (date.getDate() === 30) {
        file = 'finals2/wednesday';
      } else if (date.getDate() === 31) {
        file = 'finals2/thursday';
      }
    } else if (date.getMonth() === 0 && date.getDate() === 30) { // Preview Day
      file = 'previewday';
    }
    
    getPeriod(readFileSync("resources/schedules/" + file + ".json", "json"));
  } else {
    period.text = "No Class";
  }
}

function inPeriod(periods, i, time) {
  return time >= parseRawTime(periods[i].start) && time < parseRawTime(periods[i].end);
}

function inPassingPeriod(periods, i, time) {
  return time >= parseRawTime(periods[i].end) && i < periods.length - 1 && time < parseRawTime(periods[i + 1].start);
}

function beforeSchool(periods, time) {
  return time < parseRawTime(periods[0].start);
}

function getPeriod(s) {
  var time = rawTime();
  
  if (beforeSchool(s.periods, time)) {
    period.text = "No Class";
    nextPeriod.text = "Next: " + s.periods[0].name;
    nextPeriodTime.text = convertTo12Hour(s.periods[0].start) + " - " + convertTo12Hour(s.periods[0].end);
    
    return;
  }

  for (var i = 0; i < s.periods.length; i++) {
    if (inPeriod(s.periods, i, time)) {
      period.text = s.periods[i].name;
      ending.text = "Ends at " + convertTo12Hour(s.periods[i].end);
      
      if (i < s.periods.length - 1) {
        nextPeriod.text = "Next: " + s.periods[i + 1].name;
        nextPeriodTime.text = convertTo12Hour(s.periods[i + 1].start) + " - " + convertTo12Hour(s.periods[i + 1].end);
      }
      
      break;
    } else if(inPassingPeriod(s.periods, i, time)) {
      period.text =  "Passing Period";
      ending.text = "Ends at " + convertTo12Hour(s.periods[i + 1].start);
      nextPeriod.text = "Next: " + s.periods[i + 1].name;
      nextPeriodTime.text = convertTo12Hour(s.periods[i + 1].start) + " - " + convertTo12Hour(s.periods[i + 1].end);
      
      break;
    } else {
      period.text = "No Class";
    }
  }
}

function convertTo12Hour(t) {
  if (t.length < 5) {
    return t + " AM";
  } else if (parseInt(t.substring(0, 2)) < 12) {
    return t + " AM";
  } else if (parseInt(t.substring(0, 2)) === 12) {
    return t + " PM";
  } else {
    return (parseInt(t.substring(0, 2)) - 12) + t.substring(2, 5) + " PM";
  }
}

function parseRawTime(t) {
  return parseInt(t.replace(":", ""));
}

function rawTime() {
  var minutes = date.getMinutes().toString();

  if (minutes.length == 1) minutes = "0" + minutes;

  return parseInt(date.getHours() + minutes);
}

init();