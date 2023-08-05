export function createGallery(galleryItems) {
  return galleryItems
    .map(item => {
      return `<a href="${item.largeImageURL}" class="gallery__link"><div class="photo-card">
        <img src="${item.webformatURL}" alt="${item.tags}" class="img-item" loading="lazy"  />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${item.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${item.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${item.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${item.downloads}
          </p>
        </div>
      </div></a>`;
    })
    .join('');
}
