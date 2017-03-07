/*jshint browser: true, esversion: 6*/
/* global $, console, Headers, Request, alert */
$(document).ready(function () {
	//Global vars
	const $btn = $('#searchBtn');
	var $film;
	var lastFilm = 2;

	//Recursive generator function runner
	function run(genFunc) {
		const genObject = genFunc(); //Generator object

		//Iterate through Promises
		function iterate(iteration) {
			//When done, return final value
			if (iteration.done) return Promise.resolve(iteration.value);
			//Otherwise, return each iterated Promise
			return Promise.resolve(iteration.value)
				//Recursive to iterate via next value
				.then(x => iterate(genObject.next(x)))
				.catch(x => iterate(genObject.throw(x)));
		}
		//Recursive loop
		try {
			return iterate(genObject.next()); //starts the recursive loop
		} catch (err) {
			return Promise.reject(err);
		}
	}

	//Generator function
	function* gen() {
		//Fetch the film
		var filmResponse = yield fetch(`https://swapi.co/api/films/${$film}`);
		var film = yield filmResponse.json();
		//Fetch the characters
		var characters = film.characters;
		var characterString = '';
		for (let i = 0; i < characters.length; i++) {
			var tempCharacterResponse = yield fetch(characters[i]);
			var tempCharacter = yield tempCharacterResponse.json();
			characterString += `${tempCharacter.name}<br>`;
		}
		//Display film title and characters
		$('#filmTitle').html(film.title);
		$('#peopleText').html(characterString);
		$('.output').removeClass('zoomOutUp');
		$('.output').addClass('zoomInDown');
		restoreBtn();
		lastFilm = $film;
	}

	//Restore button to original properties
	function restoreBtn() {
		$btn.prop('disabled', false);
		$('#searchBtn').html('<i class="fa fa-star"></i>&nbsp;Go!</button>');
	}

	$btn.click(() => {
		$film = +$('#filmNum').val();
		console.log($film);
		//First, check for valid film number
		if ($film < 1 || $film > 7) return;

		/* The Star Wars API stores films by release date, not episode number.
		Thus, we must convert the user's input to the appropriate value
		in the Star Wars API */
		if ($film !== 7) $film = ($film < 4) ? $film += 3 : $film -= 3;
		//Only fetch data for new film choice
		if ($film !== lastFilm) {
			$('.output').removeClass('zoomInDown');
			$('.output').addClass('zoomOutUp');
			$btn.prop('disabled', true);
			$btn.html('<i class="fa fa-spinner fa-spin fa-fw"></i>&nbsp;Loading');
			run(gen).catch((err) => {
				console.error(err.message);
				$('.output').removeClass('zoomOutUp');
				$('.output').addClass('zoomInDown');
				restoreBtn();
			});
		}
	});

	//Prevent typing of excessive numbers
	$('#filmNum').keypress((e) => {
		$film = $('#filmNum').val();
		var key = e.keyCode || e.which;
		if (key !== 13 && $film.length >= 1) e.preventDefault();
	});

	//Show API info 5 seconds after site loads
	setTimeout(() => {
		$('#info').css('transform', 'translateX(-205px)');
	}, 5000);

});
