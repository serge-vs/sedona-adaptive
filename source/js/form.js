// Переменные для открытия модальных окон

let popupSuc = document.querySelector('.modal--success');
let popupFail = document.querySelector('.modal--failure');
let close = popupSuc.querySelector('.modal__button');
let ok = popupFail.querySelector('.modal__button--failure');
let form = document.querySelector('form');
let feedbackName = document.querySelector('#firstname');
let feedbackSurname = document.querySelector('#surname');
let feedbackTel = document.querySelector('#tel');
let feedbackEmail = document.querySelector('#email');
let feedbackField = document.querySelector('#review-message');
let storageName = localStorage.getItem('firstname');
let storageSurname = localStorage.getItem('surname');
let storageTel = localStorage.getItem('tel');
let storageEmail = localStorage.getItem('email');

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
    popupFail.classList.add('modal--show-fail');
    // console.log('Нужно заполнить поля');
  } else {
    localStorage.setItem('firstname', feedbackName.value);
    localStorage.setItem('surname', feedbackSurname.value);
    localStorage.setItem('tel', feedbackTel.value);
    localStorage.setItem('email', feedbackEmail.value);
    popupSuc.classList.add('modal--show');
    // Отмена отправки формы
    // evt.preventDefault();
  }
});

close.addEventListener('click', (evt) => {
  evt.preventDefault();
  popupSuc.classList.remove('modal--show');
});

ok.addEventListener('click', (evt) => {
  evt.preventDefault();
  popupFail.classList.remove('modal--show-fail');
});
