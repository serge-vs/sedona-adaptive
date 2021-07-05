document.addEventListener('DOMContentLoaded', () => {
  const burgerButton = document.querySelector('.burger-button');
  const listToggle = document.querySelector('.site-list');
  const body = document.querySelector('body');

  // Проверка: является ли устройство мобильным (touchscreen), для отображения стрелок в меню
  let isMobile = false;

  if (navigator.userAgentData) {
    isMobile = navigator.userAgentData.mobile;
  }

  const isMobileOld = {
    Android() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows() {
      return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any() {
      return (isMobileOld.Android() || isMobileOld.BlackBerry() || isMobileOld.iOS()
      || isMobileOld.Opera() || isMobileOld.Windows());
    },
  };

  if (isMobile || isMobileOld.any()) {
    body.classList.add('touch');

    let arrowWrapper = document.querySelector('.js-arrow-wrapper');
    let arrows = document.querySelectorAll('.js-arrow');

    arrows.forEach((arrow) => {
      let thisArrow = arrow;
      let thisLink = arrow.previousElementSibling;
      let subMenu = arrowWrapper.nextElementSibling;

      thisLink.classList.add('link-parent');
      arrow.addEventListener('click', () => {
        subMenu.classList.toggle('open-menu');
        thisArrow.classList.toggle('active-arrow');
      });
    });
  } else { body.classList.add('mouse'); }

  /*
  Если JS не загрузится, класс nojs скрывает кнопку открыть/закрыть меню,
  меню отображается открытым. Класс site-list--closed скрывает меню.
  */

  burgerButton.classList.remove('burger-button--nojs');
  burgerButton.classList.remove('burger-button--close');
  listToggle.classList.add('site-list--closed');

  burgerButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    // Переключение кнопки и списка меню без анимации
    // burgerButton.classList.toggle('burger-button--close');
    // listToggle.classList.toggle('site-list--closed');

    // Переключение кнопки и списка меню c анимацией
    if (listToggle.classList.contains('site-list--closed')) {
      burgerButton.classList.add('burger-button--close');
      listToggle.classList.remove('site-list--closed');
      // listToggle.style.height = 'auto';

      // let height = `${listToggle.clientHeight}px`;

      // listToggle.style.height = '0px';

      // setTimeout(() => {
      //   listToggle.style.height = height;
      // }, 20);
    } else {
      burgerButton.classList.remove('burger-button--close');
      // listToggle.style.height = '0px';

      // listToggle.addEventListener('transitionend', () => {
      listToggle.classList.add('site-list--closed');
      // }, {
      //   once: true,
      // });
    }
  });
});
