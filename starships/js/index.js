window.onload = () => {
  const $btn = $('#compareBtn');
  const $tbl = $('#statsTbl').find('td');
  const shipData = [];
  const shipNums = [];

  // Restore 'Compare' button to initial state
  function restoreBtn() {
    $btn.prop('disabled', false);
    $btn.html('<i class="fa fa-fighter-jet"></i>&nbsp;Compare</button>');
  }

  // Highlight greater value in each category and display table
  function compareStats() {
    let winner;
    // Compare each pair of values in array
    for (let i = 0; i < 4; i++) {
      if (shipData[1][i] > shipData[2][i]) {
        winner = $(`table tr:nth-child(${i + 3})`).children()[1];
      } else if (shipData[2][i] > shipData[1][i]) {
        winner = $(`table tr:nth-child(${i + 3})`).children()[2];
      }
      // Highlight the winner and display table
      $(winner).addClass('winner');
      $tbl.fadeTo(300, 1);
      restoreBtn();
    }
  }

  // Fill table with results for a particular ship
  function fillTable(s) {
    $(`#ship${s}Name`).html($(`#ship${s}`).children(':selected').text());
    // Convert string values to numbers
    shipNums[s] = [
      +shipData[s].cost_in_credits,
      +shipData[s].max_atmosphering_speed,
      +shipData[s].cargo_capacity,
      +shipData[s].passengers
    ];
    // Save raw numbers for comparison
    shipData[s] = shipNums[s];
    // Convert raw numbers to comma-separated values
    shipNums[s] = shipNums[s].map(e => e.toLocaleString());
    // Display formatted values in table
    $(`#ship${s}Cost`).html(shipNums[s][0]);
    $(`#ship${s}Speed`).html(shipNums[s][1]);
    $(`#ship${s}Cargo`).html(shipNums[s][2]);
    $(`#ship${s}Passengers`).html(shipNums[s][3]);
  }

  // Fetch data function
  function getData(s) {
    // Fetch the data for ship
    fetch(`https://swapi.co/api/starships/${$(`#ship${s}`).val()}`)
      .then(resp => resp.json())
      .then((data) => {
        shipData[s] = data;
        fillTable(s);
        // After fetching ship1 data, call same function for ship2
        if (s === 1) getData(2);
        // After fetching ship2 data, compare stats
        else compareStats();
      })
      .catch((err) => {
        // Upon error, notify the user and restore the page
        console.error(err);
        $('.results').after('<h5 class="error">An error has occurred. Please try again.</h5>');
        restoreBtn();
      });
  }

  $btn.click(() => {
    // Prevent duplicate requests
    if ($('#ship1Name').html() === $('#ship1').children(':selected').text() &&
   $('#ship2Name').html() === $('#ship2').children(':selected').text()) return;

    // Disable button while data loads
    $btn.prop('disabled', true);
    $btn.html('<i class="fa fa-spinner fa-spin fa-fw"></i>&nbsp;Loading');

    // If an error message exists, remove it
    if ($('.error')) $('.error').remove();

    // Reset any highlighted cells and perform starship lookup
    $tbl.fadeTo(300, 0);
    setTimeout(() => {
      $tbl.removeClass('winner');
      getData(1);
    }, 300);
  });
};
