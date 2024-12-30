! function(e) {
    let monitorsProductCompareShop = Shopify.shop;
    monitorsProductCompareShop = 'bayland.myshopify.com';
    let monitorsProductCompareConfigURL = 'https://developmentquote.monitors.com/shopify/compare/shop-config';

    let monitorsCompareAppConfig = {} || monitorsCompareAppConfig;

    monitorsCompareAppConfig['monitorsProductCompareShop'] = monitorsProductCompareShop;
    monitorsCompareAppConfig['monitorsProductCompareConfigURL'] = monitorsProductCompareConfigURL;
    monitorsCompareAppConfig['monitorsCompareStorageName'] = "MONITORS_PRODUCT_COMPARE";
    monitorsCompareAppConfig['montorsCaWrapperId'] = "monitors_ca_wrapper";
    monitorsCompareAppConfig['monitorsCaContainerId'] = "monitors_ca_container";
    monitorsCompareAppConfig['monitorsCaIcontainerId'] = "monitors_ca_icontainer";
    monitorsCompareAppConfig['monitorsCaFlapTabId'] = "monitors_ca_flap_tab";
    monitorsCompareAppConfig['monitorsProductCompareCount'] = "monitors_product_compare_count";
    monitorsCompareAppConfig['monitorsComparePopupOpen'] = false;

    monitorsCompareAppConfig['monitosMaxAllowedCompare'] = 0;
    monitorsCompareAppConfig['monitorsProductCompareDetailsURL'] = "";
    monitorsCompareAppConfig['monitorsProductCompareResultURL'] = "";

    let monitorsCompareElements = {
        selectors: {
            checkboxLabel: ".SPCMP_chk_lbl",
            checkboxSpan: ".SPCMP_Add_span",
            checkboxInput: ".SPCMP_Add"
        },
        message: {
            checkboxCheckedLabel: "Added To Compare",
            checkboxUncheckedLabel: "Add To Compare"
        }
    };

    monitorsCompareAppConfig['monitorsCompareElements'] = monitorsCompareElements;


    getDataUsingAjax(
        function(response) {
            if ((response.status.toUpperCase() == 'OK') &&
                response.data) {
                if (response.data.max_allowed_product_compare &&
                    response.data.compare_product_details_url &&
                    response.data.compare_result_url) {
                    monitorsCompareAppConfig['monitosMaxAllowedCompare'] = response.data.max_allowed_product_compare;
                    monitorsCompareAppConfig['monitorsProductCompareDetailsURL'] = response.data.compare_product_details_url;
                    monitorsCompareAppConfig['monitorsProductCompareResultURL'] = response.data.compare_result_url;
                    // localStorage.setItem('monitorsCompareAppConfig', JSON.stringify(monitorsCompareAppConfig));
                    initMonitorsProductCompareApp(monitorsCompareAppConfig);
                }
            }
        },
        monitorsProductCompareConfigURL,
        'POST',
        {
            'payload': JSON.stringify({
                'shop': monitorsProductCompareShop
            })
        }
    );
}();

function initMonitorsProductCompareApp(monitorsCompareAppConfig)
{
    let monitorsCompareStorageName = monitorsCompareAppConfig['monitorsCompareStorageName'];
    let montorsCaWrapperId = monitorsCompareAppConfig['montorsCaWrapperId'];
    let monitorsCaContainerId = monitorsCompareAppConfig['monitorsCaContainerId'];
    let monitorsCaIcontainerId = monitorsCompareAppConfig['monitorsCaIcontainerId'];
    let monitorsCaFlapTabId = monitorsCompareAppConfig['monitorsCaFlapTabId'];
    let monitorsProductCompareCount = monitorsCompareAppConfig['monitorsProductCompareCount'];
    let monitorsComparePopupOpen = monitorsCompareAppConfig['monitorsComparePopupOpen'];
    let monitorsProductCompareCount1 = monitorsCompareAppConfig['monitosMaxAllowedCompare'];

    let montorsCaWrapper = document.querySelector(montorsCaWrapperId);

    if (!montorsCaWrapper || null == montorsCaWrapper) {
        let montorsCaWrapperDiv = document.createElement("div");

        montorsCaWrapperDiv.setAttribute("id", montorsCaWrapperId);
        montorsCaWrapperDiv.classList.add("ca_container_main"); // add class 'ca_container_main' to the div
        document.body.appendChild(montorsCaWrapperDiv);
        document.getElementById(montorsCaWrapperId).innerHTML = productCompareListUiInit(monitorsCompareAppConfig['monitosMaxAllowedCompare']);    
        compareSlickSlide();
        initComparePopup(monitorsCompareAppConfig);
        var collectionValue = sessionStorage.getItem('currentPageCollectionId');
        var isCollection = sessionStorage.getItem('isCollection');
        if(collectionValue == '159736627289' || isCollection == 'false'){
          renderPreviousSession(monitorsCompareAppConfig);
        }
        else{
          var checkFindifyCollection = setInterval(function() {
          console.log('checking');
          var findifyCollectionody = document.querySelectorAll('.findify-body');
          if(findifyCollectionody.length){
            console.log('findify found');
            renderPreviousSession(monitorsCompareAppConfig);
            clearInterval(checkFindifyCollection);
          }      
         }, 1000);
       }
    }

    let monitorsCompareElements = {
        selectors: {
            checkboxLabel: ".SPCMP_chk_lbl",
            checkboxSpan: ".SPCMP_Add_span",
            checkboxInput: ".SPCMP_Add"
        },
        message: {
            checkboxCheckedLabel: "Added To Compare",
            checkboxUncheckedLabel: "Add To Compare"
        }
    };

    document.addEventListener("click", function(e){
        if (e.target.classList.contains('monitors_ca_idelete')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            let compareProductId = e.target.getAttribute("spcmp_pid");
            let compareVariantId = e.target.getAttribute("spcmp_vid");

            let productVariantString = `${compareProductId}_${compareVariantId}`;

            removeProductFromCompareList(monitorsCompareAppConfig, productVariantString);

            if (e.target.dataset.view === 'mobile') {
              let removeProductIndex = document.querySelector(`.monitors_ca_item_${productVariantString}`).getAttribute('data-slick-index');
              $('#monitors_ca_icontainer').slick('slickRemove', removeProductIndex);
              // document.querySelector(`.monitors_ca_item_${productVariantString}`).remove();
            }

            else{
              document.getElementById(`monitors_ca_item_${productVariantString}`).remove();
            }

            renderProductCompareCount(monitorsCompareAppConfig);

            showHideProductCompareList(monitorsCompareAppConfig);

            let targetCheckboxSelector = `input[type='checkbox'][name='SPCMP_chk'][spcmp_pid='${compareProductId}'][spcmp_vid='${compareVariantId}']`;

            if (document.querySelectorAll(targetCheckboxSelector).length) {
                document.querySelector(targetCheckboxSelector).checked = false;
            }

            var compareListItems = document.querySelectorAll('.monitors_ca_item:not(.empty)');
            var numCompareListItems = compareListItems.length;

            const isMobile = window.matchMedia("(max-width: 768px)").matches;

            if (isMobile) {

               $('.slick-slide').each(function(){
                      if($(this).hasClass('empty')){
                        let slickIndex = $(this).attr('data-slick-index');
                         $('#monitors_ca_icontainer').slick('slickRemove', slickIndex);

                      }
                    });

               if(monitorsProductCompareCount1 == 4)
              {
                 // Adjust number of empty divs based on number of products added
                if (numCompareListItems == 0) {
                   // $('#monitors_ca_icontainer').slick('unslick');
                   $('#monitors_ca_icontainer').slick('refresh');
                  }
                  else if (numCompareListItems == 1) {
                      document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                        div.remove();
                      });
                      $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"><p>Please select atleast 2 products to compare </p></div>');
                      $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                      $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                  } else if (numCompareListItems == 2) {
                      document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                      $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                      $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                  } else if (numCompareListItems == 3) {
                      document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                      $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                  } else if (numCompareListItems == 4) {
                    document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                  }
              }

              if(monitorsProductCompareCount1 == 3)
              {
                 // Adjust number of empty divs based on number of products added
                if (numCompareListItems == 0) {
                   // $('#monitors_ca_icontainer').slick('unslick');
                   $('#monitors_ca_icontainer').slick('refresh');
                  }
                  else if (numCompareListItems == 1) {
                      document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                        div.remove();
                      });
                      $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"><p>Please select atleast 2 products to compare </p></div>');
                      $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                  } else if (numCompareListItems == 2) {
                      document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                      $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                  } else if (numCompareListItems == 3) {
                      document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                  }
              }

              if(monitorsProductCompareCount1 == 2)
              {
                 // Adjust number of empty divs based on number of products added
                if (numCompareListItems == 0) {
                   // $('#monitors_ca_icontainer').slick('unslick');
                   $('#monitors_ca_icontainer').slick('refresh');
                  }
                  else if (numCompareListItems == 1) {
                      document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                        div.remove();
                      });
                      $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"><p>Please select atleast 2 products to compare </p></div>');
                  } else if (numCompareListItems == 2) {
                      document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                  }
              }
            } else{
              if(monitorsProductCompareCount1 == 4)
              {
                 // Adjust number of empty divs based on number of products added
                if (numCompareListItems == 0) {
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                          div.remove();
                      });
                    positionChatButton();
                  }
                  else if (numCompareListItems == 1) {
                      document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                          div.remove();
                      });
                      document.getElementById(monitorsCaIcontainerId).innerHTML += `
                      <div class="monitors_ca_item empty"><p class="atleast_text"> Please select at least two products to compare </p></div>
                      <div class="monitors_ca_item empty"></div>
                      <div class="monitors_ca_item empty"></div>`;
                  } else if (numCompareListItems == 2) {
                      document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                          div.remove();
                      });
                      document.getElementById(monitorsCaIcontainerId).innerHTML += `
                      <div class="monitors_ca_item empty"></div>
                      <div class="monitors_ca_item empty"></div>`;
                  } else if (numCompareListItems == 3) {
                      document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                          div.remove();
                      });
                      document.getElementById(monitorsCaIcontainerId).innerHTML += `
                      <div class="monitors_ca_item empty"></div>`;
                  } else if (numCompareListItems == 4) {
                      document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                          div.remove();
                      });
                  }
              }
              if(monitorsProductCompareCount1 == 3){
                // Adjust number of empty divs based on number of products added
                if (numCompareListItems == 0) {
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                          div.remove();
                      });
                    positionChatButton();
                  }
                  else if (numCompareListItems == 1) {
                      document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                          div.remove();
                      });
                      document.getElementById(monitorsCaIcontainerId).innerHTML += `
                      <div class="monitors_ca_item empty"><p class="atleast_text"> Please select at least two products to compare </p></div>
                      <div class="monitors_ca_item empty"></div>`;
                  } else if (numCompareListItems == 2) {
                      document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                          div.remove();
                      });
                      document.getElementById(monitorsCaIcontainerId).innerHTML += `
                      <div class="monitors_ca_item empty"></div>`;
                  } else if (numCompareListItems == 3) {
                      document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                          div.remove();
                      });
                  }
              }

              if(monitorsProductCompareCount1 == 2){

                // Adjust number of empty divs based on number of products added
                if (numCompareListItems == 0) {
                      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                      emptyDivs.forEach(function(div) {
                          div.remove();
                      });
                   positionChatButton();
                  } else if (numCompareListItems == 1) {
                    document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
                    document.getElementById(monitorsCaIcontainerId).innerHTML += `
                      <div class="monitors_ca_item empty"><p class="atleast_text"> Please select at least two products to compare </p></div>`;
                  } else if (numCompareListItems == 2) {
                    document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                    let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                    emptyDivs.forEach(function(div) {
                    div.remove();
                    });
                }
              }
            }
            return;
        } else if (e.target.classList.contains('monitors_ca_idelete_new')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            let compareProductId = e.target.getAttribute("spcmp_pid");
            let compareVariantId = e.target.getAttribute("spcmp_vid");

            const isMobile = window.matchMedia("(max-width: 768px)").matches;

            if (isMobile) {
             var removeIndex = e.target.closest('.sp_product_con').parentNode.parentNode.getAttribute('data-slick-index');
             $('#sp_product').slick('slickRemove', removeIndex);
             $('#sp_product').slick('refresh'); 
            } 
            else{
             e.target.closest('.sp_product_con').remove(); 
            }
            if (!$('.sp_product_con').length) {
              $('.close-btn').trigger('click');
            }

            let targetFooterTile = `.monitors_ca_idelete[spcmp_pid="${compareProductId}"][spcmp_vid="${compareVariantId}"]`;

            if (document.querySelectorAll(targetFooterTile).length) {
              //document.querySelector(targetFooterTile).click();
              // let targetFooterTileElements = document.querySelectorAll(targetFooterTile);
              // targetFooterTileElements.forEach(element => {
              //   console.log(element);
              //   try {
              //     element.click();
              //   } catch (err) {
              //     console.log('click error');
              //     console.log(err);
              //   }
              // });
              let compareView = 'desktop';
              const isMobile = window.matchMedia("(max-width: 768px)").matches;
              if (isMobile) {
                compareView = 'mobile';
              }
              removeCompareFooterTile(monitorsCompareAppConfig, compareProductId, compareVariantId, compareView);
            }

            return;
        }

        let targetCompareElement = e.target.closest(monitorsCompareElements.selectors.checkboxInput);

        if (targetCompareElement) {
            productCompareCheckboxClickTrigger(monitorsCompareAppConfig, targetCompareElement);
        }
    });
}

function productCompareListUiInit(monitosMaxAllowedCompare)
{
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
    // const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {

     return `<div class="monitors_ca_container ca_bottom" id="monitors_ca_container" style="display: none;">
        <div class="monitors_ca_content monitors_ca_close compare_main_container">
         <div class="monitors_ca_content_wrap">
          <div class="compare_products_mob">
             <p class="ca_com_text">Compare up to ${monitosMaxAllowedCompare} products</p>
          </div>
            <div class="monitors_ca_icontainer compare_products_container" id="monitors_ca_icontainer"></div>
            <div class="compare-controls">
                <a href="javascript:void(0);" class="compare-button com-page-btn btn" id="monitors_ca_compare_products" title="Compare Product">Compare products <span id="productsToCompare" class="ca_com_text mobile_text"></span></a>
                <a href="javascript:void(0);" class="compare-disabled-btn btn" id="monitors_ca_compare_disabled" title="Compare Product" style="display:none;">Compare <span id="productsToCompare" class="ca_com_text mobile_text"></span></a>
                <a href="javascript:void(0);" class="ca_Rmvall" title="Remove All Product">Clear All</a>
                <span class="close ca_tab ca_tab_new" id="monitors_ca_tab" title="Hide">
                  <span class="SP_triangle">
                   <svg focusable="false" class="icon icon--arrow-bottom" viewBox="0 0 12 8" role="presentation">
                    <path stroke="currentColor" stroke-width="2" d="M10 2L6 6 2 2" fill="none" stroke-linecap="square"></path>
                   </svg>
                  </span>
                </span>
            </div>
            <span class="close ca_tab" id="monitors_ca_tab" title="Hide">
                <span class="SP_triangle">
                  <svg focusable="false" class="icon icon--arrow-bottom" viewBox="0 0 12 8" role="presentation">
                    <path stroke="currentColor" stroke-width="2" d="M10 2L6 6 2 2" fill="none" stroke-linecap="square"></path>
                  </svg>
                </span>
            </span>
           </div>
        </div>
        <div class="ca_flap ca_tab" title="Compare Tab" id="monitors_ca_flap_tab" style="display: none;">
         <div class="ca_flap_content">
           <div class="ca_flap_content_left">
            <span>Compare Up to</span>
            <span class="SP_CA_Count" id="monitors_product_compare_count"></span><span>Products</span>
           </div>
           <div class="ca_flap_content_right">
            <span class="SP_triangle">
              <svg focusable="false" class="icon icon--arrow-bottom" viewBox="0 0 12 8" role="presentation">
                <path stroke="currentColor" stroke-width="2" d="M10 2L6 6 2 2" fill="none" stroke-linecap="square"></path>
              </svg>
            </span>
           </div>
          </div>
        </div>
    </div>`;

  } else{

    return `<div class="monitors_ca_container ca_bottom" id="monitors_ca_container" style="display: none;">
        <div class="monitors_ca_content monitors_ca_close compare_main_container">
         <div class="monitors_ca_content_wrap">
          <div class="compare_products_desk">
             <p class="ca_com_text">Compare up to ${monitosMaxAllowedCompare} products</p>
          </div>
            <div class="monitors_ca_icontainer compare_products_container" id="monitors_ca_icontainer"></div>
            <div class="compare-controls">
                <div class="compare_products_desk new">
                   <p class="ca_com_text">Compare up to ${monitosMaxAllowedCompare} products</p>
                </div>
                <a href="javascript:void(0);" class="compare-button com-page-btn btn" id="monitors_ca_compare_products" title="Compare Product">Compare</a>
                <a href="javascript:void(0);" class="compare-disabled-btn btn" id="monitors_ca_compare_disabled" title="Compare Product" style="display:none;">Compare</a>
                <a href="javascript:void(0);" class="ca_Rmvall" title="Remove All Product">Clear All</a>
                <p id="productsToCompare" class="ca_com_text"></p>
                <span class="close ca_tab" id="monitors_ca_tab" title="Hide">
                 <span class="SP_triangle">
                  <svg focusable="false" class="icon icon--arrow-bottom" viewBox="0 0 12 8" role="presentation">
                    <path stroke="currentColor" stroke-width="2" d="M10 2L6 6 2 2" fill="none" stroke-linecap="square"></path>
                  </svg>
                 </span>
                </span>
            </div>
           </div>
        </div>
        <div class="ca_flap ca_tab" title="Compare Tab" id="monitors_ca_flap_tab" style="display: none;">
         <div class="ca_flap_content">
           <div class="ca_flap_content_left">
            <span>Compare Upto</span>
            <span class="SP_CA_Count" id="monitors_product_compare_count"></span><span>Products</span>
           </div>
           <div class="ca_flap_content_right">
            <span class="SP_triangle">
              <svg focusable="false" class="icon icon--arrow-bottom" viewBox="0 0 12 8" role="presentation">
                <path stroke="currentColor" stroke-width="2" d="M10 2L6 6 2 2" fill="none" stroke-linecap="square"></path>
              </svg>
            </span>
           </div>
          </div>
        </div>
    </div>`;
  }
}

function initComparePopup(monitorsCompareAppConfig)
{
    let monitorsCaFlapTabId = monitorsCompareAppConfig['monitorsCaFlapTabId'];
    let monitorsProductCompareShop = monitorsCompareAppConfig['monitorsProductCompareShop'];

    document.querySelector('.monitors_ca_container').addEventListener('click', function(e){
        let monitorsCaContent = document.querySelector('.monitors_ca_content');

        if (monitorsCaContent.classList.contains('monitors_ca_close')) {
            monitorsCaContent.classList.remove('monitors_ca_close');
            monitorsCaContent.classList.add('monitors_ca_open');
            document.getElementById('monitors_ca_container').classList.remove('ca_bottom_close');
            document.getElementById('monitors_ca_container').classList.add('ca_bottom_open');
            document.getElementById(monitorsCaFlapTabId).style.display = "none";

            const chatButton = document.getElementById("dummy-chat-button-iframe");
            const monitorsContainer = document.getElementById("monitors_ca_container");

            if (chatButton && monitorsContainer) {
              const monitorsHeight = monitorsContainer.offsetHeight;
              const windowHeight = window.innerHeight;
              const chatButtonHeight = chatButton.offsetHeight;
              const chatButtonBottomMargin = 24;

              chatButton.style.bottom = "unset";
              chatButton.style.top = `${windowHeight - monitorsHeight - chatButtonHeight - chatButtonBottomMargin}px`;
            }

            const chatButtonOpen = document.getElementById("ShopifyChat");
            if (chatButtonOpen && monitorsContainer) {
              const monitorsHeight = monitorsContainer.offsetHeight;
              const windowHeight = window.innerHeight;
              const chatButtonOpenHeight = chatButtonOpen.offsetHeight;
              const chatButtonOpenBottomMargin = 24;

              chatButtonOpen.style.bottom = "unset";
              chatButtonOpen.style.top = `${windowHeight - monitorsHeight - chatButtonOpenHeight - chatButtonOpenBottomMargin}px`;
            }
        }
    });

    document.querySelector('#monitors_ca_tab').addEventListener('click', function(e){
        let monitorsCaContent = document.querySelector('.monitors_ca_content');

        if (monitorsCaContent.classList.contains('monitors_ca_open')) {
            monitorsCaContent.classList.remove('monitors_ca_open');
            monitorsCaContent.classList.add('monitors_ca_close');
            document.getElementById('monitors_ca_container').classList.remove('ca_bottom_open');
            document.getElementById('monitors_ca_container').classList.add('ca_bottom_close');
            document.getElementById(monitorsCaFlapTabId).style.display = "block";

            const chatButton = document.getElementById("dummy-chat-button-iframe");
            const monitorsContainer = document.getElementById("monitors_ca_container");

            if (chatButton && monitorsContainer) {
              const monitorsHeight = monitorsContainer.offsetHeight;
              const windowHeight = window.innerHeight;
              const chatButtonHeight = chatButton.offsetHeight;
              const chatButtonBottomMargin = 24;

              chatButton.style.bottom = "unset";
              chatButton.style.top = `${windowHeight - monitorsHeight - chatButtonHeight - chatButtonBottomMargin}px`;
            }

            const chatButtonOpen = document.getElementById("ShopifyChat");
            if (chatButtonOpen && monitorsContainer) {
              const monitorsHeight = monitorsContainer.offsetHeight;
              const windowHeight = window.innerHeight;
              const chatButtonOpenHeight = chatButtonOpen.offsetHeight;
              const chatButtonOpenBottomMargin = 24;

              chatButtonOpen.style.bottom = "unset";
              chatButtonOpen.style.top = `${windowHeight - monitorsHeight - chatButtonOpenHeight - chatButtonOpenBottomMargin}px`;
            }
        }

        e.stopPropagation();
    });

    document.querySelector('.ca_Rmvall').addEventListener('click', function(e) {
      let savedProductList = getSavedProductCompareList(monitorsCompareAppConfig);
    
      let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
      emptyDivs.forEach(function(div) {
        div.remove();
      });
    
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
      if (isMobile) {
        $('.slick-slide').each(function(){
            let slickIndex = $(this).attr('data-slick-index');
             $('#monitors_ca_icontainer').slick('slickRemove', slickIndex);
        });
      } else {
        savedProductList.forEach(function(productVariantString) {
          let productElement = document.getElementById(`monitors_ca_item_${productVariantString}`);
          if (productElement) {
            productElement.remove();
          }
        });
      }
    
      savedProductList.forEach(function(productVariantString) {
        removeProductFromCompareList(monitorsCompareAppConfig, productVariantString);
    
        if ((productVariantString.indexOf('_') > -1) &&
          (productVariantString.split('_').length == 2)) {
          let compareProductId = productVariantString.split('_')[0];
          let compareVariantId = productVariantString.split('_')[1];
    
          let targetCheckboxSelector = `input[type='checkbox'][name='SPCMP_chk'][spcmp_pid='${compareProductId}'][spcmp_vid='${compareVariantId}']`;
    
          if (document.querySelectorAll(targetCheckboxSelector).length) {
            document.querySelector(targetCheckboxSelector).checked = false;
          }
        }
      });
    
      renderProductCompareCount(monitorsCompareAppConfig);
    
      showHideProductCompareList(monitorsCompareAppConfig);
    
      positionChatButton();
    
      resetProductCollectionToLocalStorage(monitorsCompareAppConfig);
      resetProductTypeToLocalStorage(monitorsCompareAppConfig);
    
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    });


    document.querySelector('#monitors_ca_compare_products').addEventListener('click', function(e){
        let monitorsProductCompareShop = monitorsCompareAppConfig['monitorsProductCompareShop'];
        let monitorsProductCompareResultURL = monitorsCompareAppConfig['monitorsProductCompareResultURL'];
        let savedProductList = getSavedProductCompareList(monitorsCompareAppConfig);
        let productCollectionId = 'productCollectionId';
        let collectionId = getSavedProductCollectionList(productCollectionId);

        let productVariantListString = savedProductList.length
                                        ? savedProductList.join()
                                        : '';

        if (productVariantListString.length) {

            if (collectionId == ''){
              alert('Please clear and compare again.');
              return;
            }
            else{
              document.querySelector('.sp_compare_popup').classList.add('model-open');
              document.querySelector('.sa_border').innerHTML = compareResultLoader();
  
              getDataUsingAjax(
                  function(response) {
                      if ((response.status.toUpperCase() == 'OK') &&
                          response.data) {
                          renderCompareResult(response.data);
                      }
                  },
                  monitorsProductCompareResultURL,
                  'POST',
                  {
                      'payload': JSON.stringify({
                          'shop': monitorsProductCompareShop,
                          'product_variant_list': productVariantListString,
                          'collection_id' : collectionId
                      })
                  }
              );
           }
        }

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    });
}

function compareResultLoader()
{
    return `<div style="text-align:center" class="sp--loader">
        <span class="spc_loader">
            <img src="https://shopiapps.in/compare_product/cmp_widget/compare-page-loader.gif">
        </span>
        <p class="SPC_Cmploadingtxt" style="color: #333;display: block;font-size: 16px;font-weight: bold;line-height: 20px;">Comparing Products...</p>
    </div>`;
}

function renderCompareResult(result)
{
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {

      let compareFieldsUI = '';
      let compareProductsUI = '';
      let showAddToCartButton = 0;
      let showAddToCartButtonUI = '';

      if (result.global_settings) {
          if (result.global_settings.show_add_to_cart_button) {
              showAddToCartButton = result.global_settings.show_add_to_cart_button;
          }
      }

      let compareFieldsListExists = false;

      if (result.fields &&
        Object.keys(result.fields).length) {
        compareFieldsListExists = true;
      }

      if (result.products &&
          Object.keys(result.products).length) {
          compareProductsUI += `<div class="sp_product" id="sp_product">`;

          let productDetailsIndex = 0;

          for (let productkey in result.products) {
              let productDetails = result.products[productkey];
              compareProductsUI += `<ul class="sp_product_con fill_cmp">`;

              if (showAddToCartButton) {
                  showAddToCartButtonUIPrev = `<div class="sp_add_to_cart">
                      <form action="/cart/add" method="post" enctype="multipart/form-data">
                          <input type="hidden" name="id" value="${productDetails.variant_id}">
                          <input type="hidden" name="quantity" value="1">
                          <input class="sa_cmp_addcart" name="button" value="Add to Cart" type="submit">
                      </form>
                  </div>`;
                showAddToCartButtonUI = `<div class="sp_add_to_cart">
                  <a target="_blank" href="/products/${productDetails.product_handle}?variant=${productDetails.variant_id}" >
                          <input class="sa_cmp_addcart" name="button" value="View Product" type="button">
                  </a></div>`;
              }

             var productPriceSection = '';

              let productPrice = productDetails.product_min_variant_price,
                  productComparePrice = productDetails.product_max_variant_price;

              productPrice = productPrice.substring(1);
              productComparePrice = productComparePrice.substring(1);

              productPrice = parseFloat(productPrice);
              productComparePrice = parseFloat(productComparePrice);

              if (productComparePrice > productPrice) {
                  productPriceSection = `<div class="findify-components--cards--product--price__price-wrapper findify-components--cards--product__price-wrapper money">
                      <span class="findify-price_from sale-price">From</span>
                      <span class="findify-components--cards--product--price__price findify-components--cards--product--price__sale-price">
                      ${productDetails.product_min_variant_price}
                      </span>
                      <span class="findify-components--cards--product--price__compare">
                       ${productDetails.product_max_variant_price}
                      </span>
                    </div>`;
              } else {
                 productPriceSection = `<div class="findify-components--cards--product--price__price-wrapper findify-components--cards--product__price-wrapper">
                   <span class="findify-components--cards--product--price__price">${productDetails.product_min_variant_price}</span>
                  </div>`;
              }

              compareProductsUI += `<li class='sp_image'>
                  <div class="sp_image_block">
                      <a spcmp_vid="${productDetails.variant_id}" spcmp_pid="${productDetails.product_id}" dtype="page" href="javascript:void(0);" class="sp_close monitors_ca_idelete_new">✕</a>
                      <a target="_blank" href="/products/${productDetails.product_handle}?variant=${productDetails.variant_id}" class="sp_img">
                          <img src="${productDetails.product_image}" alt="">
                      </a>
                  </div>
                  <div class="sp_title">${productDetails.product_title}</div>
                  <div class="rating">
                     <a class="product-meta__reviews-badge link">
                        <span class="stamped-product-reviews-badge" data-product-sku="${productDetails.product_handle}" data-id="${productDetails.product_id}" data-product-type="${productDetails.product_type}" data-product-title="${productDetails.product_title}" style="display:block;">${productDetails.product_review}</span>
                      </a>
                   </div>
                  ${productPriceSection}
                  ${showAddToCartButtonUI}
              </li>`;

              if (productDetails.metafields &&
                  Object.keys(productDetails.metafields).length) {
                  let productMetafields = productDetails.metafields;
                  var field_index1 = 0;

                  for (let metafieldKey in productMetafields) {
                      let compareKeyUI = '';

                      if (compareFieldsListExists &&
                         result.fields[metafieldKey]) {
                        compareKeyUI = `<span class="custom_key">${result.fields[metafieldKey]}</span>`;
                      }
                      if(productDetailsIndex == 1 || productDetailsIndex == 3){
                       compareProductsUI += `<li class="same_cl monitors_cmp_attr_${field_index1} custom-hidden">${compareKeyUI}</li>
                       <li><span class="custom_value">${productMetafields[metafieldKey]}</span></li>`;
                       field_index1++;
                      }
                    else{
                      compareProductsUI += `<li class="same_cl monitors_cmp_attr_${field_index1}">${compareKeyUI}</li>
                      <li><span class="custom_value">${productMetafields[metafieldKey]}</span></li>`;
                      field_index1++;
                    }
                  }
              }

              compareProductsUI += `</ul>`;
            productDetailsIndex++;
          }
          compareProductsUI += `</div>`;
      }

      let compareDetails = `<div class="heading-mobile">
        <span> <class="sp_heading_mobile">Compare Products</span>
      </div>
      <ul class="sp_product_heading">
          ${compareFieldsUI}
      </ul>
      ${compareProductsUI}`;

      document.querySelector('.sa_border').innerHTML = compareDetails;
      compareResultSlickSlide();
      heightsEqualizerAuto();

    } else {

      let compareFieldsUI = '';
      let compareProductsUI = '';
      let showAddToCartButton = 0;
      let showAddToCartButtonUI = '';

      if (result.global_settings) {
          if (result.global_settings.show_add_to_cart_button) {
              showAddToCartButton = result.global_settings.show_add_to_cart_button;
          }
      }

      if (result.fields &&
          Object.keys(result.fields).length) {
          compareFieldsUI += `<li class="sp_image" style="height: 426px;">Compare Our Products</li>`;
          var field_index = 0;

          for (let fieldsKey in result.fields) {
              compareFieldsUI += `<li class="monitors_cmp_attr_${field_index}" data="sp_id_capital" style="height: 45px;">${result.fields[fieldsKey]}</li>`;
            field_index++;
          }
      }

      if (result.products &&
          Object.keys(result.products).length) {
          compareProductsUI += `<div class="sp_product" id="sp_product">`;

          for (let productkey in result.products) {
              let productDetails = result.products[productkey];
              compareProductsUI += `<ul class="sp_product_con fill_cmp">`;

              if (showAddToCartButton) {
                  showAddToCartButtonUIPrev = `<div class="sp_add_to_cart">
                      <form action="/cart/add" method="post" enctype="multipart/form-data">
                          <input type="hidden" name="id" value="${productDetails.variant_id}">
                          <input type="hidden" name="quantity" value="1">
                          <input class="sa_cmp_addcart" name="button" value="Add to Cart" type="submit">
                      </form>
                  </div>`;
                 showAddToCartButtonUI = `<div class="sp_add_to_cart">
                  <a target="_blank" href="/products/${productDetails.product_handle}?variant=${productDetails.variant_id}" >
                          <input class="sa_cmp_addcart" name="button" value="View Product" type="button">
                  </a></div>`;
              }

              var productPriceSection = '';

              let productPrice = productDetails.product_min_variant_price,
              productComparePrice = productDetails.product_max_variant_price;
              productPrice = productPrice.substring(1);
              productComparePrice = productComparePrice.substring(1);
              productPrice = parseFloat(productPrice);
              productComparePrice = parseFloat(productComparePrice);

              if (productComparePrice > productPrice) {
                  productPriceSection = `<div class="findify-components--cards--product--price__price-wrapper findify-components--cards--product__price-wrapper money">
                      <span class="findify-price_from sale-price">From</span>
                      <span class="findify-components--cards--product--price__price findify-components--cards--product--price__sale-price">
                      ${productDetails.product_min_variant_price}
                      </span>
                      <span class="findify-components--cards--product--price__compare">
                       ${productDetails.product_max_variant_price}
                      </span>
                    </div>`;
              } else {
                 productPriceSection = `<div class="findify-components--cards--product--price__price-wrapper findify-components--cards--product__price-wrapper">
                   <span class="findify-components--cards--product--price__price">${productDetails.product_min_variant_price}</span>
                  </div>`;
              }

              compareProductsUI += `<li class='sp_image'>
                  <div class="sp_image_block">
                      <a spcmp_vid="${productDetails.variant_id}" spcmp_pid="${productDetails.product_id}" dtype="page" href="javascript:void(0);" class="sp_close monitors_ca_idelete_new">✕</a>
                      <a target="_blank" href="/products/${productDetails.product_handle}?variant=${productDetails.variant_id}" class="sp_img">
                          <img src="${productDetails.product_image}" alt="">
                      </a>
                  </div>
                  <div class="sp_title">${productDetails.product_title}</div>
                  <div class="rating">
                     <a class="product-meta__reviews-badge link">
                        <span class="stamped-product-reviews-badge" data-product-sku="${productDetails.product_handle}" data-id="${productDetails.product_id}" data-product-type="${productDetails.product_type}" data-product-title="${productDetails.product_title}" style="display:block;">${productDetails.product_review}</span>
                      </a>
                   </div>
                  ${productPriceSection}
                  ${showAddToCartButtonUI}
              </li>`;

              if (productDetails.metafields &&
                  Object.keys(productDetails.metafields).length) {
                  let productMetafields = productDetails.metafields;
                  var field_index1 = 0;

                  for (let metafieldKey in productMetafields) {
                      compareProductsUI += `<li class="same_cl monitors_cmp_attr_${field_index1}">${productMetafields[metafieldKey]}</li>`;
                    field_index1++;
                  }
              }
              compareProductsUI += `</ul>`;
          }
          compareProductsUI += `</div>`;
      }
      let compareDetails = `<div class="sa_button">
          <input class="sa_prev" type="button" name="Prev" id="sp_prev" value="❮" disabled="">
          <input class="sa_next is-filled" type="button" name="Next" id="sp_next" value="❯">
      </div>
      <ul class="sp_product_heading">
          ${compareFieldsUI}
      </ul>
      ${compareProductsUI}`;
      document.querySelector('.sa_border').innerHTML = compareDetails;
      heightsEqualizerAuto();
  }
}

function renderPreviousSession(monitorsCompareAppConfig)
{
    let monitorsProductCompareShop = monitorsCompareAppConfig['monitorsProductCompareShop'];
    let monitorsProductCompareDetailsURL = monitorsCompareAppConfig['monitorsProductCompareDetailsURL'];
    removeBeyondMaxAllowedProducts(monitorsCompareAppConfig);
    let savedProductList = getSavedProductCompareList(monitorsCompareAppConfig);

    let productVariantListString = savedProductList.length
                                    ? savedProductList.join()
                                    : '';

    if (productVariantListString.length) {
        getDataUsingAjax(
            function(response) {
                if ((response.status.toUpperCase() == 'OK') &&
                    response.data) {
                    renderAddedProductsInCompareList(monitorsCompareAppConfig, response.data);
                    checkAddedProductsInUI(monitorsCompareAppConfig, savedProductList);
                }
            },
            monitorsProductCompareDetailsURL,
            'POST',
            {
                'payload': JSON.stringify({
                    'shop': monitorsProductCompareShop,
                    'product_variant_list': productVariantListString
                })
            }
        );
    }
}

// function reinitializeCompare()
// {
//     let monitorsCompareAppConfig = JSON.parse(localStorage.getItem('monitorsCompareAppConfig'));
//     let monitorsProductCompareShop = monitorsCompareAppConfig['monitorsProductCompareShop'];
//     let monitorsProductCompareDetailsURL = monitorsCompareAppConfig['monitorsProductCompareDetailsURL'];
//     removeBeyondMaxAllowedProducts(monitorsCompareAppConfig);
//     let savedProductList = getSavedProductCompareList(monitorsCompareAppConfig);

//     let productVariantListString = savedProductList.length
//                                     ? savedProductList.join()
//                                     : '';

//     if (productVariantListString.length) {
//         getDataUsingAjax(
//             function(response) {
//                 if ((response.status.toUpperCase() == 'OK') &&
//                     response.data) {
//                     renderAddedProductsInCompareList(monitorsCompareAppConfig, response.data);
//                     checkAddedProductsInUI(monitorsCompareAppConfig, savedProductList);
//                 }
//             },
//             monitorsProductCompareDetailsURL,
//             'POST',
//             {
//                 'payload': JSON.stringify({
//                     'shop': monitorsProductCompareShop,
//                     'product_variant_list': productVariantListString
//                 })
//             }
//         );
//     }
// }

function checkAddedProductsInUI(monitorsCompareAppConfig, savedProductList)
{
  if (savedProductList.length) {
    let monitorsCompareElements = monitorsCompareAppConfig['monitorsCompareElements'];

    for (let productVariantIndex of savedProductList) {
       let productVariantIndexArr = productVariantIndex.split('_');
       let productId = productVariantIndexArr[0];
       let variantId = productVariantIndexArr[1];

      let targetCheckboxSelector = `input[type='checkbox'][name='SPCMP_chk'][spcmp_pid='${productId}'][spcmp_vid='${variantId}']`;

      if (document.querySelectorAll(targetCheckboxSelector).length) {
          document.querySelector(targetCheckboxSelector).checked = true;

          document.querySelector(targetCheckboxSelector).parentElement.querySelector("span").textContent = monitorsCompareElements.message.checkboxCheckedLabel;
      }
    }
  }
}

function productCompareCheckboxClickTrigger(monitorsCompareAppConfig, targetCompareElement)
{
    console.log(targetCompareElement);
    let monitorsProductCompareShop = monitorsCompareAppConfig['monitorsProductCompareShop'];
    let monitosMaxAllowedCompare = monitorsCompareAppConfig['monitosMaxAllowedCompare'];
    let monitorsCompareElements = monitorsCompareAppConfig['monitorsCompareElements'];
    let monitorsProductCompareDetailsURL = monitorsCompareAppConfig['monitorsProductCompareDetailsURL'];
    let savedProductList = getSavedProductCompareList(monitorsCompareAppConfig);
    let productCollectionId = 'productCollectionId';
    let savedCollectionList = getSavedProductCollectionList(productCollectionId);
    let monitorsCaIcontainerId = monitorsCompareAppConfig['monitorsCaIcontainerId']; 
    let productTypeStorageName = 'productType';
    let savedProductTypeList = getSavedProductTypeList(productTypeStorageName);

    if (targetCompareElement.checked) {
        console.log(savedProductList.length);
        if (savedProductList.length >= monitosMaxAllowedCompare) {
            targetCompareElement.checked = false;
            alert(`You can compare maximum ${monitosMaxAllowedCompare} products`);
            return;
        }
    }

    let productCompareLabel = targetCompareElement.checked
                            ? monitorsCompareElements.message.checkboxCheckedLabel
                            : monitorsCompareElements.message.checkboxUncheckedLabel;

    targetCompareElement.parentElement.querySelector("span").textContent = productCompareLabel;

    let compareProductId = targetCompareElement.getAttribute("spcmp_pid");
    let compareVariantId = targetCompareElement.getAttribute("spcmp_vid");
    // let collectionId = targetCompareElement.getAttribute("data_collectionId");
    let collectionId = getCurrentPageCollectionId();

    let productCollectionString = `${collectionId}`;

    let productVariantString = `${compareProductId}_${compareVariantId}`;

    let productIndex = savedProductList.indexOf(productVariantString);

    if (targetCompareElement.checked) {
        if (savedCollectionList == "") {
            saveProductCollectionToLocalStorage(monitorsCompareAppConfig, collectionId);
        } else if (collectionId != savedCollectionList) {
            // alert(`Product compare is allowed only within same collection and type`);
            const emptyDiv = document.querySelector('#monitors_ca_icontainer .empty');
            var compareListItems = document.querySelectorAll('.monitors_ca_item:not(.empty)');
            var numCompareListItems = compareListItems.length;
            const isMobile = window.matchMedia("(max-width: 768px)").matches;
            if (isMobile) {
              if(numCompareListItems == 2)
              {
                $('#monitors_ca_icontainer').slick('slickNext');
              } 
            }
            emptyDiv.innerHTML = '<p class="atleast_text">Only products from the same category can be compared</p>';
            targetCompareElement.checked = false;
            return;
        }

        if (productIndex == -1) {
            //Disable all checkboxes with class SPCMP_Add
            var checkboxes = document.querySelectorAll('.SPCMP_Add');
            for (var i = 0; i < checkboxes.length; i++) {
              checkboxes[i].disabled = true;
            }

            saveProductToCompareList(monitorsCompareAppConfig, productVariantString);

            getDataUsingAjax(
                function(response) {
                    if ((response.status.toUpperCase() == 'OK') &&
                        response.data) {
                        let productType = response.data[0].product_type;

                        if (savedProductTypeList == "") {
                            saveProductToProductTypeList(monitorsCompareAppConfig, productType);
                        } else if (productType != savedProductTypeList) {
                            // alert(`Product compare is allowed only within same product type`);
                            const emptyDiv = document.querySelector('#monitors_ca_icontainer .empty');
                            var compareListItems = document.querySelectorAll('.monitors_ca_item:not(.empty)');
                            var numCompareListItems = compareListItems.length;
                            const isMobile = window.matchMedia("(max-width: 768px)").matches;
                            if (isMobile) {
                              if(numCompareListItems == 2)
                              {
                                $('#monitors_ca_icontainer').slick('slickNext');
                              } 
                            }  
                            emptyDiv.innerHTML = '<p class="atleast_text">Only products from the same category can be compared</p>';
                            targetCompareElement.checked = false;
                            removeProductFromCompareList(monitorsCompareAppConfig, productVariantString);
                            // Enable all checkboxes with class SPCMP_Add
                            for (var i = 0; i < checkboxes.length; i++) {
                              checkboxes[i].disabled = false;
                            }
                            return;
                        }
                        saveProductToProductTypeList(monitorsCompareAppConfig, productType);
                        renderAddedProductsInCompareList(monitorsCompareAppConfig, response.data)

                        // Enable all checkboxes with class SPCMP_Add
                        for (var i = 0; i < checkboxes.length; i++) {
                          checkboxes[i].disabled = false;
                        }
                    }
                },
                monitorsProductCompareDetailsURL,
                'POST',
                {
                    'payload': JSON.stringify({
                        'shop': monitorsProductCompareShop,
                        'product_variant_list': productVariantString
                    })
                }
            );
        }
    } else {
        if (productIndex > -1) {
            removeProductFromCompareList(monitorsCompareAppConfig, productVariantString);

            const isMobile = window.matchMedia("(max-width: 768px)").matches;

            if (isMobile) {
              let removeProductIndex = document.querySelector(`.monitors_ca_item_${productVariantString}`).getAttribute('data-slick-index');
              $('#monitors_ca_icontainer').slick('slickRemove', removeProductIndex);
            }
            else{
              var removeElement = document.getElementById(`monitors_ca_item_${productVariantString}`);
              if (removeElement !== null) {
                removeElement.remove();
              }
            }

            var compareListItems = document.querySelectorAll('.monitors_ca_item:not(.empty)');
            var numCompareListItems = compareListItems.length;

            if(monitosMaxAllowedCompare == 4){

              if (isMobile) {
                 $('.slick-slide').each(function(){
                        if($(this).hasClass('empty')){ 
                          let slickIndex = $(this).attr('data-slick-index');
                           $('#monitors_ca_icontainer').slick('slickRemove', slickIndex);
                        }
                      });

                   // Adjust number of empty divs based on number of products added
                  if (numCompareListItems == 0) {
                    
                     $('#monitors_ca_icontainer').slick('refresh');
                    }
                    else if (numCompareListItems == 1) { 
                        document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block";
                        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                        emptyDivs.forEach(function(div) {
                          div.remove();
                        });
                        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"><p>Please select atleast 2 products to compare </p></div>');
                        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                    } else if (numCompareListItems == 2) {
                        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                    } else if (numCompareListItems == 3) {
                        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                    } else if (numCompareListItems == 4) {
                      document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block"; 
                    }
              }

              else{
                 // Adjust number of empty divs based on number of products added
                if (numCompareListItems == 1) {
                    document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
                    let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                    emptyDivs.forEach(function(div) {
                        div.remove();
                    });
                    document.getElementById(monitorsCaIcontainerId).innerHTML += `
                    <div class="monitors_ca_item empty"><p class="atleast_text"> Please select at least two products to compare </p></div>
                    <div class="monitors_ca_item empty"></div>
                    <div class="monitors_ca_item empty"></div>`;
                } else if (numCompareListItems == 2) {
                    document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                    let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                    emptyDivs.forEach(function(div) {
                        div.remove();
                    });
                    document.getElementById(monitorsCaIcontainerId).innerHTML += `
                    <div class="monitors_ca_item empty"></div>
                    <div class="monitors_ca_item empty"></div>`;
                } else if (numCompareListItems == 3) {
                    document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                    let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                    emptyDivs.forEach(function(div) {
                        div.remove();
                    });
                    document.getElementById(monitorsCaIcontainerId).innerHTML += `
                    <div class="monitors_ca_item empty"></div>`;
                } else if (numCompareListItems == 4) {
                    document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                    let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                    emptyDivs.forEach(function(div) {
                        div.remove();
                    });
                }
              }
             }
            if (monitosMaxAllowedCompare == 3){

              if (isMobile) {
                 $('.slick-slide').each(function(){
                        if($(this).hasClass('empty')){ 
                          let slickIndex = $(this).attr('data-slick-index');
                           $('#monitors_ca_icontainer').slick('slickRemove', slickIndex);
                        }
                      });

                   // Adjust number of empty divs based on number of products added
                  if (numCompareListItems == 0) {
                    
                     $('#monitors_ca_icontainer').slick('refresh');
                    }
                    else if (numCompareListItems == 1) { 
                        document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block";
                        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                        emptyDivs.forEach(function(div) {
                          div.remove();
                        });
                        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"><p>Please select atleast 2 products to compare </p></div>');
                        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                    } else if (numCompareListItems == 2) {
                        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                    } else if (numCompareListItems == 3) {
                        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                    }
              }
              else{
                // Adjust number of empty divs based on number of products added
                if (numCompareListItems == 1) {
                    document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
                    document.getElementById(monitorsCaIcontainerId).innerHTML += `
                    <div class="monitors_ca_item empty"><p class="atleast_text"> Please select at least two products to compare </p></div>
                    <div class="monitors_ca_item empty"></div>`;
                } else if (numCompareListItems == 2) {
                    document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                    let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                    emptyDivs.forEach(function(div) {
                        div.remove();
                    });
                    document.getElementById(monitorsCaIcontainerId).innerHTML += `
                    <div class="monitors_ca_item empty"></div>`;
                } else if (numCompareListItems == 3) {
                    document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                    let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                    emptyDivs.forEach(function(div) {
                        div.remove();
                    });
                }
              }
            }

            if (monitosMaxAllowedCompare == 2){

              if (isMobile) {
                 $('.slick-slide').each(function(){
                        if($(this).hasClass('empty')){ 
                          let slickIndex = $(this).attr('data-slick-index');
                           $('#monitors_ca_icontainer').slick('slickRemove', slickIndex);
                        }
                      });

                   // Adjust number of empty divs based on number of products added
                  if (numCompareListItems == 0) {
                    
                     $('#monitors_ca_icontainer').slick('refresh');
                    }
                    else if (numCompareListItems == 1) { 
                        document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block";
                        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                        emptyDivs.forEach(function(div) {
                          div.remove();
                        });
                        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"><p>Please select atleast 2 products to compare </p></div>');
                    } else if (numCompareListItems == 2) {
                        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                    }
              }
              else{
                // Adjust number of empty divs based on number of products added
                if (numCompareListItems == 1) {
                    document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
                    document.getElementById(monitorsCaIcontainerId).innerHTML += `
                    <div class="monitors_ca_item empty"><p class="atleast_text"> Please select at least two products to compare </p></div>`;
                } else if (numCompareListItems == 2) {
                    document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                    let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
                    emptyDivs.forEach(function(div) {
                        div.remove();
                    });
                }
              }
            }

            renderProductCompareCount(monitorsCompareAppConfig);

            showHideProductCompareList(monitorsCompareAppConfig);
        }
    }
}

function getCurrentPageCollectionId()
{
    return sessionStorage.getItem('currentPageCollectionId');
}

function renderAddedProductsInCompareList(monitorsCompareAppConfig, productsList)
{
    let monitorsCaIcontainerId = monitorsCompareAppConfig['monitorsCaIcontainerId'];
    var monitorsProductCompareCount = monitorsCompareAppConfig['monitosMaxAllowedCompare'];

    if (productsList.length) {
        let productUI = '';

        for (let productInfo of productsList) {
            var productPriceSection = '';

            let productPrice = productInfo.price,
                productComparePrice = productInfo.compare_price;

            productPrice = productPrice.substring(1);
            productComparePrice = productComparePrice.substring(1);

            productPrice = parseFloat(productPrice);
            productComparePrice = parseFloat(productComparePrice);

            if (productComparePrice > productPrice) {
                productPriceSection = `<div class="findify-components--cards--product--price__price-wrapper findify-components--cards--product__price-wrapper money">
                    <span class="findify-price_from sale-price">From</span>
                    <span class="findify-components--cards--product--price__price findify-components--cards--product--price__sale-price">
                    ${productInfo.price}
                    </span>
                    <span class="findify-components--cards--product--price__compare">
                     ${productInfo.compare_price}
                    </span>
                  </div>`;
            } else {
               productPriceSection = `<div class="findify-components--cards--product--price__price-wrapper findify-components--cards--product__price-wrapper">
                 <span class="findify-components--cards--product--price__price">${productInfo.price}</span>
                </div>`;
            }

            const isMobile = window.matchMedia("(max-width: 768px)").matches;
            // const isMobile = window.matchMedia("(max-width: 768px)").matches;

            if (isMobile) {
              productUI = `<div class="monitors_ca_item monitors_ca_item_mobile monitors_ca_item_${productInfo.product_id}_${productInfo.variant_id}" id="monitors_ca_item_${productInfo.product_id}_${productInfo.variant_id}">
                <div class="monitors_ca_item_thumb monitors_ca_item_thumb_mobile">
                    <a class="monitors_ca_pimg" href="${productInfo.url}">
                        <img alt="" src="${productInfo.image}">
                        <span class="monitors_ca_idelete" spcmp_pid="${productInfo.product_id}" spcmp_vid="${productInfo.variant_id}" dtype="sticky" data-view="mobile">✕</span>
                    </a>
                    <div class="monitors_ca_summary">
                        <a href="${productInfo.url}" class="monitors_ca_ptitle">${productInfo.name}</a>
                    </div>
                     ${productPriceSection}
                  </div>
                </div>
               </div>`;
            } else {
               productUI = `<div class="monitors_ca_item" id="monitors_ca_item_${productInfo.product_id}_${productInfo.variant_id}">
                <div class="monitors_ca_item_thumb">
                    <a class="monitors_ca_pimg" href="${productInfo.url}">
                        <img alt="" src="${productInfo.image}">
                        <span class="monitors_ca_idelete" spcmp_pid="${productInfo.product_id}" spcmp_vid="${productInfo.variant_id}" dtype="sticky">✕</span>
                    </a>
                    <div class="monitors_ca_summary">
                        <a href="${productInfo.url}" class="monitors_ca_ptitle">${productInfo.name}</a>
                    </div>
                  </div>
                  <div class="monitors_ca_item_rating_price">
                  <div class="rating">
                       <a class="product-meta__reviews-badge link">
                          <span class="stamped-product-reviews-badge" data-product-sku="${productInfo.product_handle}" data-id="${productInfo.product_id}" data-product-type="${productInfo.product_type}" data-product-title="${productInfo.product_title}" style="display:block;">${productInfo.product_review}</span>
                        </a>
                  </div>
                  ${productPriceSection}
                  </div>
                </div>`;
            }

            let productVariantItemElement = document.getElementById(`monitors_ca_item_${productInfo.product_id}_${productInfo.variant_id}`);

            if (!productVariantItemElement || null == productVariantItemElement) {
                const isMobile = window.matchMedia("(max-width: 768px)").matches;
                  if (isMobile) {
                    $('.slick-slide').each(function(){
                      if($(this).hasClass('empty')){
                        if($(this).hasClass('slick-active')){
                        }
                        let slickIndex = $(this).attr('data-slick-index');
                        try {
                         $('#monitors_ca_icontainer').slick('slickRemove', slickIndex);
                        } catch (error) {
                          console.log(error);
                        }
                      }
                    });
                    try {
                      // $('#monitors_ca_icontainer').slick('refresh');
                      $('#monitors_ca_icontainer').slick('slickAdd', productUI);
                      $('#monitors_ca_icontainer').slick('slickNext');
                    } catch (error) {
                      console.log('add'+ error);
                    }
                  } else {
                    document.getElementById(monitorsCaIcontainerId).innerHTML += productUI;
                  }
            }
        }

        var compareListItems = document.querySelectorAll('.monitors_ca_item:not(.empty)');
        var numCompareListItems = compareListItems.length;
        var isMobile = window.matchMedia("(max-width: 768px)").matches;
        // var isMobile = window.matchMedia("(max-width: 768px)").matches;

        if (isMobile) {
             $('.slick-slide').each(function(){
                if($(this).hasClass('empty')){
                  let slickIndex = $(this).attr('data-slick-index');
                   $('#monitors_ca_icontainer').slick('slickRemove', slickIndex);
  
                }
              });
            if(monitorsProductCompareCount == 4){
             // Adjust number of empty divs based on number of products added
            if (numCompareListItems == 1) {
                document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block";  
                $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"><p>Please select atleast 2 products to compare </p></div>');
                $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>'); 
            } else if (numCompareListItems == 2) {
                document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                // $('#monitors_ca_icontainer').slick('slickRemove', 1);
                $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
                $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>'); 
            } else if (numCompareListItems == 3) {
               document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
               // $('#monitors_ca_icontainer').slick('slickRemove', 2);
               $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
            } else if (numCompareListItems == 4) {
              document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";   
            }
           }

          if (monitorsProductCompareCount == 3){
              // Adjust number of empty divs based on number of products added
            if (numCompareListItems == 1) {
                document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block";
                $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"><p>Please select atleast 2 products to compare </p></div>');
                $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
            } else if (numCompareListItems == 2) {
                  document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
                 $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
            } else if (numCompareListItems == 3) {
               document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
            }
          }

          if (monitorsProductCompareCount == 2){
              // Adjust number of empty divs based on number of products added
            if (numCompareListItems == 1) {
                 document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block";
                 $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"><p>Please select atleast 2 products to compare </p></div>');
            } else if (numCompareListItems == 2) {
               document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
            }
          }
        } else{
           if(monitorsProductCompareCount == 4){

           // Adjust number of empty divs based on number of products added
          if (numCompareListItems == 1) {
              document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block";  
              document.getElementById(monitorsCaIcontainerId).innerHTML += `
              <div class="monitors_ca_item empty"><p class="atleast_text"> Please select at least two products to compare </p></div>
              <div class="monitors_ca_item empty"></div>
              <div class="monitors_ca_item empty"></div>`;
          } else if (numCompareListItems == 2) {
              document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
              let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
              emptyDivs.forEach(function(div) {
                  div.remove();
              });
              document.getElementById(monitorsCaIcontainerId).innerHTML += `
              <div class="monitors_ca_item empty"></div>
              <div class="monitors_ca_item empty"></div>`;
          } else if (numCompareListItems == 3) {
              document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
              let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
              emptyDivs.forEach(function(div) {
                  div.remove();
              });
              document.getElementById(monitorsCaIcontainerId).innerHTML += `
              <div class="monitors_ca_item empty"></div>`;
          } else if (numCompareListItems == 4) {
              document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
              let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
              emptyDivs.forEach(function(div) {
                  div.remove();
              });
          }
         }

        if (monitorsProductCompareCount == 3){
            // Adjust number of empty divs based on number of products added
          if (numCompareListItems == 1) {
              document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block";
              document.getElementById(monitorsCaIcontainerId).innerHTML += `
              <div class="monitors_ca_item empty"><p class="atleast_text"> Please select at least two products to compare </p></div>
              <div class="monitors_ca_item empty"></div>`;
          } else if (numCompareListItems == 2) {
              document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
              let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
              emptyDivs.forEach(function(div) {
                  div.remove();
              });
              document.getElementById(monitorsCaIcontainerId).innerHTML += `
              <div class="monitors_ca_item empty"></div>`;
          } else if (numCompareListItems == 3) {
              document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
              let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
              emptyDivs.forEach(function(div) {
                  div.remove();
              });
          }
        }

        if (monitorsProductCompareCount == 2){

            // Adjust number of empty divs based on number of products added
          if (numCompareListItems == 1) {
              document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
              document.getElementById(monitorsCaIcontainerId).innerHTML += `
              <div class="monitors_ca_item empty"><p class="atleast_text"> Please select at least two products to compare </p></div>`;
          } else if (numCompareListItems == 2) {
              document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
              let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
              emptyDivs.forEach(function(div) {
                  div.remove();
              });
          }
        }
      }
        renderProductCompareCount(monitorsCompareAppConfig);

        showHideProductCompareList(monitorsCompareAppConfig);
    }
}

function renderProductCompareCount(monitorsCompareAppConfig)
{
    let monitorsProductCompareCount = monitorsCompareAppConfig['monitorsProductCompareCount'];
    let monitosMaxAllowedCompare = monitorsCompareAppConfig['monitosMaxAllowedCompare'];
    var monitorsProductCompareCountNew = document.querySelectorAll('.monitors_ca_item:not(.empty)');
    var monitorsProductCompareCountNewLength = monitorsProductCompareCountNew.length;
    let savedProductList = getSavedProductCompareList(monitorsCompareAppConfig);

    document.getElementById(monitorsProductCompareCount).innerHTML = monitosMaxAllowedCompare;
    if (monitorsProductCompareCountNewLength && monitosMaxAllowedCompare) {
      document.getElementById('productsToCompare').innerHTML = `${monitorsProductCompareCountNewLength}/${monitosMaxAllowedCompare}`;
    }
}

function showHideProductCompareList(monitorsCompareAppConfig)
{
    let savedProductList = getSavedProductCompareList(monitorsCompareAppConfig);
    let monitorsCaFlapTabId = monitorsCompareAppConfig['monitorsCaFlapTabId'];
    let monitorsCaContainerId = monitorsCompareAppConfig['monitorsCaContainerId'];
    let monitorsCaIcontainerId = monitorsCompareAppConfig['monitorsCaIcontainerId'];

    if (savedProductList.length) {
        document.getElementById(monitorsCaContainerId).style.display = "block";

        let monitorsCaContent = document.querySelector('.monitors_ca_content');

        if (monitorsCaContent.classList.contains('monitors_ca_close')) {
            monitorsCaContent.classList.remove('monitors_ca_close');
            monitorsCaContent.classList.add('monitors_ca_open');
            document.getElementById('monitors_ca_container').classList.remove('ca_bottom_close');
            document.getElementById('monitors_ca_container').classList.add('ca_bottom_open');
            document.getElementById(monitorsCaFlapTabId).style.display = "none";
            const isMobile = window.matchMedia("(max-width: 768px)").matches;
            if (isMobile) {
              // const chatButton = document.getElementById("dummy-chat-button-iframe");
              // const monitorsContainer = document.getElementById("monitors_ca_container");
              // const chatButtonOpen = document.getElementById("ShopifyChat");
            
              // if (chatButton && monitorsContainer) {
              //   const monitorsHeight = monitorsContainer.offsetHeight;
              //   const windowHeight = window.innerHeight;
              //   const chatButtonHeight = chatButton.offsetHeight;
              //   const chatButtonBottomMargin = 24;
            
              //   chatButton.style.bottom = "unset";
              //   // chatButton.style.top = '516px';
              //   chatButton.style.top = '586px';
              // }
            
              // if (chatButtonOpen && monitorsContainer) {
              //   const monitorsHeight = monitorsContainer.offsetHeight;
              //   const windowHeight = window.innerHeight;
              //   const chatButtonOpenHeight = chatButtonOpen.offsetHeight;
              //   const chatButtonOpenBottomMargin = 24;
            
              //   chatButtonOpen.style.bottom = "unset";
              //   // chatButtonOpen.style.top = '516px';
              //   chatButtonOpen.style.top = '586px';
              // }
              positionChatButton();
            }
            else{
              positionChatButton();
            }  
         }

        if (!monitorsCaContent.classList.contains('monitors_ca_open') &&
            (document.getElementById(monitorsCaFlapTabId).style.display == 'none')) {
            document.getElementById(monitorsCaFlapTabId).style.display = "block";
        }
    } else {
        let monitorsCaContent = document.querySelector('.monitors_ca_content');
        document.getElementById(monitorsCaIcontainerId).innerHTML = '';
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) {
         $('#monitors_ca_icontainer').slick('refresh');
        }
        monitorsCaContent.classList.remove('monitors_ca_open');
        monitorsCaContent.classList.add('monitors_ca_close');
        document.getElementById('monitors_ca_container').classList.remove('ca_bottom_open');
        document.getElementById('monitors_ca_container').classList.add('ca_bottom_close');
        document.getElementById(monitorsCaContainerId).style.display = "none";
        document.getElementById(monitorsCaFlapTabId).style.display = "none";
        positionChatButton();
        resetProductCollectionToLocalStorage(monitorsCompareAppConfig);
        resetProductTypeToLocalStorage(monitorsCompareAppConfig);
    }
}

function getSavedProductCompareList(monitorsCompareAppConfig)
{
    let monitorsCompareStorageName = monitorsCompareAppConfig['monitorsCompareStorageName'];
    let savedProductList = localStorage.getItem(monitorsCompareStorageName);

    if (savedProductList === '' || savedProductList == null) {
        savedProductList = [];
    } else {
        savedProductList = JSON.parse(savedProductList);
    }

    return savedProductList;
}

function getSavedProductCollectionList(productCollectionId) {
  let savedProductCollectionList = localStorage.getItem(productCollectionId);

  if (savedProductCollectionList === '' || savedProductCollectionList == null) {
    savedProductCollectionList = "";
  }

  return savedProductCollectionList;
}

function getSavedProductTypeList(productTypeStorageName) {
  let savedProductTypeList = localStorage.getItem(productTypeStorageName);

  if (savedProductTypeList === '' || savedProductTypeList == null) {
    savedProductTypeList = "";
  }

  return savedProductTypeList;
}

function saveProductToCompareList(monitorsCompareAppConfig, productVariantString)
{
    let monitorsCompareStorageName = monitorsCompareAppConfig['monitorsCompareStorageName'];
    let savedProductList = getSavedProductCompareList(monitorsCompareAppConfig);

    savedProductList.push(productVariantString);

    localStorage.setItem(monitorsCompareStorageName, JSON.stringify(savedProductList));
}

function saveProductToProductTypeList(monitorsCompareAppConfig, productType)
{
    let productTypeStorageName = 'productType';
    let savedProductTypeList = getSavedProductTypeList(productTypeStorageName);

   if (savedProductTypeList == "") {
    savedProductTypeList = productType;
  }

  localStorage.setItem(productTypeStorageName, savedProductTypeList);
}

function saveProductCollectionToLocalStorage(monitorsCompareAppConfig, productCollectionString) {
  let productCollectionId = 'productCollectionId';
  let savedProductCollectionList = getSavedProductCollectionList(productCollectionId);

  if (savedProductCollectionList == "") {
    savedProductCollectionList = productCollectionString;
  }

  localStorage.setItem(productCollectionId, savedProductCollectionList);
}

function resetProductCollectionToLocalStorage(monitorsCompareAppConfig)
{
    let productCollectionId = 'productCollectionId';
    localStorage.setItem(productCollectionId, "");
}

function resetProductTypeToLocalStorage(monitorsCompareAppConfig)
{
    let productType = 'productType';
    localStorage.setItem(productType, "");
}

function removeProductFromCompareList(monitorsCompareAppConfig, productVariantString)
{
    let monitorsCompareStorageName = monitorsCompareAppConfig['monitorsCompareStorageName'];
    let savedProductList = getSavedProductCompareList(monitorsCompareAppConfig);

    if (savedProductList.length) {
        let productIndex = savedProductList.indexOf(productVariantString);

        if (productIndex > -1) {
            savedProductList.splice(productIndex, 1);
            localStorage.setItem(monitorsCompareStorageName, JSON.stringify(savedProductList));
        }
    } else {
        resetProductCollectionToLocalStorage(monitorsCompareAppConfig);
         resetProductTypeToLocalStorage(monitorsCompareAppConfig);
    }
}

function removeProductCollectionList(monitorsCompareAppConfig, productCollectionString)
{
    let productCollectionId = 'productCollectionId';
    let savedProductCollectionList = getSavedProductCollectionList(productCollectionId);

    if (savedProductCollectionList.length) {
        let productIndex = savedProductCollectionList.indexOf(productCollectionString);

        if (productIndex > -1) {
            savedProductCollectionList.splice(productIndex, 1);
            localStorage.setItem(productCollectionId, JSON.stringify(savedProductCollectionList));
        }
    }
}

function removeBeyondMaxAllowedProducts(monitorsCompareAppConfig)
{
    let monitorsCompareStorageName = monitorsCompareAppConfig['monitorsCompareStorageName'];
    let savedProductList = getSavedProductCompareList(monitorsCompareAppConfig);
    let monitosMaxAllowedCompare = monitorsCompareAppConfig['monitosMaxAllowedCompare'];

    if (savedProductList.length &&
        parseInt(monitosMaxAllowedCompare)) {
        let newSavedproductList = [];
        for (let index=0; index<parseInt(monitosMaxAllowedCompare); index++) {
            if (savedProductList[index]) {
              newSavedproductList.push(savedProductList[index]);
            }
        }
        localStorage.setItem(monitorsCompareStorageName, JSON.stringify(newSavedproductList));
    }
}

function getDataUsingFetch(callback, requestUrl, requestMethod, requestBody = {})
{
    let request = {};

    request.method = requestMethod;
    request.headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };
    request.mode = 'cors';

    if (requestMethod.toUpperCase() == "POST") {
        request.body = JSON.stringify(requestBody);
    }

    fetch(requestUrl, request).then((response => response.text())).then((responseJson => {
        try {
            responseJson = JSON.parse(responseJson);
        } catch (error) {}
        callback(responseJson);
    })).catch((requestError => {
        console.log(requestError);
    }))
}

function getDataUsingAjax(callback, requestUrl, requestMethod, requestBody = {})
{
    $.ajax({
        type: requestMethod,
        url: requestUrl,
        dataType:'json',
        data: requestBody,
        success:function(response) {
            callback(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function heightsEqualizerAuto() {/*SET HEIGH IN RESPONSIVE*/

    var selector = 'li.sp_image';

    document.querySelectorAll('.sp_product_heading li').forEach(function(p,q){
      selector = ( q=='0' ? '' : selector );
      selector += ( q != '0' ? "," : "" ) + "li." + p.getAttribute('class');
    });
    var elem_arr = selector.split(",");
    elem_arr.forEach(function(value,key){
      var elements = document.querySelectorAll(value),
          max_height = 0,
          len = 0,
          i;
      if ((elements) && (elements.length > 0)) {
        len = elements.length;
        for (i = 0; i < len; i++) { /*GET MAX HEIGHT*/
          elements[i].style.height = ''; /*RESET HEIGHT ATTR*/
          if (elements[i].clientHeight > max_height) {
            max_height = elements[i].clientHeight;
          }
        }
        for (i = 0; i < len; i++) { /*SET MAX HEIGHT TO ALL ELEMENTS*/
          elements[i].style.height = max_height + 'px';
        }
      }
    });
  }

function compareSlickSlide(){
  // Add Slick slider to the product container for mobile view
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  // const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) {
      // Target the monitors_ca_icontainer div
      const container = document.querySelector('#monitors_ca_icontainer');
      if (container) {
        $(container).slick({
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
          dots: true,
          arrows: true
        });
      } else {
        console.log('container does not exists');
      }
  }
}

function compareResultSlickSlide(){
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) {
      const container = document.querySelector('#sp_product');
      if (container) {
        $(container).slick({
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
          dots: true,
          arrows: true
        });
      } else {
        console.log('container result does not exists');
      }
  }
}

function positionChatButton() {
  const chatButton = document.getElementById("dummy-chat-button-iframe");
  const monitorsContainer = document.getElementById("monitors_ca_container");
  const chatButtonOpen = document.getElementById("ShopifyChat");

  if (chatButton && monitorsContainer) {
    const monitorsHeight = monitorsContainer.offsetHeight;
    const windowHeight = window.innerHeight;
    const chatButtonHeight = chatButton.offsetHeight;
    const chatButtonBottomMargin = 24;

    chatButton.style.bottom = "unset";
    chatButton.style.top = `${windowHeight - monitorsHeight - chatButtonHeight - chatButtonBottomMargin}px`;
  }

  if (chatButtonOpen && monitorsContainer) {
    const monitorsHeight = monitorsContainer.offsetHeight;
    const windowHeight = window.innerHeight;
    const chatButtonOpenHeight = chatButtonOpen.offsetHeight;
    const chatButtonOpenBottomMargin = 24;

    chatButtonOpen.style.bottom = "unset";
    chatButtonOpen.style.top = `${windowHeight - monitorsHeight - chatButtonOpenHeight - chatButtonOpenBottomMargin}px`;
  }
}

function removeCompareFooterTile(monitorsCompareAppConfig, compareProductId, compareVariantId, compareView='desktop')
{
  let monitorsProductCompareCount1 = monitorsCompareAppConfig['monitosMaxAllowedCompare'];
  let productVariantString = `${compareProductId}_${compareVariantId}`;
  let monitorsCaIcontainerId = monitorsCompareAppConfig['monitorsCaIcontainerId'];

  removeProductFromCompareList(monitorsCompareAppConfig, productVariantString);

  if (compareView === 'mobile') {
    let removeProductIndex = document.querySelector(`.monitors_ca_item_${productVariantString}`).getAttribute('data-slick-index');
    $('#monitors_ca_icontainer').slick('slickRemove', removeProductIndex);
  } else {
    document.getElementById(`monitors_ca_item_${productVariantString}`).remove();
  }

  renderProductCompareCount(monitorsCompareAppConfig);

  showHideProductCompareList(monitorsCompareAppConfig);

  let targetCheckboxSelector = `input[type='checkbox'][name='SPCMP_chk'][spcmp_pid='${compareProductId}'][spcmp_vid='${compareVariantId}']`;

  if (document.querySelectorAll(targetCheckboxSelector).length) {
    document.querySelector(targetCheckboxSelector).checked = false;
  }

  let compareListItems = document.querySelectorAll('.monitors_ca_item:not(.empty)');
  let numCompareListItems = compareListItems.length;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    $('.slick-slide').each(function(){
      if ($(this).hasClass('empty')) {
        let slickIndex = $(this).attr('data-slick-index');
        $('#monitors_ca_icontainer').slick('slickRemove', slickIndex);
      }
    });

    if (monitorsProductCompareCount1 == 4) {
      // Adjust number of empty divs based on number of products added
      if (numCompareListItems == 0) {
        $('#monitors_ca_icontainer').slick('refresh');
      } else if (numCompareListItems == 1) {
        document.getElementById('monitors_ca_compare_products').style.display = "none"; 
        document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
        
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"><p>Please select atleast 2 products to compare </p></div>');
        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
      } else if (numCompareListItems == 2) {
        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; 
        document.getElementById('monitors_ca_compare_products').style.display = "block";

        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });    
        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
      } else if (numCompareListItems == 3) {
        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; 
        document.getElementById('monitors_ca_compare_products').style.display = "block";
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
        $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
      } else if (numCompareListItems == 4) {
        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; 
        document.getElementById('monitors_ca_compare_products').style.display = "block";
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
      }
    }

    if(monitorsProductCompareCount1 == 3)
      {
         // Adjust number of empty divs based on number of products added
        if (numCompareListItems == 0) {
           // $('#monitors_ca_icontainer').slick('unslick');
           $('#monitors_ca_icontainer').slick('refresh');
          }
          else if (numCompareListItems == 1) {
              document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
              let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
              emptyDivs.forEach(function(div) {
                div.remove();
              });
              $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"><p>Please select atleast 2 products to compare </p></div>');
              $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
          } else if (numCompareListItems == 2) {
              document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
              $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"></div>');
          } else if (numCompareListItems == 3) {
              document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
          }
      }

      if(monitorsProductCompareCount1 == 2)
      {
         // Adjust number of empty divs based on number of products added
        if (numCompareListItems == 0) {
           // $('#monitors_ca_icontainer').slick('unslick');
           $('#monitors_ca_icontainer').slick('refresh');
          }
          else if (numCompareListItems == 1) {
              document.getElementById('monitors_ca_compare_products').style.display = "none"; document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
              let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
              emptyDivs.forEach(function(div) {
                div.remove();
              });
              $('#monitors_ca_icontainer').slick('slickAdd', '<div class="monitors_ca_item empty"><p>Please select atleast 2 products to compare </p></div>');
          } else if (numCompareListItems == 2) {
              document.getElementById('monitors_ca_compare_disabled').style.display = "none"; document.getElementById('monitors_ca_compare_products').style.display = "block";
          }
      }
  } else {
    if (monitorsProductCompareCount1 == 4) {
      // Adjust number of empty divs based on number of products added
      if (numCompareListItems == 0) {
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
        
        positionChatButton();
      } else if (numCompareListItems == 1) {
        document.getElementById('monitors_ca_compare_products').style.display = "none"; 
        document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
        
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
        
        document.getElementById(monitorsCaIcontainerId).innerHTML += `
        <div class="monitors_ca_item empty"><p class="atleast_text"> Please select at least two products to compare </p></div>
        <div class="monitors_ca_item empty"></div>
        <div class="monitors_ca_item empty"></div>`;
      } else if (numCompareListItems == 2) {
        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; 
        document.getElementById('monitors_ca_compare_products').style.display = "block";
        
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
        
        document.getElementById(monitorsCaIcontainerId).innerHTML += `
        <div class="monitors_ca_item empty"></div>
        <div class="monitors_ca_item empty"></div>`;
      } else if (numCompareListItems == 3) {
        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; 
        document.getElementById('monitors_ca_compare_products').style.display = "block";
      
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
        document.getElementById(monitorsCaIcontainerId).innerHTML += `
        <div class="monitors_ca_item empty"></div>`;
      } else if (numCompareListItems == 4) {
        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; 
        document.getElementById('monitors_ca_compare_products').style.display = "block";
      
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
      }
    }
    
    if (monitorsProductCompareCount1 == 3) {
      // Adjust number of empty divs based on number of products added
      if (numCompareListItems == 0) {
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
    
        positionChatButton();
      } else if (numCompareListItems == 1) {
        document.getElementById('monitors_ca_compare_products').style.display = "none"; 
        document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
      
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
      
        document.getElementById(monitorsCaIcontainerId).innerHTML += `
        <div class="monitors_ca_item empty"><p class="atleast_text"> Please select at least two products to compare </p></div>
        <div class="monitors_ca_item empty"></div>`;
      } else if (numCompareListItems == 2) {
        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; 
        document.getElementById('monitors_ca_compare_products').style.display = "block";
      
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
      
        document.getElementById(monitorsCaIcontainerId).innerHTML += `
        <div class="monitors_ca_item empty"></div>`;
      } else if (numCompareListItems == 3) {
        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; 
        document.getElementById('monitors_ca_compare_products').style.display = "block";
      
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
      }
    }

    if (monitorsProductCompareCount1 == 2) {
      // Adjust number of empty divs based on number of products added
      if (numCompareListItems == 0) {
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
        
        positionChatButton();
      } else if (numCompareListItems == 1) {
        document.getElementById('monitors_ca_compare_products').style.display = "none"; 
        document.getElementById('monitors_ca_compare_disabled').style.display = "block"; 
        
        document.getElementById(monitorsCaIcontainerId).innerHTML += `
        <div class="monitors_ca_item empty"><p class="atleast_text"> Please select at least two products to compare </p></div>`;
      } else if (numCompareListItems == 2) {
        document.getElementById('monitors_ca_compare_disabled').style.display = "none"; 
        document.getElementById('monitors_ca_compare_products').style.display = "block";
        
        let emptyDivs = document.querySelectorAll('.monitors_ca_item.empty');
        emptyDivs.forEach(function(div) {
          div.remove();
        });
      }
    }
  }

  return;
}
