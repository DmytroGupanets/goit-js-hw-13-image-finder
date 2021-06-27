import './sass/main.scss';
import debounce from 'lodash.debounce';
import ApiServiceRequest from './apiService.js';
import searchForm from './partials/searchForm.hbs';
import pictureCardsTemplate from './partials/pictureCardsTemplate.hbs';
import 'material-icons/iconfont/material-icons.css';
import { conditionalExpression } from 'babel-types';
import * as basicLightbox from '../node_modules/basiclightbox/src/scripts/main';
import Notification from './notification';
const notification = new Notification();

const instance = basicLightbox.create(`<img id="lightbox_img" src="" alt="">`);

document.body.insertAdjacentHTML('afterbegin', searchForm());

const apiRequest = new ApiServiceRequest();

const searchQueryRef = document.querySelector('input[name="query"]');

searchQueryRef.addEventListener('focus', commenceInputListener);

function commenceInputListener() {
  searchQueryRef.addEventListener('input', debounce(onInputGetValue, 1000));
}

function onInputGetValue(event) {
  if (!event.target.value.trim()) {
    resetPageResult();
    notification.onAlert();
  }
  if (event.target.value.trim()) {
    apiRequest.query = event.target.value;
    apiRequest.resetPageNumber();
    apiRequest.fetchSearch().then(renderResult);
  }
}

function renderResult(result) {
  const galleryRef = document.querySelector('.gallery');
  if (result.length === 0) notification.onError();
  if (result.length !== 0) notification.onSuccessResult(apiRequest.total);
  galleryRef.innerHTML = pictureCardsTemplate(result);
  startEventListener(galleryRef);
}

function resetPageResult() {
  apiRequest.resetPageNumber();
  document.querySelector('.gallery').innerHTML = '';
}

function startEventListener(ref) {
  ref.addEventListener('click', onClickOpenModalWithPicture);
}

function onClickOpenModalWithPicture(event) {
  if (!event.target.closest('div.photo-card')) return;

  const cardElement = event.target.closest('div.photo-card');
  const pictureOriginUrl = cardElement.querySelector('img').getAttribute('data-original-src');
  const pictureAltRef = cardElement.querySelector('img').getAttribute('alt');

  instance.show();
  setAttributeOnLightboxImg('src', `${pictureOriginUrl}`);
  setAttributeOnLightboxImg('alt', `${pictureAltRef}`);
}

function setAttributeOnLightboxImg(attName, attValue) {
  document.querySelector('#lightbox_img').setAttribute(attName, attValue);
}

// ========== Intersection observer ===================

const options = {
  rootMargin: '300px',
};
const observer = new IntersectionObserver(onIntersect, options);
observer.observe(document.querySelector('#js-anchor'));

function onIntersect(entries, observer) {
  const pageNumber = apiRequest.getPageNumber();

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log(pageNumber);
      if (pageNumber >= 2) {
        apiRequest.fetchSearch().then(renderNextPage);
      }
    }
  });
}

function renderNextPage(result) {
  console.log(result);
  const galleryRef = document.querySelector('.gallery');
  galleryRef.insertAdjacentHTML('beforeend', pictureCardsTemplate(result));
}
