	
/* Main app script. We use strict mode to maintain quality 
 * and minimize bugs
 */

'use strict';

// Starting script when DOM is accessible

window.addEventListener( 'DOMContentLoaded', function initScript() {

	// Block to handle app animations

	{

		// Getting DOM nodes

		const headerSliders = document.querySelectorAll( '.js-slider' ),
			headerContentBox = document.querySelector( '.b-header-content' );

		// Starting animations after DOM content loaded

		Array.from( headerSliders ).forEach(
			function activateSlider(slider) {
				
				if ( slider.classList.contains( 'b-header-slider--horizontal' ) ) {
					slider.style.animation = 'fullWidth .5s ease-in forwards';
				}
				else {
					slider.style.animation = 'fullHeight .5s ease-in .6s forwards';
				}				

			}
		);

		// Hiding sliders and showing header content

		window.setTimeout( function showHeader() {

			Array.from( headerSliders ).forEach( function hideSliders(slider) {
				slider.style.opacity = '0';
			} );

			headerContentBox.style.animation = 'fadeIn .5s ease forwards';

		}, 1000 );		

	}

	// This block will handle the highlights section data

	{

		// Getting DOM elements

		const textbox = document.querySelector( '.js-highlight-textbox' ),
			textboxTitle = document.querySelector( '.js-highlight-textbox-title' ),
			textboxContent = document.querySelector( '.js-highlight-textbox-text' ),
			buttonBox = document.querySelector( '.js-highlight-buttonbox' );

		// Array to hold jsonData
		
		let jsonData;

		// Variable to control user clicks

		let canUserClick = false;

		// Fetching JSON data for texts

		fetch( './dist/json/highlights.json' )
		.then(
			function fulfilled(response) {

				if ( response.ok ) {
					return response.json();
				}

				throw new Error( 'Oops! Request Failed!' );

			},
			function networkError(error) {
				console.log( 'Error: ' + error.message  );
			}
		)
		.then(
			function handleData(data) {
				
				// Assigning data for use later

				jsonData = data;

				// This section will create the button and update text on textbox

				// Updating textbox content to the first item in array

				textboxTitle.innerHTML = data.highlights[0].title;
				textboxContent.innerHTML = data.highlights[0].text;

				// Creating buttons for each item in the data file

				for (let i = 0; i < data.highlights.length; i++) {									

					// Creating elements

					const button = document.createElement( 'button' ),
						span = document.createElement( 'span' );

					// Assigning classes and attributes

					button.type = 'button';
					button.dataset.id = data.highlights[i].id;
					button.classList.add( 'b-highlight-button' );					

					// If it's the first one, we activate it by default

					if ( i == 0 ) {
						button.dataset.active = true;
						button.classList.add( 'b-highlight-button--active' );
					}
					else {
						button.dataset.active = false;
						button.classList.add( 'b-highlight-button--inactive' );
					}

					button.addEventListener( 'click', function callChange() {
						changeTab( button.dataset.id );
					} );

					span.classList.add( 'fas', data.highlights[i].icon );					

					// Appending elements

					button.appendChild( span );
					buttonBox.appendChild( button );

				}

				canUserClick = true;

			}
		)
		.catch(
			function logError(error) {
				console.log( error );
			}
		);

		// Function to change tabs when user clicks a button

		function changeTab(id) {

			// Getting buttons

			const tabButtons = document.querySelectorAll( '.b-highlight-button' );

			// Checking if clicked button is already active

			for (let i = 0; i < tabButtons.length; i++) {				

				if ( tabButtons[i].dataset.active == 'true' &&
						 tabButtons[i].dataset.id == id ) {					
					// Stop function
					return;
				}

			}			

			if ( canUserClick ) {

				canUserClick = false;

				

				// Updating buttons

				for (let i = 0; i < tabButtons.length; i++) {


					if ( tabButtons[i].dataset.active == 'true' ) {						

						tabButtons[i].dataset.active = false;
						tabButtons[i].classList.toggle( 'b-highlight-button--active' );
						tabButtons[i].classList.toggle( 'b-highlight-button--inactive' );

					}
					else if ( tabButtons[i].dataset.id == id ) {

						tabButtons[i].dataset.active = true;
						tabButtons[i].classList.toggle( 'b-highlight-button--active' );
						tabButtons[i].classList.toggle( 'b-highlight-button--inactive' );

						// Hiding textbox

						textbox.style.animation = 'fadeOut .3s ease-in forwards';

						// Changing textbox content and showing it again

						window.setTimeout( function showTextbox() {

							// Loop to get the correct json data

							for (let j = 0; j < jsonData.highlights.length; j++) {

								if ( jsonData.highlights[j].id == id ) {

									textboxTitle.innerHTML = jsonData.highlights[j].title;
									textboxContent.innerHTML = jsonData.highlights[j].text;

								}

							}

							textbox.style.animation = 'fadeIn .3s ease-out forwards';

						}, 300 );

					}

				}				

				// Returning user control

				window.setTimeout( function returnUserControl() {
					canUserClick = true;
				}, 600 );

			}

		}

	}

} );
