const filterSearch = (filter_group_id, input_id) => {
    const filterSelector = '.findify-filters-checkbox-item';
    const filterTextSelector = '.findify-filters-checkbox-item-value';

    const filterGroupElement = document.getElementById(filter_group_id);
    const filters = filterGroupElement.querySelectorAll(filterSelector);
    const input = document.getElementById(input_id);

    const inputHandler = (e) => {
        const value = e.target.value.trim().toLowerCase();
        filters.forEach(item => {
            const text = item.querySelector(filterTextSelector).innerText.trim().toLowerCase();
            const shouldHide = value && !text.includes(value);
            item.setAttribute("aria-hidden", shouldHide.toString());
        });
    };

    input.addEventListener("input", inputHandler);
};

const collapseFilter = (element_id) => {
    const filterGroupElement = document.getElementById(element_id);
    const [header, body] = filterGroupElement.querySelectorAll('div');

    const headerClickHandler = (e) => {
        e.preventDefault();
        const isOpen = body.getAttribute("data-opened") === "true";
        body.setAttribute("data-opened", (!isOpen).toString());
    };

    header.addEventListener("click", headerClickHandler);
};

const onExpandToggle = (e) => {
  const btn = e.target;
  const wrapper = btn.closest('.findify-checkbox-filter-wrapper');
  const body = wrapper.querySelector('.findify-filters--body-wrapper');
  const isExpanded = wrapper.getAttribute('data-expanded') === "true";
  if(isExpanded) {
    body.scrollTop = 0;
    wrapper.setAttribute('data-expanded', 'false');
  }
  else {
    wrapper.setAttribute('data-expanded', 'true');
  }
}

const fixedFilters = () => {
  const isSticky = document.querySelector('.findify-filters-sticky');
  if (isSticky) {
    const isHorizontal = document.querySelector('.findify-search-section.findify-filters-horizontal');
    const search = document.querySelector('.findify-search-main');
    const filters = document.querySelector('#findify-filters');
    const { top: containerTop, bottom: containerBottom } = search.getBoundingClientRect();
    const searchHeight = document.getElementById('findify-product-grid').getBoundingClientRect().height;
    const filtersHeight = filters.offsetHeight;
    const windowHeight = window.innerHeight;

    if(filtersHeight > searchHeight) {
      return;
    }
    else {
      if (containerTop <= 0) {
        filters.classList.add('findify-fixed');
        filters.style.bottom = null;
  
        if (!isHorizontal) {
          if (containerBottom <= windowHeight) {
  
            filters.classList.remove('findify-fixed');
            filters.classList.add('findify-absolute');
            if (filtersHeight < windowHeight) {
              filters.style.bottom = null;
            } else {
              filters.style.bottom = `0px`;
            }
          } else {
            filters.classList.add('findify-fixed');
            filters.classList.remove('findify-absolute');
            filters.style.bottom = null;
          }
        }
      } else {
        // Reset when scrolled back to the top
        filters.classList.remove('findify-fixed', 'findify-absolute');
        filters.style.bottom = null;
      }
    }
  }
};

const convertToBytes = (value) => {
  const parts = value.split(/(\d+)/).filter(Boolean);
  const number = parseFloat(parts[0]);
  const unit = parts[1];

  if (unit === 'gb') {
    return number;
  } else if (unit === 'tb') {
    return number * 1024;
  }
  return number;
};

const sortFilters = (filterName) => {
  const filter = document.querySelector(`[data-filter-name="${filterName}"]`)
  const body = filter.querySelector('.findify-filters--body-wrapper');
  const children = Array.from(body.querySelectorAll('.findify-filters-checkbox-item'));

  children.sort((a, b) => {
    const aValue = convertToBytes(a.getAttribute('value'));
    const bValue = convertToBytes(b.getAttribute('value'));
    return aValue - bValue;
  });
  children.forEach(child => body.appendChild(child));
}

window.addEventListener('scroll', fixedFilters);
fixedFilters();