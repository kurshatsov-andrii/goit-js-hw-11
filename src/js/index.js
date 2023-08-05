import { links } from './links';
import { searchData } from './pixabay-api';
import { createGallery } from './markup';
import { showButton, hideButton } from './buttons';
import { PER_PAGE } from './pixabay-api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

//Initialize the Notify Module with some options
Notiflix.Notify.init({
  width: '280px',
  position: 'center-center',
  distance: '10px',
  opacity: 1,
  clickToClose: true,
});

//Слухаємо submit
links.searchForm.addEventListener('submit', handleSearchSubmit);

let page = 0;
let searchQuery = '';

//Опції SimpleLightbox
let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  disableScroll: true,
});

//Опції Intersection Observer API
let options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

//Нескінченний скрол Intersection Observer API
let observer = new IntersectionObserver(handleLoadMoreInfo, options);

//Функція натискання кнопки пошуку
async function handleSearchSubmit(evt) {
  evt.preventDefault();

  links.galleryWrapper.innerHTML = '';
  observer.unobserve(links.scrollArea);

  //hideButton(links.loadMoreButton);

  page = 1;

  //Первіряємо на ввід данних та якщо є просто пробіли
  if (!evt.target.elements.searchQuery.value.trim()) {
    Notiflix.Notify.info('Please, insert a search query');
    return;
  }

  searchQuery = evt.target.elements.searchQuery.value;

  try {
    const resp = await searchData(searchQuery, page);

    const { hits, totalHits } = resp.data;
    //Якщо бекенд повертає порожній масив, значить нічого підходящого не було знайдено. У такому разі показуй повідомлення з текстом "Sorry, there are no images matching your search query. Please try again.".
    if (!hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    //Після першого запиту з кожним новим пошуком отримувати повідомлення, в якому буде написано, скільки всього знайшли зображень (властивість totalHits). Текст повідомлення - "Hooray! We found totalHits images."
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    links.galleryWrapper.innerHTML = createGallery(hits);

    if (totalHits > PER_PAGE) {
      observer.observe(links.scrollArea);
    }

    // if (hits.length === PER_PAGE && totalHits > PER_PAGE) {
    //   showButton(links.loadMoreButton);
    // }

    lightbox.refresh();

    page += 1;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  links.searchForm.reset();
}

//Завантаження нових даних галереї
function handleLoadMoreInfo(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      try {
        const resp = await searchData(searchQuery, page);
        const { hits } = resp.data;

        const galleryMarkup = createGallery(hits);
        links.galleryWrapper.insertAdjacentHTML('beforeend', galleryMarkup);

        lightbox.refresh();

        page += 1;
        //У відповіді бекенд повертає властивість totalHits - загальна кількість зображень, які відповідають критерію пошуку (для безкоштовного акаунту). Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом "We're sorry, but you've reached the end of search results.".
        if (!hits.length) {
          observer.unobserve(links.scrollArea);
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } catch (error) {
        console.error(error);
        observer.unobserve(links.scrollArea);
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  });
}
