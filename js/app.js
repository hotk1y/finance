
let ua = window.navigator.userAgent;
let msie = ua.indexOf("MSIE ");
let isMobile = {
   Android: function () { return navigator.userAgent.match(/Android/i); },
   BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
   iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
   Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
   Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
   any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};
function isIE() {
   ua = navigator.userAgent;
   var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
   return is_ie;
}
if (isIE()) {
   document.querySelector('html').classList.add('ie');
}
if (isMobile.any()) {
   document.querySelector('html').classList.add('_touch');
}

// Получить цифры из строки
//parseInt(itemContactpagePhone.replace(/[^\d]/g, ''))

function ibg() {
   if (isIE()) {
      let ibg = document.querySelectorAll("._ibg");
      for (var i = 0; i < ibg.length; i++) {
         if (ibg[i].querySelector('img') && ibg[i].querySelector('img').getAttribute('src') != null) {
            ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
         }
      }
   }
}
ibg();

window.addEventListener("load", function () {
   if (document.querySelector('.wrapper')) {
      setTimeout(function () {
         document.querySelector('.wrapper').classList.add('_loaded');
      }, 0);
   }
});

let unlock = true;

//Menu
let iconMenu = document.querySelector(".icon-menu");
iconMenu.addEventListener("click", function (e) {
   document.querySelector('.menu__body').classList.toggle('_active');
   iconMenu.classList.toggle('_active');
});

//Tabs
let tabs = document.querySelectorAll("._tabs");
for (let index = 0; index < tabs.length; index++) {
   let tab = tabs[index];
   let tabs_items = tab.querySelectorAll("._tabs-item");
   let tabs_blocks = tab.querySelectorAll("._tabs-block");
   for (let index = 0; index < tabs_items.length; index++) {
      let tabs_item = tabs_items[index];
      tabs_item.addEventListener("click", function (e) {
         for (let index = 0; index < tabs_items.length; index++) {
            let tabs_item = tabs_items[index];
            tabs_item.classList.remove('_active');
            tabs_blocks[index].classList.remove('_active');
         }
         tabs_item.classList.add('_active');
         tabs_blocks[index].classList.add('_active');
         e.preventDefault();
      });
   }
}
/*
Для родителя слойлеров пишем атрибут data-spollers
Для заголовков слойлеров пишем атрибут data-spoller
Если нужно включать\выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.
Например: 
data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

Если нужно что бы в блоке открывался болько один слойлер добавляем атрибут data-one-spoller
*/

// SPOLLERS
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
   // Получение обычных слойлеров
   const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
   });
   // Инициализация обычных слойлеров
   if (spollersRegular.length > 0) {
      initSpollers(spollersRegular);
   }

   // Получение слойлеров с медиа запросами
   const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
      return item.dataset.spollers.split(",")[0];
   });

   // Инициализация слойлеров с медиа запросами
   if (spollersMedia.length > 0) {
      const breakpointsArray = [];
      spollersMedia.forEach(item => {
         const params = item.dataset.spollers;
         const breakpoint = {};
         const paramsArray = params.split(",");
         breakpoint.value = paramsArray[0];
         breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
         breakpoint.item = item;
         breakpointsArray.push(breakpoint);
      });

      // Получаем уникальные брейкпоинты
      let mediaQueries = breakpointsArray.map(function (item) {
         return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
      });
      mediaQueries = mediaQueries.filter(function (item, index, self) {
         return self.indexOf(item) === index;
      });

      // Работаем с каждым брейкпоинтом
      mediaQueries.forEach(breakpoint => {
         const paramsArray = breakpoint.split(",");
         const mediaBreakpoint = paramsArray[1];
         const mediaType = paramsArray[2];
         const matchMedia = window.matchMedia(paramsArray[0]);

         // Объекты с нужными условиями
         const spollersArray = breakpointsArray.filter(function (item) {
            if (item.value === mediaBreakpoint && item.type === mediaType) {
               return true;
            }
         });
         // Событие
         matchMedia.addEventListener(function () {
            initSpollers(spollersArray, matchMedia);
         });
         initSpollers(spollersArray, matchMedia);
      });
   }
   // Инициализация
   function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach(spollersBlock => {
         spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
         if (matchMedia.matches || !matchMedia) {
            spollersBlock.classList.add('_init');
            initSpollerBody(spollersBlock);
            spollersBlock.addEventListener("click", setSpollerAction);
         } else {
            spollersBlock.classList.remove('_init');
            initSpollerBody(spollersBlock, false);
            spollersBlock.removeEventListener("click", setSpollerAction);
         }
      });
   }
   // Работа с контентом
   function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
      if (spollerTitles.length > 0) {
         spollerTitles.forEach(spollerTitle => {
            if (hideSpollerBody) {
               spollerTitle.removeAttribute('tabindex');
               if (!spollerTitle.classList.contains('_active')) {
                  spollerTitle.nextElementSibling.hidden = true;
               }
            } else {
               spollerTitle.setAttribute('tabindex', '-1');
               spollerTitle.nextElementSibling.hidden = false;
            }
         });
      }
   }
   function setSpollerAction(e) {
      const el = e.target;
      if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
         const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
         const spollersBlock = spollerTitle.closest('[data-spollers]');
         const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
         if (!spollersBlock.querySelectorAll('._slide').length) {
            if (oneSpoller && !spollerTitle.classList.contains('_active')) {
               hideSpollersBody(spollersBlock);
            }
            spollerTitle.classList.toggle('_active');
            _slideToggle(spollerTitle.nextElementSibling, 500);
         }
         e.preventDefault();
      }
   }
   function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
      if (spollerActiveTitle) {
         spollerActiveTitle.classList.remove('_active');
         _slideUp(spollerActiveTitle.nextElementSibling, 500);
      }
   }
}

// Скролл
// const anchors = document.querySelectorAll('a[href*="#"]')
// for (let anchor of anchors) {
//    anchor.addEventListener('click', function (e) {
//       e.preventDefault()

//       const blockID = anchor.getAttribute('href').substring(1, 2)

//       document.getElementById(blockID).scrollIntoView({
//          behavior: 'smooth',
//          block: 'start'
//       })
//    })
// }

// Кнопка наверх
$('.back-to-top').click(function () {
   $('body,html').animate({ scrollTop: 0 }, 600);
});

$(window).scroll(function () {
   let scrolled = $(window).scrollTop();

   if (scrolled > 350) {
      $('.back-to-top').addClass('active');
   } else {
      $('.back-to-top').removeClass('active');
   }
});

// Видео блок - Who ===============================================
const videoWho = document.querySelector('.bottom-who__video');
const videoPlay = document.querySelector('.bottom-who__video_play');
videoPlay.addEventListener('click', function () {
   if (videoWho.paused) {
      videoPlay.style.display = 'none';
      videoWho.controls = 'controls';
      videoWho.play();
   }
})

// Email validation ========================================
function emailTest(input) {
   return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}

// Form validation ========================================
//let btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');
let forms = document.querySelectorAll('form');
if (forms.length > 0) {
   for (let index = 0; index < forms.length; index++) {
      const el = forms[index];
      el.addEventListener('submit', form_submit);
   }
}
async function form_submit(e) {
   let btn = e.target;
   let form = btn.closest('form');
   let error = form_validate(form);
   if (error == 0) {
      let formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
      let formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
      const message = form.getAttribute('data-message');
      const ajax = form.getAttribute('data-ajax');

      //SendForm
      if (ajax) {
         e.preventDefault();
         let formData = new FormData(form);
         form.classList.add('_sending');
         let response = await fetch(formAction, {
            method: formMethod,
            body: formData
         });
         if (response.ok) {
            let result = await response.json();
            form.classList.remove('_sending');
            if (message) {
               popup_open(message + '-message');
            }
            form_clean(form);
         } else {
            alert("Ошибка");
            form.classList.remove('_sending');
         }
      }
      // If test
      if (form.hasAttribute('data-test')) {
         e.preventDefault();
         if (message) {
            popup_open(message + '-message');
         }
         form_clean(form);
      }
   } else {
      let form_error = form.querySelectorAll('._error');
      if (form_error && form.classList.contains('_goto-error')) {
         _goto(form_error[0], 1000, 50);
      }
      e.preventDefault();
   }
}
function form_validate(form) {
   let error = 0;
   let form_req = form.querySelectorAll('._req');
   if (form_req.length > 0) {
      for (let index = 0; index < form_req.length; index++) {
         const el = form_req[index];
         if (!_is_hidden(el)) {
            error += form_validate_input(el);
         }
      }
   }
   return error;
}
function form_validate_input(input) {
   let error = 0;
   let input_g_value = input.getAttribute('data-value');

   if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
      if (input.value != input_g_value) {
         let em = input.value.replace(" ", "");
         input.value = em;
      }
      if (email_test(input) || input.value == input_g_value) {
         form_add_error(input);
         error++;
      } else {
         form_remove_error(input);
      }
   } else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
      form_add_error(input);
      error++;
   } else {
      if (input.value == '' || input.value == input_g_value) {
         form_add_error(input);
         error++;
      } else {
         form_remove_error(input);
      }
   }
   return error;
}
function form_add_error(input) {
   input.classList.add('_error');
   input.parentElement.classList.add('_error');

   let input_error = input.parentElement.querySelector('.form__error');
   if (input_error) {
      input.parentElement.removeChild(input_error);
   }
   let input_error_text = input.getAttribute('data-error');
   if (input_error_text && input_error_text != '') {
      input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
   }
}
function form_remove_error(input) {
   input.classList.remove('_error');
   input.parentElement.classList.remove('_error');

   let input_error = input.parentElement.querySelector('.form__error');
   if (input_error) {
      input.parentElement.removeChild(input_error);
   }
}
function form_clean(form) {
   let inputs = form.querySelectorAll('input,textarea');
   for (let index = 0; index < inputs.length; index++) {
      const el = inputs[index];
      el.parentElement.classList.remove('_focus');
      el.classList.remove('_focus');
      el.value = el.getAttribute('data-value');
   }
   let checkboxes = form.querySelectorAll('.checkbox__input');
   if (checkboxes.length > 0) {
      for (let index = 0; index < checkboxes.length; index++) {
         const checkbox = checkboxes[index];
         checkbox.checked = false;
      }
   }
   let selects = form.querySelectorAll('select');
   if (selects.length > 0) {
      for (let index = 0; index < selects.length; index++) {
         const select = selects[index];
         const select_default_value = select.getAttribute('data-default');
         select.value = select_default_value;
         select_item(select);
      }
   }
}

//Placeholers
let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);

function inputs_init(inputs) {
   if (inputs.length > 0) {
      for (let index = 0; index < inputs.length; index++) {
         const input = inputs[index];
         const input_g_value = input.getAttribute('data-value');
         input_placeholder_add(input);
         if (input.value != '' && input.value != input_g_value) {
            input_focus_add(input);
         }
         input.addEventListener('focus', function (e) {
            if (input.value == input_g_value) {
               input_focus_add(input);
               input.value = '';
            }
            if (input.getAttribute('data-type') === "pass") {
               if (input.parentElement.querySelector('._viewpass')) {
                  if (!input.parentElement.querySelector('._viewpass').classList.contains('_active')) {
                     input.setAttribute('type', 'password');
                  }
               } else {
                  input.setAttribute('type', 'password');
               }
            }
            if (input.classList.contains('_date')) {
               /*
               input.classList.add('_mask');
               Inputmask("99.99.9999", {
                  //"placeholder": '',
                  clearIncomplete: true,
                  clearMaskOnLostFocus: true,
                  onincomplete: function () {
                     input_clear_mask(input, input_g_value);
                  }
               }).mask(input);
               */
            }
            if (input.classList.contains('_phone')) {
               //'+7(999) 999 9999'
               //'+38(999) 999 9999'
               //'+375(99)999-99-99'
               input.classList.add('_mask');
               Inputmask("+375 (99) 9999999", {
                  //"placeholder": '',
                  clearIncomplete: true,
                  clearMaskOnLostFocus: true,
                  onincomplete: function () {
                     input_clear_mask(input, input_g_value);
                  }
               }).mask(input);
            }
            if (input.classList.contains('_digital')) {
               input.classList.add('_mask');
               Inputmask("9{1,}", {
                  "placeholder": '',
                  clearIncomplete: true,
                  clearMaskOnLostFocus: true,
                  onincomplete: function () {
                     input_clear_mask(input, input_g_value);
                  }
               }).mask(input);
            }
            form_remove_error(input);
         });
         input.addEventListener('blur', function (e) {
            if (input.value == '') {
               input.value = input_g_value;
               input_focus_remove(input);
               if (input.classList.contains('_mask')) {
                  input_clear_mask(input, input_g_value);
               }
               if (input.getAttribute('data-type') === "pass") {
                  input.setAttribute('type', 'text');
               }
            }
         });
         if (input.classList.contains('_date')) {
            const calendarItem = datepicker(input, {
               customDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
               customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
               overlayButton: 'Применить',
               overlayPlaceholder: 'Год (4 цифры)',
               startDay: 1,
               formatter: (input, date, instance) => {
                  const value = date.toLocaleDateString()
                  input.value = value
               },
               onSelect: function (input, instance, date) {
                  input_focus_add(input.el);
               }
            });
            const dataFrom = input.getAttribute('data-from');
            const dataTo = input.getAttribute('data-to');
            if (dataFrom) {
               calendarItem.setMin(new Date(dataFrom));
            }
            if (dataTo) {
               calendarItem.setMax(new Date(dataTo));
            }
         }
      }
   }
}
function input_placeholder_add(input) {
   const input_g_value = input.getAttribute('data-value');
   if (input.value == '' && input_g_value != '') {
      input.value = input_g_value;
   }
}
function input_focus_add(input) {
   input.classList.add('_focus');
   input.parentElement.classList.add('_focus');
}
function input_focus_remove(input) {
   input.classList.remove('_focus');
   input.parentElement.classList.remove('_focus');
}
function input_clear_mask(input, input_g_value) {
   input.inputmask.remove();
   input.value = input_g_value;
   input_focus_remove(input);
}

//ScrollOnClick (Simple)
let gotoLinks = document.querySelectorAll('._goto');
if (gotoLinks) {
   for (let i = 0; i < gotoLinks.length; i++) {
      let gotoLink = gotoLinks[i];
      gotoLink.addEventListener('click', function (e) {
         let targetBlockClass = gotoLink.getAttribute('href').replace('#', '');
         let targetBlock = document.querySelector('.' + targetBlockClass);
         _goto(targetBlock, 300);
         document.querySelector('.menu__body').classList.remove('_active');
         iconMenu.classList.remove('_active');
         e.preventDefault();
      });
   }
}
function _goto(targetBlock, speed, offset = 0) {
   let header = '';
   //OffsetHeader
   //if (window.innerWidth < 992) {
   //	header = 'header';
   //}
   let options = {
      speedAsDuration: true,
      speed: speed,
      header: header,
      offset: offset,
      easing: 'easeOutQuad',
   };
   let src = new SmoothScroll();
   src.animateScroll(targetBlock, '', options);
}
