/*jshint browser: true, esversion: 6*/
/* global $, console */

//Global timer variables
var time = 0;
var interval, running;

$(document).ready(function() {

  //Start or stop timer
  function startStopTimer() {
    if (!running) {
      running = true;
      $('#timer').css('color', '#0f0');
      interval = setInterval(function() {
        time += 0.01;
        $('#timer').html(time.toFixed(2));
      }, 10);
    } else {
      $('#timer').css('color', 'yellow');
      clearInterval(interval);
      running = false;
    }

  }

  //Log the current time
  function recordTime() {
    let currentTime = $('#timer').html();
    //Prevent double-logging of current time
    if (currentTime !== $('li').last().html())
      $('#log').append(`<li>${currentTime}</li>`);
  }

  //Clear log and reset timer
  function resetAll() {
    $('#log').fadeOut(function() {
      $('#log').empty();
      $('#log').show();
    });
    clearInterval(interval);
    running = false;
    time = 0;
    $('#timer').html('0.00');
    $('#timer').css('color', 'yellow');
  }

  //Button controls
  $('#startBtn').click(function() {
    startStopTimer();
  });

  $('#resetBtn').click(function() {
    resetAll();
  });

  $('#recordBtn').mousedown(function() {
    recordTime();
  });

  //Keyboard controls
  $(document).keydown(k => {
    console.log(k.key);
    if (k.key === 's' || k.key === 'S') $('#startBtn').click();
    if (k.key === 'r' || k.key === 'R') $('#resetBtn').click();
    if (k.key === 't' || k.key === 'T') $('#recordBtn').mousedown();
  });

  //Timer animation
  $('#recordBtn').mousedown(function() {
    if (running) {
      $('#timer').addClass('running');
      setTimeout(function() {
        $('#timer').removeClass('running');
      }, 300);
    }
  });

});