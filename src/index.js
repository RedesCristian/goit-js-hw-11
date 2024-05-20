import Notiflix from 'notiflix';
import axios from 'axios';
import simpleLightbox from 'simplelightbox';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.style.display = 'none';
const myKey = '43883477-d1f56fd35c1c851aa1589f515';
const url = 'https://pixabay.com/api/';

let page = 1;

async function searchImages() {
  const searchValue = input.value.trim();
  if (searchValue === '') {
    Notiflix.Notify.warning('Please enter a search term.');
    return;
  }

  const params = new URLSearchParams({
    key: myKey,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 40,
  });

  try {
    const response = await axios.get(url, { params });
    foundImagesNumber(response.data.total);
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.style.display = 'none';
    } else {
      displayResult(response.data.hits);
      if (response.data.hits.length < 40) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
      }
    }
  } catch (err) {
    console.log(err);
  }
}

function foundImagesNumber(totalHits) {
  if (page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  return;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  page = 1;
  gallery.innerHTML = '';
  searchImages();
});

function displayResult(images) {
  const markup = images
    .map(image => {
      return `
     <li class="list">
     <a href="${image.largeImageURL}" class="photo-link">
          <img class="picture" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p><b>Likes:</b>${image.likes}</p>
          <p><b>Views:</b>${image.views}</p>
          <p><b>Comments:</b>${image.comments}</p>
          <p><b>Downloads:</b>${image.downloads}</p>
        </div></li>
      
     
    `;
    })
    .join('');
  gallery.innerHTML += markup;
  new simpleLightbox('.gallery a');
}

loadMoreBtn.addEventListener('click', e => {
  e.preventDefault();
  page++;
  window.addEventListener('scroll', e => {
    e.preventDefault();
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 1000
    ) {
      page++;
      searchImages();
      console.log('load more');
    }
  });
  searchImages();
});
