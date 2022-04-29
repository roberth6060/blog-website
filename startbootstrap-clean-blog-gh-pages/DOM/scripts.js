/*!
* Start Bootstrap - Clean Blog v6.0.8 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', () => {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    const headerHeight = mainNav.clientHeight;
    window.addEventListener('scroll', function() {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if ( currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                console.log(123);
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove(['is-visible']);
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });
})

/* ====== Show older Posts ====== */
const loadmore = document.querySelector('#loadmore');
// const elementList = [...document.querySelectorAll('.cards .cards__item')];
const elementList = document.querySelectorAll('.cards .cards__item');
const elementListLength = elementList.length
console.log(elementListLength);
let currentItems = 3;
loadmore.addEventListener('click', (e) => {

    for (let i = currentItems; i < currentItems + 4; i++) {

        if (elementList[i]) {
            elementList[i].style.display = 'block';
        }
    }
    currentItems += 4;

});