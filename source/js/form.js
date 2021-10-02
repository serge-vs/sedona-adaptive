// Глобальная функция focusLock из внешнего файла
/* global focusLock */

// Переменные для открытия модальных окон
const pageContainer = document.querySelector('.page__container');
const overlays = document.querySelectorAll('.modal');
const popupSuc = document.querySelector('.modal--success');
const popupFail = document.querySelector('.modal--failure');
const close = popupSuc.querySelector('.modal__button');
const ok = popupFail.querySelector('.modal__button--failure');
const form = document.querySelector('form');
const feedbackName = document.querySelector('#firstname');
const feedbackSurname = document.querySelector('#surname');
const feedbackTel = document.querySelector('#tel');
const feedbackEmail = document.querySelector('#email');
const feedbackField = document.querySelector('#review-message');
const storageName = localStorage.getItem('firstname');
const storageSurname = localStorage.getItem('surname');
const storageTel = localStorage.getItem('tel');
const storageEmail = localStorage.getItem('email');

// В помощь пользователю фокусы в поля и вставка имеющихся значений
if (storageName) {
  feedbackName.value = storageName;
  if (storageSurname) {
    feedbackSurname.value = storageSurname;
    if (storageTel) {
      feedbackTel.value = storageTel;
      if (storageEmail) {
        feedbackEmail.value = storageEmail;
        feedbackField.focus();
      } else { feedbackEmail.focus(); }
    } else { feedbackTel.focus(); }
  } else { feedbackSurname.focus(); }
} else {
  feedbackName.focus();
}

// Реализация открытия и закрытия модальных окон
form.addEventListener('submit', (evt) => {
  if (!feedbackName.value || !feedbackSurname.value || !feedbackTel.value
    || !feedbackEmail.value || !feedbackField.value) {
    evt.preventDefault();
    popupFail.classList.add('modal--show');
    pageContainer.setAttribute('aria-hidden', 'true');
    // console.log('Нужно заполнить поля');
  } else {
    localStorage.setItem('firstname', feedbackName.value);
    localStorage.setItem('surname', feedbackSurname.value);
    localStorage.setItem('tel', feedbackTel.value);
    localStorage.setItem('email', feedbackEmail.value);
    popupSuc.classList.add('modal--show');
    pageContainer.setAttribute('aria-hidden', 'true');
    // Отмена отправки формы
    // evt.preventDefault();
  }
});

close.addEventListener('click', (evt) => {
  evt.preventDefault();
  popupSuc.classList.remove('modal--show');
  pageContainer.removeAttribute('aria-hidden');
});

ok.addEventListener('click', (evt) => {
  evt.preventDefault();
  popupFail.classList.remove('modal--show');
  pageContainer.removeAttribute('aria-hidden');
});

// Функция закрытия модальных окон при клике на оверлей и focusLock
function closeModal(modal) {
  modal.addEventListener('click', (evt) => {
    if (evt.target === evt.currentTarget) {
      if (modal.classList.contains('modal--show')) {
        modal.classList.remove('modal--show');
        pageContainer.removeAttribute('aria-hidden');
      }
    }
  });
}

for (let i = 0; i < overlays.length; i += 1) {
  closeModal(overlays[i]);
  focusLock.on(overlays[i]);
}

// (Тоже, что и функция выше) Закрытие модальных окон при клике на оверлей
// popupSuc.addEventListener('click', (evt) => {
// if (evt.target === evt.currentTarget) {
//   popupSuc.classList.remove('modal--show');
// }
// });

// popupFail.addEventListener('click', (evt) => {
//   if (evt.target === evt.currentTarget) {
//     popupFail.classList.remove('modal--show-fail');
//   }
// });

// Закрытие модальных окон при нажатии Escape
document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    if (popupSuc.classList.contains('modal--show')) {
      popupSuc.classList.remove('modal--show');
      pageContainer.removeAttribute('aria-hidden');
      evt.preventDefault();
    }
    if (popupFail.classList.contains('modal--show')) {
      popupFail.classList.remove('modal--show');
      pageContainer.removeAttribute('aria-hidden');
      evt.preventDefault();
    }
  }
});
