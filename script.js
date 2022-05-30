// VARIABLES
let imageContainer = document.querySelector('.image-container'),
	loader = document.querySelector('.loader');

let readyToLoadMoreImages = false,
	imagesLoaded = 0,
	rateExceeded = false;

// images for testing
import { images, fallbackImage } from './images.js';

// FUNCTIONS
async function getImages() {
	const response = await fetch(
		'https://api.unsplash.com/photos/random?client_id=jI85POEPkaT-le2wHrOEXEt5LaQUhRp0FkuOf7HShqI&count=10&orientation=portrait',
		{
			method: 'GET',
			headers: {
				'Accept-Version': 'v1'
			}
		}
	);

	if (response.headers.get('X-Ratelimit-Remaining') == 0) {
		rateExceeded = true;
		return fallbackImage;
	}

	const data = await response.json();
	return data;
}

function displayImages(images) {
	let temp, alt, title;
	images.map((image) => {
		alt = image.alt_description != null ? image.alt_description : 'Unsplash Image';
		title = image.description != null ? image.description : 'No description provided';
		temp = `
			<a href=${image.links.html} target="_blank">
				<img src=${image.urls.regular} alt='${alt}' title='${title}'>
			</a>`;
		imageContainer.insertAdjacentHTML('beforeend', temp);
		imagesLoaded += 1;

		if (imagesLoaded === 10 || rateExceeded) {
			imagesLoaded = 0;
			readyToLoadMoreImages = true;
			loader.hidden = true;
		}
	});
}

function loadImages() {
	readyToLoadMoreImages = false;
	getImages()
		.then((res) => {
			displayImages(res);
		})
		.catch((err) => console.error(err));
}

// EVENTS
window.onload = () => {
	loadImages();
};

window.onscroll = () => {
	// console.log(window.innerHeight); // what we can see
	// console.log(window.scrollY); // how much from top we have scrolled
	// console.log(document.body.offsetHeight); //full height including what we cannot see
	if (readyToLoadMoreImages && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
		if (!rateExceeded) {
			loader.hidden = false;
			loadImages();
		}
	}
};
