/*jshint browser: true, esversion: 6*/
/* global $, console, alert */

function createTableHeader(tableId) {
	var tableHeaderRow = document.createElement('TR');
	var th = [];

	for (let i = 1; i <= 4; i++) {
		th[i] = document.createElement('TH');
	}

	th[1].appendChild(document.createTextNode("ProductId"));
	th[2].appendChild(document.createTextNode("Type"));
	th[3].appendChild(document.createTextNode("Price"));
	th[4].appendChild(document.createTextNode("Examine"));

	for (let i = 1; i <= 4; i++) {
		tableHeaderRow.appendChild(th[i]);
	}

	document.getElementById(tableId).appendChild(tableHeaderRow);
}

function updateTable(tableId, productArray) {
	var td = [];
	var tableBody = document.getElementById(tableId);
	//Reset table
	while (tableBody.hasChildNodes()) {
		tableBody.removeChild(tableBody.firstChild);
	}
	//Create table header
	createTableHeader(tableId);
	//Populate table rows
	for (let i = 0; i < productArray.length; i++) {
		var tr = document.createElement('TR');
		td[1] = document.createElement('TD');
		td[2] = document.createElement('TD');
		td[3] = document.createElement('TD');
		td[4] = document.createElement('button');
		//'Examine' button search function
		td[4].addEventListener('click', function() {
		processSearch(this.parentNode.firstChild.innerHTML);
		});

		td[1].appendChild(document.createTextNode(productArray[i].id));
		td[2].appendChild(document.createTextNode(productArray[i].type));
		td[3].appendChild(document.createTextNode(productArray[i].price));
		td[4].appendChild(document.createTextNode('Examine'));
		for (let i = 1; i <= 4; i++) {
			tr.appendChild(td[i]);
		}

		tableBody.appendChild(tr);
	}
}

function updateExaminedText(product){
    var outputString = `Product Id: ${product.id}
								<br>Price: ${product.price}
								<br>Type: ${product.type}`;
    document.getElementById('productText').innerHTML = outputString;
}

//Search for similarly priced and categorized products
function getIntersection(arrA,arrB,searchedId){
    let samePrice = arrA;
    let sameType = arrB;
    let similarArray = [];
	
    samePrice.forEach(function(obj1){
        sameType.forEach(function(obj2){
            if(obj1.id === obj2.id && obj1.id != searchedId)
                similarArray.push(obj1);     
        });
    });
	
    return similarArray;
}

function searchByType(searchType){
    api.searchProductsByType(searchType)
		 .then(function(matches){
		 	document.getElementById('productText').innerHTML = '';
		 	updateTable('similarTable', matches);
    }).catch(function(matches){
        console.error(matches);
    });
}

function searchByPrice(searchPrice){
    api.searchProductsByPrice(searchPrice, 50)
		 .then(function(matches){
		 	document.getElementById('productText').innerHTML = '';
		 	updateTable('similarTable', matches);
    }).catch(function(matches){
        console.error(matches);
    });
}


function processSearch(searchId){
    api.searchProductById(searchId).then(function(val){
        return Promise.all([api.searchProductsByPrice(val.price,50),api.searchProductsByType(val.type),val]);
    }).then(function(val){
        var similarArray = getIntersection(val[0],val[1],val[2].id);
        updateExaminedText(val[2]);
        updateTable('similarTable', similarArray);
    }).catch(function(val){
        alert(val);
    });
}

//Button-click listeners
document.getElementById('searchByIdBtn').addEventListener('click', function() {
    processSearch(document.getElementById('inputProduct').value);
});

document.getElementById('searchByTypeBtn').addEventListener('click', function() {
    searchByType(document.getElementById('inputType').value);
});

document.getElementById('searchByPriceBtn').addEventListener('click', function() {
    searchByPrice(document.getElementById('inputPrice').value);
});


//Display entire catalog at bottom of page
api.searchAllProducts().then((value) => {
	updateTable('allTable', value);
});
