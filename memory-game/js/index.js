/*jshint browser: true, esversion: 6*/
/* global $, console */

const clickedArray = [];
var ready, numCompleted, interval, time, started;

$(document).ready(function () {
	//When site loads, set up the board
	setUp();

	//Reset global variables
	function resetGlobals() {
		clickedArray.length = 0;
		ready = true;
		numCompleted = 0;
		//Timer variables
		time = 0;
		started = false;
		clearInterval(interval);
	}

	//Run timer
	function startTimer() {
		if (!started) {
			started = true;
			$('#timer').fadeIn(2500);
			interval = setInterval(function () {
				time++;
				$('#timer').html('Time Elapsed: ' + time);
			}, 1000);
		}
	}

	//When two recently clicked cells are not matched
	function wrongPair() {
		clickedArray.forEach(cell => {
			cell.style.backgroundColor = 'blue';
			cell.innerHTML = ' ';
			cell.clicked = false;
		});
		clickedArray.length = 0;
		ready = true;
	}

	//When two cells are correctly matched
	function completePair() {
		numCompleted += 2;
		clickedArray.forEach(cell => {
			cell.completed = true;
			cell.style.backgroundColor = 'purple';
		});
		clickedArray.length = 0;
	}

	//Shuffle all values
	function randomAnswers() {
		const answers = [1, 1, 2, 2, 3, 3, 4, 4, '■'];
		answers.sort(item => 0.5 - Math.random());
		return answers;
	}

	//Reset grid with random values
	function setUp() {
		resetGlobals();
		$('#timer').fadeOut(800);
		$('#timer').html('');
		$('td').html(' ');
		$('#gridTable').toggleClass('jello');
		const grid = document.getElementsByTagName('td');
		const answers = randomAnswers();

		//Reset individual cells
		for (let i = 0; i < grid.length; i++) {
			let cell = grid[i];
			cell.completed = false;
			cell.clicked = false;
			cell.value = answers[i];
			cell.style.backgroundColor = 'blue';
		}
		console.log(answers);
	}

	//Show cell value
	function reveal(cell) {
		cell.style.backgroundColor = 'red';
		cell.innerHTML = cell.value;
		cell.clicked = true;
	}

	//Restart button
	$('#restart').click(setUp);

	//Mouse enters cell
	$('td').mouseenter(function () {
		if (!this.completed && !this.clicked && ready)
			$(this).css('background-color', 'orange');
	});
	
	//Mouse exits cell
	$('td').mouseleave(function () {
		if (!this.completed && !this.clicked && ready)
			$(this).css('background-color', 'blue');
	});
	
	//Mouse clicks cell
	$('td').click(function () {

		if (!ready || this.clicked) return;
		
		startTimer();
		clickedArray.push(this);
		reveal(this);

		//If two cells have been clicked, check for match 
		if (clickedArray.length === 2) {
			//If pair matches
			if (clickedArray[0].value === clickedArray[1].value) {
				completePair();
				//If all 8 have been revealed, end the game
				if (numCompleted === 8) {
					ready = false;
					clearInterval(interval);
					$('#timer').html(`You won in ${time} seconds!`);
					$('td').css('background-color', 'green');
				}
			}
			//If pair does not match
			else {
				ready = false;
				clickedArray[0].style.background = 'grey';
				clickedArray[1].style.background = 'grey';
				//Delay for 500ms, then reset recently clicked cells
				setTimeout(function () {
					wrongPair();
				}, 700);
			}
		}
	});

	//Numpad controls
	$(document).keydown(k => {
		if (k.key > 0 && k.key < 10)
			$('#grid' + k.key).click();
	});

});
