const initFindifyAutocompleteEvents = () => {
  let selector = "input[name='q']";
  let rid, q, item_limit;
  let activeInput;

  const getSearchDestination = (query) => {
    const root = window.Shopify.routes.root ? window.Shopify.routes.root : '';
    return `${root}search?q=${query}`;
  };

  if (findify) {
    let meta = findify.autocomplete.state.meta;
    rid = meta.rid;
    q = meta.q;
    item_limit = meta.item_limit;
  }

  const redirectionFeedback = async (query, rid) => {
    try {
      findify.core.analytics.sendEvent('redirect', {
        rid,
        suggestion: query,
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  /**
   *
   * @param {*} url destination to navigat to
   * @param {*} e event
   * @param {*} query search term
   * @param {*} rid last request id
   * @returns
   */
  const navigate = (e, query, rid) => {
    const url = getSearchDestination(query);
    const openInNewWindow = e && (e.ctrlKey || e.metaKey);
    const redirections = findify.core.merchantConfig.redirections;
    const redirectionURL =
      redirections && redirections[query] ? redirections[query] : url;

    if (redirections && redirections[query]) redirectionFeedback(query, rid);
    if (window) {
      if (openInNewWindow) window.open(redirectionURL, '_blank');
      window.location.href = redirectionURL;
    }
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onSearch = (e) => {
    preventDefaults(e);
    const query = e.target.value;
    navigate(e, query);
  };

  const initSuggestionAnalytics = async (e, suggestion) => {
    const { q: query, rid } = findify.autocomplete.state.meta;
    try {
      findify.core.analytics.sendEvent('click-suggestion', {
        rid,
        suggestion: suggestion,
      });
    } catch (error) {
      console.log('error', error);
    }
    return navigate(e, suggestion, rid);
  };

  const initOnSuggestionEvents = () => {
    document
      .querySelectorAll('.findify-autocomplete [data-findify-suggestion]')
      .forEach((i) => {
        i.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          const suggestion = e.target?.innerText;
          initSuggestionAnalytics(e, suggestion);
        });
      });
  };

  const getBottom = (el) => {
    const { bottom } = el.getBoundingClientRect();
    return bottom;
  };

  const setAutocompletePosition = (input) => {
    const top = getBottom(input) + 2;

    const { left, width } = input.getBoundingClientRect();
    const autocomplete = document.querySelector('.findify-autocomplete');
    autocomplete.style.top = `${top}px`;
    autocomplete.style.height = `max-content`;
    autocomplete.style.maxHeight = `calc(100vh - ${top}px)`;
    autocomplete.style.left = `${left}px`;
    autocomplete.style.width = `${width + 50}px`;
  };

  const closeAutocomplete = (e, isEscape) => {
    if (
      isEscape ||
      !document
        .querySelector('.findify-autocomplete')
        .className.includes('findify-hidden')
    ) {
      document.querySelector('.findify-autocomplete').className += ' findify-hidden';
      activeInput?.parentNode?.querySelector('button[type="submit"]')?.focus();
    }
    document.removeEventListener(`keydown`, initTrapFocus);
  };

  const closeAutocompleteOutside = (e, input) => {
    const findifyAutocomplete = document.querySelector('.findify-autocomplete');
    if (!findifyAutocomplete.contains(e.target) && !input.contains(e.target)) {
      closeAutocomplete(e);
      document.removeEventListener('click', closeAutocompleteOutside);
    }
  };
  const initTrapFocus = (e) => {
    const isTabPressed = e.key === `Tab` || e.keyCode === 9;

    if (!isTabPressed ) return
    
    const modal = document.querySelector(".findify-autocomplete");
    const focusableElements = `a, button, [href], input:not([type="hidden"]), select, textarea, iframe, [tabindex]:not([tabindex="-1"])`;

    const focusableContent = modal.querySelectorAll(focusableElements);

    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    if (document.activeElement === activeInput) {
      firstFocusableElement.focus()
      e.preventDefault();
      return
    };

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        activeInput.focus();
        e.preventDefault();
      }
    } else if (document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus();
      e.preventDefault();
    }
  };
  const openAutocomplete = (input) => {
    activeInput = input;
    const autocompleteClassName = document.querySelector(
      '.findify-autocomplete'
    ).className;
    document.querySelector('.findify-autocomplete').className =
      autocompleteClassName.replace(' findify-hidden', '');
    document
      .querySelector('.findify-close-autocomplete')
      ?.addEventListener('click', (e) => closeAutocomplete(e));
    document.addEventListener('click', (e) =>
      closeAutocompleteOutside(e, input)
    );
    setAutocompletePosition(input);
    document.addEventListener(`keydown`, initTrapFocus);
  };

  const loadFindifyAutocomplete = async (event) => {
    const hasQueryChanged = !event || event.target.value !== q;

    if (hasQueryChanged) {
      q = event ? event.target.value : '';
      event.target.removeEventListener('focus', loadFindifyAutocomplete);
      event.target.removeEventListener('keyup', handleFindifyChange);
      latestResponse = await findify.autocomplete.api(q);
      rid = latestResponse.meta.rid;
      await findify.autocomplete.render(latestResponse, findify.autocomplete.liquid);
    }

    if (event.type == 'focus')
      setTimeout(() => openAutocomplete(event.target), 200);
    else openAutocomplete(event.target);
  };

  const msDelay = 500;
  const delay = (fn, ms) => {
    let timer;
    return {
      call(...args) {
        clearTimeout(timer);
        timer = setTimeout(fn.bind(this, ...args), ms || 0);
      },

      cancel() {
        clearTimeout(timer);
      },
    };
  };

  const delayLoadFindifyAutocomplete = delay(loadFindifyAutocomplete, msDelay);

  const handleFindifyChange = (e) => {
    if (e.code == 'Enter') {
      onSearch(e);
    } else if (e.code == 'Escape') {
      closeAutocomplete(e, true);
    } else {
      delayLoadFindifyAutocomplete.cancel();
      delayLoadFindifyAutocomplete.call(e);
    }
  };

  const initializeFindifyAutocomplete = () => {
    const inputDomRefs = document.querySelectorAll(selector);
    inputDomRefs.forEach((input) => {
      input.addEventListener('focus', loadFindifyAutocomplete);
      input.addEventListener('keyup', handleFindifyChange);
    });
    initOnSuggestionEvents();
  };

  const initializeFullscreenAutocomplete = () => {
    if (item_limit && item_limit > 4)
      document.querySelector('.findify-autocomplete').style.height = '100%';
    initializeFindifyAutocomplete();
  };

  initializeFullscreenAutocomplete();
};
