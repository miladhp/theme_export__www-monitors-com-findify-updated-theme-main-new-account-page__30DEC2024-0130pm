$(document).ready(function () {
  $("#navigation a.navigation-link").removeAttr("target");
  $(".navigation-tabs-nav-item a").removeAttr("target");

  $(" a.navigation-link").click(function (e) {
    var target_val = $(this).attr("target");
    if (target_val == "_blank") {
      $(this).removeAttr("target");
      return false;
    }
  });

  $(".navigation-tabs-nav-item a").click(function (e) {
    var target_val = $(this).attr("target");
    if (target_val == "_blank") {
      $(this).removeAttr("target"); 
      return false;
    }
  });
});


// custom code for add to compare checked if findify filter is applied!

setInterval(() => {
  const section = document.querySelector('.findify-products-section');
  
  if (section) {
      const productListStatus = section.getAttribute('data-product-list');

      if (productListStatus === 'false') {
          const productCards = Array.from(section.querySelectorAll('.findify-product-card'));
          const storedData = localStorage.getItem('MONITORS_PRODUCT_COMPARE');
          
          if (storedData) {
              const storedProductIds = JSON.parse(storedData).map(item => item.split('_')[0]);
           
              productCards.forEach(card => {
                  const cardId = card.getAttribute('id');
                  if (storedProductIds.includes(cardId)) {
                      // console.log('Matched product card:', card);
                      const checkbox = card.querySelector('.add_to_compare_on_collections_page .SPCMP_Add');
                      if (checkbox && !checkbox.checked) {
                          checkbox.checked = true;
                      }
                  }
              });
          }
          section.setAttribute('data-product-list', 'true');
      }
  }
}, 1000); 

// end code here