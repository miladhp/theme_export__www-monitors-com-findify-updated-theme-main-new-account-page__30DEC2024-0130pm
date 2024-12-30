// document.querySelectorAll('.tab-item').forEach(item => {
//     item.addEventListener('click', function() {
//         document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
//         this.classList.add('active');
//         document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
//         const target = this.getAttribute('data-target');
//         document.querySelector(target).classList.add('active');
//     });
// });


document.querySelectorAll('.tab-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        const target = this.getAttribute('data-target');
        document.querySelector(target).classList.add('active');
        
        const tabHash = target.replace('#', '');
        
        const currentUrl = new URL(window.location.href);
        const queryString = currentUrl.search; // Get existing query parameters (e.g., ?page=5)
        
        history.pushState(null, null, `/account#${tabHash}`);
    });
});

function openTabFromHash() {
    let hash = window.location.hash;
    if (!hash) {
        hash = '#profile';
    }
    const tabItem = document.querySelector(`.tab-item[data-target="${hash}"]`);
    console.log(tabItem);
    if (tabItem) {
        tabItem.click();
    }
}

window.addEventListener('load', openTabFromHash);
window.addEventListener('popstate', openTabFromHash);


window.addEventListener('load', function() {
    const loader = document.querySelector('.custom-acc-loader');
    if (loader) {
        loader.style.display = 'none';
    }

    const content = document.querySelector('.content.cust-acc-content');
    if (content) {
        content.style.display = 'block';
    }
});


$('.slick-slider').slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 2,
    arrows: false,
});

