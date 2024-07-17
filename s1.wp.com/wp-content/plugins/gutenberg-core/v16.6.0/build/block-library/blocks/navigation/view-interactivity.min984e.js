(()=>{"use strict";const e=window.wp.interactivity,n=["a[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","[contenteditable]",'[tabindex]:not([tabindex^="-"])'],o=(e,n)=>{const{context:o,ref:t,selectors:i}=e;i.core.navigation.menuOpenedBy(e)[n]=!0,o.core.navigation.previousFocus=t,"overlay"===o.core.navigation.type&&document.documentElement.classList.add("has-modal-open")},t=(e,n)=>{const{context:o,selectors:t}=e;t.core.navigation.menuOpenedBy(e)[n]=!1,t.core.navigation.isMenuOpen(e)||(o.core.navigation.modal?.contains(window.document.activeElement)&&o.core.navigation.previousFocus.focus(),o.core.navigation.modal=null,o.core.navigation.previousFocus=null,"overlay"===o.core.navigation.type&&document.documentElement.classList.remove("has-modal-open"))};(0,e.store)({effects:{core:{navigation:{initMenu:e=>{const{context:o,selectors:t,ref:i}=e;if(t.core.navigation.isMenuOpen(e)){const e=i.querySelectorAll(n);o.core.navigation.modal=i,o.core.navigation.firstFocusableElement=e[0],o.core.navigation.lastFocusableElement=e[e.length-1]}},focusFirstElement:e=>{const{selectors:n,ref:o}=e;n.core.navigation.isMenuOpen(e)&&o.querySelector(".wp-block-navigation-item > *:first-child").focus()}}}},selectors:{core:{navigation:{roleAttribute:e=>{const{context:n,selectors:o}=e;return"overlay"===n.core.navigation.type&&o.core.navigation.isMenuOpen(e)?"dialog":""},isMenuOpen:({context:e})=>Object.values(e.core.navigation["overlay"===e.core.navigation.type?"overlayOpenedBy":"submenuOpenedBy"]).filter(Boolean).length>0,menuOpenedBy:({context:e})=>e.core.navigation["overlay"===e.core.navigation.type?"overlayOpenedBy":"submenuOpenedBy"]}}},actions:{core:{navigation:{openMenuOnHover(e){const{navigation:n}=e.context.core;"submenu"===n.type&&0===Object.values(n.overlayOpenedBy||{}).filter(Boolean).length&&o(e,"hover")},closeMenuOnHover(e){t(e,"hover")},openMenuOnClick(e){o(e,"click")},closeMenuOnClick(e){t(e,"click"),t(e,"focus")},openMenuOnFocus(e){o(e,"focus")},toggleMenuOnClick:e=>{const{selectors:n}=e,i=n.core.navigation.menuOpenedBy(e);i.click||i.focus?(t(e,"click"),t(e,"focus")):o(e,"click")},handleMenuKeydown:e=>{const{context:n,selectors:o,event:i}=e;if(o.core.navigation.menuOpenedBy(e).click){if("Escape"===i?.key)return t(e,"click"),void t(e,"focus");"overlay"===n.core.navigation.type&&"Tab"===i.key&&(i.shiftKey&&window.document.activeElement===n.core.navigation.firstFocusableElement?(i.preventDefault(),n.core.navigation.lastFocusableElement.focus()):i.shiftKey||window.document.activeElement!==n.core.navigation.lastFocusableElement||(i.preventDefault(),n.core.navigation.firstFocusableElement.focus()))}},handleMenuFocusout:e=>{const{context:n,event:o}=e;n.core.navigation.modal?.contains(o.relatedTarget)||o.target===window.document.activeElement||(t(e,"click"),t(e,"focus"))}}}}})})();
//# sourceMappingURL=view-interactivity.min.js.map