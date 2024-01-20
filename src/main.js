

// Підключення залежностей
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import axios from "axios";

// Конфігурація Axios для взаємодії з API Pixabay
const api = axios.create({
  baseURL: "https://pixabay.com/api/",
  params: {
    key: "41633959-4ab3a3c79df0d7e6ffc2251eb",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
  },
});

// Отримання посилань на DOM-елементи
const form = document.querySelector(".form");
const photoContainer = document.querySelector(".photo-container");
const loader = document.querySelector(".loader");
const buttonLoadMore = document.querySelector(".button-load-more");

// Ініціалізація змінних для роботи з галереєю
let gallery;
let page = 1;
let limit = 40;
let currentQuery = "";
let totalPages = 1;

// Функція для отримання фото з API
const getPhoto = async (query = "") => {
  try {
    const response = await api.get("", {
      params: {
        q: query,
        page: page,
        per_page: limit,
      },
    });

    if (response.status === 200) {
      totalPages = Math.ceil(response.data.totalHits / limit);
      return response.data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

// Функція для плавного прокручування на дві висоти карточки
function smoothScrollToNextGroup() {
  const cardHeight = document.querySelector(".photo-card")?.getBoundingClientRect().height;
  const scrollDistance = 2 * (cardHeight || 0); // дві висоти карточки

  window.scrollBy({
    top: scrollDistance,
    behavior: "smooth",
  });
}

// Обробник події для форми (пошук фото)
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Отримання значення з поля вводу
  const query = event.currentTarget.elements[0].value;

  if (query.length < 3) {
    alert("Sorry, Yours length is not enough. Min 4 letters.");
  }
  else {
      
    // Запуск функції для відображення фото
    try {
      currentQuery = query.toLowerCase();
      page = 1;
      await renderPhoto(currentQuery);
    } catch (error) {
      console.error(error);
    }
  }
});

// Функція для відображення фото
async function renderPhoto(query) {
  try {
    buttonLoadMore.style.display = "none";
      
    // Отримання фото з API
    const images = await getPhoto(query);

    // Перевірка чи є результати на поточній сторінці
    if (images.hits.length === 0 && page === 1) {
      // Повідомлення про відсутність результатів на першій сторінці
      iziToast.error({
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight'
      });
    }

    // Очищення контейнера при першій сторінці
    if (page === 1) {
      photoContainer.innerHTML = '';
    }

    // Створення HTML-розмітки для фото та додавання до контейнера
    const photoList = images.hits
      .map((hit, index) => (
        `<div class="photo-card">
          <div class="photo">
            <a href="${hit.largeImageURL}" data-lightbox="gallery-${index}">
              <img src="${hit.webformatURL}" alt="${hit.tags}" width="360" height="200" />
            </a>
          </div>
          <div class="info">
            <div class="label-value">
              <div class="label">Likes</div>
              <div class="value">${hit.likes}</div>
            </div>
            <div class="label-value">
              <div class="label">Views</div>
              <div class="value">${hit.views}</div>
            </div>
            <div class="label-value">
              <div class="label">Comments</div>
              <div class="value">${hit.comments}</div>
            </div>
            <div class="label-value">
              <div class="label">Downloads</div>
              <div class="value">${hit.downloads}</div>
            </div>
          </div>
        </div>`
      ))
      .join('');

    photoContainer.insertAdjacentHTML("beforeend", photoList);

    // Ініціалізація SimpleLightbox для галереї
    gallery = new SimpleLightbox('.photo a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
    gallery.refresh();

    // Прокручування тільки після додавання контенту
    if (page > 1) {
      smoothScrollToNextGroup();
    }
    
    // Відображення кнопки "Load more" якщо більше сторінок
    if (page < totalPages) {
      buttonLoadMore.style.display = "inline";
    }
  } catch (error) {
    console.error(error);
  } 
}

// Обробник події для кнопки "Load more"
buttonLoadMore.addEventListener("click", async () => {
  page += 1;
  loader.style.display = "block";
  try {
    // Завантаження додаткових фото за тим самим запитом
    await renderPhoto(currentQuery);

    // Перевірка на останню сторінку після завантаження даних
    if (page >= totalPages) {
      // Відображення повідомлення про те, що більше немає зображень
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight'
      });

      // Приховання кнопки "Load more"
      buttonLoadMore.style.display = "none";
    }
  } catch (error) {
    console.error(error);
  } finally {
    loader.style.display = "none";
  }
});





