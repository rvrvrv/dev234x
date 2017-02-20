/*jshint browser: true, esversion: 6*/
/* global $, console */

(function (window) {

	function myLibrary() {

		//Create catalog with 100 random items
		var catalog = createRandomCatalog(100);

		//Display all products in catalog
		function searchAllProducts() {
			var promise = new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(catalog); //Return all products in catalog
				}, 1000);
			});
			return promise;
		}

		//Display one product with matching ID
		function searchProductById(id) {
			var promise = new Promise((resolve, reject) => {
				let i = 0;
				setTimeout(() => {
					while (i < catalog.length) {
						if (catalog[i].id == id) {
							//Matching ID? Return correct product
							resolve({
								id: id,
								price: catalog[i].price,
								type: catalog[i].type
							});
						}
						i++;
					}
					reject('Invalid ID: ' + id);
				}, 1000);
			});
			return promise;
		}

		//Display all products with matching type
		function searchProductsByType(type) {
			var promise = new Promise((resolve, reject) => {
				let i = 0;
				let typeArray = [];
				let searchType = type.trim().toLowerCase();
				const possibleTypes = ['electronics', 'book', 'clothing', 'food'];
				//Handle invalid type
				if (!possibleTypes.includes(searchType)) reject('Invalid Type: ' + type);
				//Otherwise, search catalog
				else {
					setTimeout(() => {
						while (i < catalog.length) {
							if (catalog[i].type.toLowerCase() == searchType) {
								typeArray.push({
									id: catalog[i].id,
									price: catalog[i].price,
									type: catalog[i].type
								});
							}
							i++;
						}
						//After searching entire catalog, return matching products
						resolve(typeArray);
					}, 1000);
				}
			});
			return promise;
		}

		//Display all products within specified price range
		function searchProductsByPrice(price, difference) {
			var promise = new Promise((resolve, reject) => {
				let i = 0;
				let priceArray = [];
				//Handle invalid price
				if (!isFinite(price)) reject('Invalid Price: ' + price);
				//Otherwise, search catalog
				else {
					setTimeout(() => {
						while (i < catalog.length) {
							if (Math.abs(catalog[i].price - price) <= difference) {
								priceArray.push({
									id: catalog[i].id,
									price: catalog[i].price,
									type: catalog[i].type
								});
							}
							i++;
						}
						//After searching entire catalog, return matching products
						resolve(priceArray);
					}, 1000);
				}
			});
			return promise;
		}

		return {
			searchProductById: searchProductById,
			searchProductsByPrice: searchProductsByPrice,
			searchProductsByType: searchProductsByType,
			searchAllProducts: searchAllProducts
		};
	}

	//Catalog setup functions

	function createRandomProduct() {
		const typeArray = ['Electronics', 'Book', 'Clothing', 'Food']; //Categories
		let price = (Math.random() * 500).toFixed(2); //Random price between $0-$500
		let type = typeArray[Math.floor(Math.random() * 4)]; //Random category
		//Export randomly created product as object
		return {
			price: price,
			type: type
		};
	}

	function createRandomCatalog(num) {
		const catalog = [];
		//Fill catalog with randomly created items
		for (let i = 0; i < num; i++) {
			let product = createRandomProduct();
			catalog.push({
				id: i,
				price: product.price,
				type: product.type
			});
		}
		return catalog; //Export entire catalog
	}


	if (typeof (window.api) == 'undefined') window.api = myLibrary();
})(window);
