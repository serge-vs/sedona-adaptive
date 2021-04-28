document.addEventListener('DOMContentLoaded', () => {
  const burgerButton = document.querySelector('.burger-button');
  const listToggle = document.querySelector('.main-nav__list');

  /*
  В случае, если JS не загрузится: класс nojs скрывает кнопку открыть/закрыть меню,
  меню отображается открытым, добавляем класс site-list--closed, чтобы скрыть меню.
  */

  burgerButton.classList.remove('burger-button--nojs');
  burgerButton.classList.remove('burger-button--close');
  listToggle.classList.add('site-list--closed');

  burgerButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    // Переключение кнопки и списка меню без анимации
    // burgerButton.classList.toggle('burger-button--close');
    // listToggle.classList.toggle('site-list--closed');

    if (listToggle.classList.contains('site-list--closed')) {
      burgerButton.classList.add('burger-button--close');
      listToggle.classList.remove('site-list--closed');
      listToggle.style.height = 'auto';

      let height = `${listToggle.clientHeight}px`;

      listToggle.style.height = '0px';

      setTimeout(() => {
        listToggle.style.height = height;
      }, 20);
    } else {
      burgerButton.classList.remove('burger-button--close');
      listToggle.style.height = '0px';

      listToggle.addEventListener('transitionend', () => {
        listToggle.classList.add('site-list--closed');
      }, {
        once: true,
      });
    }
  });
});
