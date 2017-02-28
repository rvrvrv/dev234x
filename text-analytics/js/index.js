/*jshint browser: true, esversion: 6*/
/* global $, console, Headers, Request, alert */
$(document).ready(function () {
const $out = $('#output');

	function analyze() {
		$('#analyzeBtn').html('Analyzing...');
		//Declare request vars
		var reqBody = {
			'documents': [
				{
					'language': 'en',
					'id': 1,
					'text': $('#input').val()
        		}
    		]
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
		var request = new Request('https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases', initObject);

		//Actual request occurs here
		fetch(request).then(function(response) {
			console.log(response);
			if (response.ok) return response.json();
			else return Promise.reject(new Error(response.statusText));
		}).then(response => {
			$('#analyzeBtn').html('Analyze');
			let phrases = response.documents[0].keyPhrases;
			$out.html(`Total Key Phrases: ${phrases.length}</br>${phrases.join(', ')}`);
			$out.fadeIn('slow');
		}).catch(err => {
			$('#analyzeBtn').html('Analyze');
			$out.html('An error has occured.');
		});
	}

	//Call fetch request when button is clicked
	$('#analyzeBtn').on('click', () => {
		$out.fadeOut('fast', () => { analyze(); });
	});
});
