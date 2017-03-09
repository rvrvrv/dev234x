/*jshint browser: true, esversion: 6*/
/*global $*/

$(document).ready(function() {
	//Global vars
	const $btn = $('#compareBtn');
	const $tbl = $('#statsTbl').find('td');
	var shipData = [];
	var shipNums = [];

	//Fetch data function
	function getData(s) {
		let shipVal = $(`#ship${s}`).val();
		let url = `https://swapi.co/api/starships/${shipVal}`;
		//Fetch the data for ship
		fetch(url)
			.then(resp => resp.json())
			.then(data => {
				shipData[s] = data;
				fillTable(s);
				//When ship1 fetch done, call function for ship2
				if (s === 1) getData(2);
				//If ship2 done, compare stats
				else compareStats();
			});
	}

	//Fill table with results for a particular ship
	function fillTable(s) {
		$(`#ship${s}Name`).html($(`#ship${s}`).children(":selected").text());

		//Convert string values to numbers
		shipNums[s] = [
			+shipData[s].cost_in_credits,
			+shipData[s].max_atmosphering_speed,
			+shipData[s].cargo_capacity,
			+shipData[s].passengers
		];
		//Save raw numbers for comparison
		shipData[s] = shipNums[s];
		//Convert raw numbers to comma-separated values
		shipNums[s] = shipNums[s].map(e => e.toLocaleString());
		//Display formatted values in table
		$(`#ship${s}Cost`).html(shipNums[s][0]);
		$(`#ship${s}Speed`).html(shipNums[s][1]);
		$(`#ship${s}Cargo`).html(shipNums[s][2]);
		$(`#ship${s}Passengers`).html(shipNums[s][3]);
	}

	//Highlight greater value in each category and display table
	function compareStats() {
		let winner;
		//Compare each pair of values in array
		for (let i = 0; i < 4; i++) {
			if (shipData[1][i] > shipData[2][i]) {
				winner = $(`table tr:nth-child(${i+3})`).children()[1];
			} else if (shipData[2][i] > shipData[1][i]) {
				winner = $(`table tr:nth-child(${i+3})`).children()[2];
			}
			//Highlight the winner and display table
			$(winner).addClass('winner');
			$tbl.fadeTo(300, 1);
			restoreBtn();
		}
	}

	function restoreBtn() {
		$btn.prop('disabled', false);
		$btn.html('<i class="fa fa-fighter-jet"></i>&nbsp;Compare</button>');
	}


	$btn.click(() => {
		//Prevent duplicate requests
		if ($('#ship1Name').html() === $('#ship1').children(':selected').text() &&
			$('#ship2Name').html() === $('#ship2').children(':selected').text()) return;

		//Disable button while data loads
		$btn.prop('disabled', true);
		$btn.html('<i class="fa fa-spinner fa-spin fa-fw"></i>&nbsp;Loading');

		//Reset any highlighted cells and perform starship lookup
		$tbl.fadeTo(300, 0);
		setTimeout(() => {
			$tbl.removeClass('winner');
			getData(1);
		}, 300);
	});

});
