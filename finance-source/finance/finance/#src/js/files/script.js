
// Скролл
const anchors = document.querySelectorAll('a[href*="#"]')

for (let anchor of anchors) {
	anchor.addEventListener('click', function (e) {
		e.preventDefault()

		const blockID = anchor.getAttribute('href').substr(1)

		document.getElementById(blockID).scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		})
	})
}

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

// Видео блок - Who
$('.bottom-who__link').parent().click(function () {

	if ($(this).children(".bottom-who__link").get(0).paused) {
		$(this).children(".bottom-who__link").get(0).play();
		$(this).children(".bottom-who__play").fadeOut();

	} else {
		$(this).children(".bottom-who__link").get(0).pause();

		$(this).children(".bottom-who__play").fadeIn();

	}

});