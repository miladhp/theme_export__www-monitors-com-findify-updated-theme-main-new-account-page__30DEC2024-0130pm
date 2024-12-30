!function(e,t){var n="Navigation";"function"==typeof define&&define.amd?define([],t(n)):"object"==typeof exports?module.exports=t(n):e[n]=t(n)}(this,(function(e){"use strict";var t={breakpoint:992,submenuTrigger:"click",overlay:!0,overlayColor:"rgba(0, 0, 0, 0.7)",autoSubmenuIndicator:!0,submenuIndicatorTrigger:!1,hideSubWhenClickOut:!0,scrollMomentum:!0,scrollSpy:!1,scrollSpySpeed:1e3,scrollSpyOffset:0,landscapeClass:"navigation-landscape",onInit:function(){},onLandscape:function(){},onShowOffCanvas:function(){},onHideOffCanvas:function(){}},n=function(e,t,n){this.namespaces||(this.namespaces={}),this.namespaces[e]=t;var i=n||!1;return this.addEventListener(e.split(".")[0],t,i),this},i=function(e,t){if(void 0!==this.namespaces&&this.namespaces[e])return this.removeEventListener(e.split(".")[0],this.namespaces[e],t),delete this.namespaces[e],this},a=function(e){if(void 0!==this.namespaces)return!!this.namespaces[e]};window.on=document.on=Element.prototype.on=n,window.off=document.off=Element.prototype.off=i,window.check=document.check=Element.prototype.check=a;var o=function(e,t){for(;null!==e&&"html"!==e.tagName.toLowerCase();){if(e.classList.length>0&&e.classList.contains(t))return!0;e=e.parentNode}return!1},s=function(){return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth};return function(e,n){var i,a,r="click",l=Number.MAX_VALUE,c=1;if(null===e)return!1;(i=e).init=function(e){i.options=function(e,n){var i,a={};for(i in t)Object.prototype.hasOwnProperty.call(t,i)&&(a[i]=t[i]);for(i in n)Object.prototype.hasOwnProperty.call(n,i)&&(a[i]=n[i]);return a}(0,e),i.navigationBody=i.getElementsByClassName("navigation-body")[0],i.menuItems=i.querySelectorAll(".navigation-item, .navigation-dropdown-item"),i.menuLinks=i.querySelectorAll(".navigation-link, .navigation-dropdown-link");for(var n=i.querySelectorAll(".navigation-dropdown, .navigation-megamenu"),s=0;s<n.length;s++)n[s].className+=" navigation-submenu",n[s].parentNode.className+=" has-submenu";if(i.options.autoSubmenuIndicator)for(s=0;s<i.menuItems.length;s++)if(i.menuItems[s].classList.contains("has-submenu")){var r=document.createElement("span");r.classList.add("submenu-indicator"),i.menuItems[s].children[1].classList.contains("navigation-dropdown-left")&&r.classList.add("submenu-indicator-left"),i.menuItems[s].children[0].appendChild(r)}a=!matchMedia("(hover: none)").matches,u(),window.on("resize",u),i.options.overlay&&(i.overlayPanel=document.createElement("div"),i.overlayPanel.classList.add("overlay-panel"),i.overlayPanel.style.background=i.options.overlayColor,i.appendChild(i.overlayPanel),i.overlayPanel.addEventListener("click",i.toggleOffcanvas)),i.getElementsByClassName("navigation-button-toggler")[0].on("click",(function(e){e.stopPropagation(),e.preventDefault(),i.toggleOffcanvas()})),i.getElementsByClassName("navigation-body-close-button")[0].on("click",i.toggleOffcanvas),i.getElementsByClassName("close-menu")[0].on("click",i.hideSubmenus("BODY")),i.options.hideSubWhenClickOut&&(document.on("touchstart.body",(function(e){!1===o(e.target,"navigation")&&i.hideSubmenus("BODY")})),document.on("click.body",(function(e){!1===o(e.target,"navigation")&&i.hideSubmenus("BODY")})));var l=i.querySelectorAll(".navigation-tabs");if(l.length>0)for(s=0;s<l.length;s++)h(l[s]);i.options.scrollMomentum&&i.navigationBody.classList.add("scroll-momentum"),i.options.onInit.call()};var u=function(){p(),s()<i.options.breakpoint&&l>i.options.breakpoint&&(i.classList.remove(i.options.landscapeClass),i.hideSubmenus("BODY"),g(),i.options.submenuIndicatorTrigger||m(r),f()),s()>i.options.breakpoint&&c<i.options.breakpoint&&(i.classList.contains(i.options.landscapeClass)||(i.className+=" "+i.options.landscapeClass),i.hideSubmenus("BODY"),g(),"click"===i.options.submenuTrigger||navigator.userAgent.match(/Mobi/i)||navigator.maxTouchPoints>1&&a?m(r):d(),i.options.onLandscape.call()),l=s(),c=s()};i.toggleOffcanvas=function(){i.classList.contains(i.options.landscapeClass)||(i.navigationBody.classList.contains("is-visible")||i.classList.contains(i.options.landscapeClass)?(i.navigationBody.className+=" is-invisible",i.navigationBody.check("transitionend")||i.navigationBody.on("transitionend",(function(){i.navigationBody.classList.remove("is-visible"),i.navigationBody.classList.remove("is-invisible"),i.navigationBody.off("transitionend")})),i.overlayPanel.className+=" is-invisible",i.overlayPanel.check("transitionend")||i.overlayPanel.on("transitionend",(function(){i.overlayPanel.classList.remove("is-visible"),i.overlayPanel.classList.remove("is-invisible"),i.overlayPanel.off("transitionend")})),i.options.onHideOffCanvas.call()):(i.navigationBody.className+=" is-visible",i.overlayPanel.classList.add("is-visible"),i.options.onShowOffCanvas.call()))},i.showSubmenu=function(e){e.nextElementSibling.classList.contains("is-visible")||(e.nextElementSibling.className+=" is-visible"),v(e)},i.hideSubmenus=function(e){for(var t,n,a=(t="BODY"===e?i.querySelectorAll(".navigation-submenu.is-visible"):e.parentNode.querySelectorAll(".navigation-submenu.is-visible")).length-1;a>=0;a--)i.classList.contains(i.options.landscapeClass)?(n=t[a],t.length,n.classList.remove("is-visible")):t[a].classList.remove("is-visible"),t[a].parentNode.classList.remove("is-active"),t[a].previousElementSibling.getElementsByClassName("submenu-indicator").length>0&&(t[a].previousElementSibling.lastElementChild.classList.remove("is-active"),jQuery(".navigation-tabs-nav-item.is-active").removeClass("is-active"),jQuery(".navigation-tabs-pane.is-active").removeClass("is-active"))};var m=function(e){for(var t=0;t<i.menuLinks.length;t++)i.menuLinks[t].on(e,(function(e){if(e.target.parentNode.classList.contains("has-submenu")){if(e.preventDefault(),e.stopPropagation(),!e.target.parentNode.classList.contains("is-active"))return e.target.parentNode.classList.contains("navigation-item")&&i.hideSubmenus("BODY"),e.target.parentNode.className+=" is-active",e.target.getElementsByClassName("submenu-indicator").length>0&&(e.target.lastElementChild.className+=" is-active"),i.hideSubmenus(e.target.parentNode),i.showSubmenu(e.target),!1;if(e.target.parentNode.classList.remove("is-active"),e.target.getElementsByClassName("submenu-indicator").length>0&&e.target.lastElementChild.classList.remove("is-active"),i.hideSubmenus(e.target),"_blank"===e.target.getAttribute("target")||"blank"===e.target.getAttribute("target"))window.open(e.target.getAttribute("href"));else{if("#"===e.target.getAttribute("href")||""===e.target.getAttribute("href")||"javascript:void(0)"===e.target.getAttribute("href"))return!1;window.location.href=e.target.getAttribute("href")}}}))},f=function(){i.navigationBody.on("click.indicator",(function(e){e.target.classList.length>0&&e.target.classList.contains("submenu-indicator")&&(e.preventDefault(),e.stopPropagation(),e.target.classList.contains("is-active")?(e.target.classList.remove("is-active"),e.target.parentNode.parentNode.classList.remove("is-active"),i.hideSubmenus(e.target.parentNode)):(e.target.parentNode.parentNode.classList.contains("navigation-item")&&i.hideSubmenus("BODY"),e.target.className+=" is-active",e.target.parentNode.parentNode.classList.add("is-active"),i.showSubmenu(e.target.parentNode)))}))},d=function(){for(var e=0;e<i.menuItems.length;e++)i.menuItems[e].classList.contains("has-submenu")&&(i.menuItems[e].on("mouseenter.item",(function(e){e.preventDefault(),e.stopPropagation(),e.target.classList.contains("has-submenu")&&(i.showSubmenu(e.target.firstElementChild),e.target.className+=" is-active")})),i.menuItems[e].on("mouseleave.item",(function(e){if(e.preventDefault(),e.stopPropagation(),e.target.classList.contains("has-submenu")){var t=(n=e.target.lastElementChild,{x:(a=n.getBoundingClientRect()).left,y:a.top});(e.clientX<t.x||e.clientX>t.x+e.target.lastElementChild.offsetWidth||e.clientY<t.y||e.clientY>t.y+e.target.lastElementChild.offsetHeight)&&(i.hideSubmenus(e.target.firstElementChild),e.target.classList.remove("is-active"))}var n,a})))},g=function(){i.navigationBody.off("click.indicator");for(var e=0;e<i.menuItems.length;e++)i.menuItems[e].off("mouseenter.item"),i.menuItems[e].off("mouseleave.item");for(e=0;e<i.menuLinks.length;e++)i.menuLinks[e].off("click")},v=function(e){if(s()>i.options.breakpoint){var t=i.navigationBody.offsetWidth;e.classList.contains("navigation-link")&&(e.offsetLeft+e.nextElementSibling.offsetWidth>t?e.nextElementSibling.style.right=0:e.nextElementSibling.style.right="auto")}},p=function(){for(var e=i.navigationBody.querySelectorAll(".navigation-item > .navigation-submenu"),t=i.navigationBody.offsetWidth,n=0;n<e.length;n++)e[n].previousElementSibling.offsetLeft+e[n].offsetWidth>t?e[n].style.right=0:e[n].style.right="auto"},h=function(e){for(var t=e.getElementsByClassName("navigation-tabs-nav-item"),n=e.getElementsByClassName("navigation-tabs-pane"),i=0;i<t.length;i++)t[i].on("mouseover",(function(e){e.preventDefault(),e.stopImmediatePropagation();for(var i=0;i<t.length;i++)t[i].classList.remove("is-active");e.target.parentNode.classList.add("is-active");for(i=0;i<n.length;i++)n[i].classList.remove("is-active");n[a(e.target.parentNode)].classList.add("is-active")}));function a(e){for(var t=e.parentNode.childNodes,n=0,i=0;i<t.length;i++){if(t[i]==e)return n;1==t[i].nodeType&&n++}return-1}},b=function(){var e=i.querySelectorAll(".navigation-link[href*='#']"),t=function(e){for(var t=[],n=0;n<e.length;n++){var i=e[n].getAttribute("href");if(i.length>1&&"#"===i.substring(0,1)){var a=document.getElementById(i.substr(1)),o=Math.floor(a.offsetTop),s=o+Math.floor(a.offsetHeight);t.push({element:i,hash:i,top:o,bottom:s})}}return t},n=function(e,t){for(var n=0;n<e.length;n++){var i=e[n];if(i.getAttribute("href")===t)return i}},a=function(e){for(var t=0;t<e.length;t++){e[t].parentNode.classList.remove("is-active")}},o=function(e,t,n,a){var o={linear:function(e){return e},easeInQuad:function(e){return e*e},easeOutQuad:function(e){return e*(2-e)},easeInOutQuad:function(e){return e<.5?2*e*e:(4-2*e)*e-1},easeInCubic:function(e){return e*e*e},easeOutCubic:function(e){return--e*e*e+1},easeInOutCubic:function(e){return e<.5?4*e*e*e:(e-1)*(2*e-2)*(2*e-2)+1},easeInQuart:function(e){return e*e*e*e},easeOutQuart:function(e){return 1- --e*e*e*e},easeInOutQuart:function(e){return e<.5?8*e*e*e*e:1-8*--e*e*e*e},easeInQuint:function(e){return e*e*e*e*e},easeOutQuint:function(e){return 1+--e*e*e*e*e},easeInOutQuint:function(e){return e<.5?16*e*e*e*e*e:1+16*--e*e*e*e*e}},s=window.pageYOffset,r="now"in window.performance?performance.now():(new Date).getTime(),l=Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight),c=window.innerHeight||document.documentElement.clientHeight||document.getElementsByTagName("body")[0].clientHeight,u="number"==typeof e?e:e.offsetTop+i.options.scrollSpyOffset,m=Math.round(l-u<c?l-c:u);if("requestAnimationFrame"in window==!1)return window.scroll(0,m),void(a&&a());!function e(){var i="now"in window.performance?performance.now():(new Date).getTime(),l=Math.min(1,(i-r)/t),c=o[n](l);m<0&&(m=0),window.scroll(0,Math.ceil(c*(m-s)+s)),window.pageYOffset!==m?requestAnimationFrame(e):a&&a()}()};!function(){for(var s=0;s<e.length;s++){e[s].on("click.scrollSpy",(function(e){if(!e.target.classList.contains("submenu-indicator")&&e.target.getAttribute("href").length>1&&"#"===e.target.getAttribute("href").substring(0,1)){var t=e.target.getAttribute("href");document.getElementById(t.replace("#",""));t.length>0&&o(document.querySelector(t),i.options.scrollSpySpeed,"easeInOutCubic")}}))}var r=t(e);window.on("resize.scrollSpy",(function(){r=[],r=t(e)})),window.on("scroll.scrollSpy",(function(){for(var t,o,s,l=(t=this.pageYOffset,o=Math.abs(i.options.scrollSpyOffset),parseInt(t,10)+parseInt(o,10)),c=(this.pageXOffset,0);c<r.length;c++){var u=r[c];if(l>=u.top&&l<u.bottom){var m=u.hash;if(s=n(e,m)){a(e),s.parentNode.classList.add("is-active");break}}}}))}()};return i.init(n),i.options.scrollSpy&&(window.onload=function(){b()}),i}}));