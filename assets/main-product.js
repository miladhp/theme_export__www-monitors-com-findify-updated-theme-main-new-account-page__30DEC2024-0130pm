/* Product custom tabs click functionality start */
$(document).ready(function() {
  $('.product-custom-tab').each(function(index, productCustomTab) {
    $(productCustomTab).click(function(event) {
      event.preventDefault();
      let currentElementId = $(productCustomTab).attr('id');
      let targetElementId = $(productCustomTab).attr('data-target-id');
  
      $('.product-custom-tab').each(function(index, element) {
        if ($(element).attr('id') !== currentElementId) {
          if ($(element).hasClass('active')) {
            $(element).removeClass('active');
          }
        } else {
          if (!$(element).hasClass('active')) {
            $(element).addClass('active');
          }
        }
      });

      // Add condition for techspecs tab
      if (currentElementId === 'techTab') {
          $('#expandBtn').click();
      }
  
      let fixedHeaderHeight = 146; // Adjust this selector based on fixed header element
  
      if ($(`#${targetElementId}`).length) {
        let offset = $(`#${targetElementId}`).offset().top;
  
        if (fixedHeaderHeight) {
          offset -= fixedHeaderHeight;
        }
  
        $('html, body').animate({ scrollTop: offset }, 500); // Use animate to smoothly scroll to the target element
      } else {
        let customTabParentSection = $('#nonProfit_nav').closest('.shopify-section');
  
        if (customTabParentSection.length && targetElementId === 'Overview') {
          let customTabParentSectionId = customTabParentSection.attr('id');
          $(`#${customTabParentSectionId}`).nextAll('.shopify-section').each(function() {
            if ($(this).find('.custom-html-section').length || $(this).find('[data-section-type="image-with-text"]').length) {
              let offset = $(this).offset().top;
              console.log(`offset : ${offset}`);
  
              if (fixedHeaderHeight) {
                offset -= fixedHeaderHeight;
              }
  
              $('html, body').animate({ scrollTop: offset }, 500); // Use animate to smoothly scroll to the target element
              return false;
            }
          });
        }
      }
    });
  });

  $("#atuatc").click(function(e) {
    e.preventDefault();
    $('.gatc').click();
  });
});
/* Product custom tabs click functionality end */

/* On window resize change tech specs word accordingly start */
$(window).resize(function() {
  var mobileView = window.matchMedia("(max-width: 480px)");
  var productTechSpecsWord = mobileView.matches ? 'Specs' : 'Tech Specs';
  if ($('.tech-specs-word a').length) {
    $('.tech-specs-word a').text(productTechSpecsWord);
  }
});
/* On window resize change tech specs word accordingly end */

/* On scroll adjusting product custom tabs start */
/* On scroll adjusting product custom tabs start */
document.addEventListener('DOMContentLoaded', function() {
  var mobileView = window.matchMedia("(max-width: 480px)");
  if (mobileView.matches) {
    $('.tech-specs-word a').text('Specs');
  }

  var h = $('.sticky-cart-wrap').height();
  var summaries = $('.product_tab_wrap');

  

  if ($(window).width() <= 768) {
    var productTabWrap = $('.product_tab_wrap');
    var header = $('.header');
    var headerHeight = $('.header').height();
    var productTabWrapTop = Math.trunc(productTabWrap.offset().top);
    var isFixed = false; // variable to keep track of fixed position

    $(window).scroll(function() {
      var scrollTop = Math.trunc($(this).scrollTop());
       console.log("testing...",scrollTop)
      

      function isLandscape() {
        return window.matchMedia("(orientation: landscape)").matches;
      }
      
      // Check if the device is in landscape mode
      if (isLandscape()) {
        // Device is in landscape mode
        console.log("Device is in landscape mode");
        if(scrollTop > productTabWrapTop){
          productTabWrap.css({
          'position': 'fixed',
          'top': '0px',
          'margin-left': '0px',
          'width': '100%',
          'left': '40px',
          'margin-top': '0px'
        });
        }
        else{
          productTabWrap.css({
          'position': 'relative',
          'top': 'auto',
          'margin-left': 'auto',
          'width': 'auto',
          'margin-top': '0px'
        });
        }
        if (!header.hasClass('header--search-expanded') && scrollTop > productTabWrapTop - headerHeight && !isFixed) {
        isFixed = true;

        productTabWrap.css({
          'position': 'fixed',
          'top': '0px',
          'margin-left': '0px',
          'width': '100%',
          'left': '40px',
          'margin-top': '0px',
          'z-index': '90'
        });
      } 
        else if (scrollTop < productTabWrapTop && isFixed) {
        isFixed = false;

        productTabWrap.css({
          'position': 'relative',
          'top': 'auto',
          'margin-left': 'auto',
          'width': 'auto',
          'margin-top': '0px'
        });
      }
      } 
      else {
        // Device is in portrait mode
        console.log("Device is in portrait mode");
        if(scrollTop > productTabWrapTop){
         console.log("if 1");
          productTabWrap.css({
          'position': 'fixed',
          'top': headerHeight + 'px',
          'margin-left': '0px',
          'width': '100%',
          'left': '0px',
          'margin-top': '17px',
          'z-index': '9'
        });
        }
        else{
          console.log("if 2");
          productTabWrap.css({
          'position': 'relative',
          'top': 'auto',
          'margin-left': 'auto',
          'width': 'auto',
          'margin-top': '0px'
        });
        }
        // if (!header.hasClass('header--search-expanded') && scrollTop >= productTabWrapTop - headerHeight && !isFixed) {
        // isFixed = true;
        //   console.log("if 3");
        // productTabWrap.css({
        //   'position': 'fixed',
        //   'top': headerHeight + 'px',
        //   'margin-left': '0px',
        //   'width': '100%',
        //   'left': '0px',
        //   'margin-top': '17px',
        //   'z-index': '9'
        // });
      // } else if (scrollTop < productTabWrapTop && isFixed) {
      //     console.log("if 4");
      //   isFixed = false;
      //   productTabWrap.css({
      //     'position': 'relative',
      //     'top': 'auto',
      //     'margin-left': 'auto',
      //     'width': 'auto',
      //     'margin-top': '0px'
      //   });
      // }
      }
    });
  } else {
    summaries.scrollToFixed({
      marginTop: 75
    });
  }

  function checkPosition()
  {
    pos = 0;
    if (window.matchMedia('(max-width: 767px)').matches) {
      pos = $('.product-form__payment-container__sticky').offset().top + 15;
    } else {
      pos = $('.product-form__payment-container__sticky').offset().top - 70;
    }

    $('#stickySec').addClass('tab-static');

    $(window).scroll(function(){
      if ($('html').scrollTop() > pos) {
        $('.sticky-cart-wrap').addClass('fixed');
        $('body.template-product').addClass('chat-up');
        $('body.template-product').addClass('sticky-add');
        $('#stickySec').addClass('tab-fixed');
        $('#stickySec').removeClass('tab-static');
        $('.goesinstickyp').detach().appendTo('.thisisp');
      } else {
        $('.sticky-cart-wrap').removeClass('fixed');
        $('body.template-product').removeClass('chat-up');
        $('body.template-product').removeClass('sticky-add');
        $('#stickySec').removeClass('tab-fixed');
        $('#stickySec').addClass('tab-static');
        $('.goesinstickyp').detach().appendTo('.attachagainp');
      }
    });
  }

  checkPosition();
});

$(window).scroll(function() {
  //console.log(`scroll getting triggered 1`);
  $('.non_profit_navbar a').each(function(i) {
    //console.log(`scroll getting triggered 2`);
    var tabId = $(this).attr('data-target-id');
    var scrolltop = $(window).scrollTop() + 300;

    if ($(`#${tabId}`).length) {
      //console.log(`scroll getting triggered 3`);
      var offset = $(`#${tabId}`).offset().top;
      var offset2 = $(`#${tabId}`).offset().top + $(`#${tabId}`).innerHeight();
    } else {
      //console.log(`scroll getting triggered 4`);
      var customOffset = null, customOffset2 = null;

      var customTabParentSection = $('#nonProfit_nav').closest('.shopify-section');

      if (customTabParentSection.length && tabId === 'Overview') {
        var customTabParentSectionId = customTabParentSection.attr('id');
        $(`#${customTabParentSectionId}`).nextAll('.shopify-section').each(function() {
          if ($(this).find('.custom-html-section').length || $(this).find('[data-section-type="image-with-text"]').length) {
            customOffset = $(this).offset().top;
            customOffset2 = $(this).offset().top + $(this).innerHeight();
          }
        });
      }

      if (customOffset != null && customOffset2 != null) {
        offset = customOffset;
        offset2 = customOffset2;
      }
    }

    if (scrolltop > offset && scrolltop < offset2) {
      $('.non_profit_navbar a').removeClass('active');
      $('.non_profit_navbar a[data-target-id="'+tabId+'"]').addClass('active');
    }
  });
}).scroll();
/* On scroll adjusting product custom tabs end */
