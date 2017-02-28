/*jshint browser: true, esversion: 6*/
/* global $, console, Headers, Request, alert */
$(document).ready(function () {
const $out = $('#output');

	function analyze() {
		//Update UI
		$('#error').fadeOut('fast');
		$('#userImg').attr('src', $('#imgUrl').val());
		$('#analyzeBtn').html('Analyzing...');
		//Declare request vars
		var reqBody = {
			'url': $('#imgUrl').val()
		};
		var myHeader = new Headers({
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': '' //API key goes here
		});
		var initObject = {
			method: 'POST',
			body: JSON.stringify(reqBody),
			headers: myHeader
		};
		var request = new Request('https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=age,gender', initObject);

		//Actual request occurs here
		fetch(request).then(function(response) {
			if (response.ok) return response.json();
			else return Promise.reject(new Error(response.statusText));
		}).then(response => {
			$('#analyzeBtn').html('Analyze');
			//If no faces detected, notify the user
			if (response[0] === undefined) $('#faceStats').html('No faces detected.');
			//Otherwise, display the attributes
			else {
			let stats = response[0].faceAttributes;
			$('#faceStats').html(`Age: ${stats.age}<br>Gender: ${stats.gender}</p>`);
				}
			$out.fadeIn('slow');
		}).catch(err => {
			$('#analyzeBtn').html('Analyze');
			console.error(err);
			$('#error').fadeIn('fast');
		});
	}

	//Call fetch request when button is clicked
	$('#analyzeBtn').on('click', () => {
		$out.fadeOut('fast', () => { analyze(); });
	});
});
