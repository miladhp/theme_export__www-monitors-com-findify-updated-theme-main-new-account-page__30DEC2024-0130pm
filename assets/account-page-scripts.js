window.onload = function() {

    //script to manage profile form functionalities 
  
    const profileEditBtn = document.querySelector('#profileEditBtn');
    const profileForm = document.getElementById('customer-info-form');
    const profileEditCloseBtn = document.querySelector('#editProfileClose');
  
    profileEditBtn.addEventListener('click', handleProfileEditClick);
    profileEditCloseBtn.addEventListener('click', handleProfileEditCloseBtn)
  
    function handleProfileEditClick(){
      
      const inputs = profileForm.querySelectorAll('.toggle-disable');
      const profileEditSubmitBtn = profileForm.querySelector('#save-button');
      const phoneCode = profileForm.querySelector('#phone_code');
      const selectPhoneCode = profileForm.querySelector('.select-dropdown-flex');
      const phoneNumber = profileForm.querySelector('#phone');
  
      const phoneCodeValue = phoneCode.value;
  
      const phoneNumberWithoutCode = phoneNumber.value.replace(phoneCodeValue, '').trim();
  
      inputs.forEach(input => {
        input.removeAttribute('disabled');
      });
  
      phoneCode.classList.add('edit-phone');
      selectPhoneCode.classList.add('edit-phone');
      phoneNumber.classList.add('edit-phone');
  
      phoneNumber.value = phoneNumberWithoutCode;
  
      profileEditSubmitBtn.style.display = "block";
      profileEditBtn.style.display = "none";
      profileEditCloseBtn.style.display = "block";
      
    }
  
    function handleProfileEditCloseBtn(){
      const inputs = profileForm.querySelectorAll('.toggle-disable');
      const profileEditSubmitBtn = profileForm.querySelector('#save-button');
      const phoneCode = profileForm.querySelector('#phone_code');
      const selectPhoneCode = profileForm.querySelector('.select-dropdown-flex');
      const phoneNumber = profileForm.querySelector('#phone');
  
  
      const fullPhoneNumber = `${phoneCode.value}${phoneNumber.value}`.trim();
  
      
      inputs.forEach(input => {
        input.setAttribute('disabled', true);
      });
      document.querySelector('#save-button').disabled = true;
  
      phoneCode.classList.remove('edit-phone');
      selectPhoneCode.classList.remove('edit-phone');
      phoneNumber.classList.remove('edit-phone');
  
      phoneNumber.value = fullPhoneNumber;
  
      profileEditSubmitBtn.style.display = "none";
      profileEditBtn.style.display = "block";
      profileEditCloseBtn.style.display = "none";
  
    }
  
  
    // function to populate country codes with flag
  function populateCountryCodesSelect() {
    const phoneCodesSelect = document.querySelector('#phoneCodesSelect');
    const phoneCodeData = countryPhoneCodes;
    const phoneCode = document.querySelector('#phone_code');
    const phone = document.querySelector('#phone').value;
  
    const customerCountry = getCountryFromPhoneNumber(phone);
  
    let foundMatch = false;
    let customerPhoneData = {};
  
    phoneCodeData.forEach(function(country) {
      const option = document.createElement('option');
      option.value = country.code; 
      option.textContent = `${country.country} (${country.code})`;
      option.setAttribute('data-code', country.shopifyCode);
      
      // Check if this option matches the customerCountry and set as selected
      if (country.shopifyCode === customerCountry) {
        option.selected = true;
        foundMatch = true;
        customerPhoneData = {
          countryCode: country.shopifyCode,
          code: country.code,
          country: country.country
        }
      }
  
      phoneCodesSelect.appendChild(option);
    });
  
    function handlePhoneCodeChange(event) {
      const selectedOption = event.target.options[event.target.selectedIndex];
      const selectedValue = event.target.value;
      const countryCode = selectedOption.getAttribute('data-code');
  
      const bgFlag = document.querySelector('.bg-flag');
      bgFlag.style.backgroundImage = `url(https://cdn.shopify.com/static/images/flags/${countryCode.toLowerCase()}.svg)`;
      phoneCode.value = selectedValue;
    }
  
    phoneCodesSelect.addEventListener('change', handlePhoneCodeChange);
  
    // Trigger the change event manually to update the flag
    if (foundMatch) {
      phoneCodesSelect.dispatchEvent(new Event('change'));
    }
  
  
  }
  
    populateCountryCodesSelect();
  
    // end country codes
  
    //manage profile form submit
    
    const saveBtn = profileForm.querySelector('#save-button');
  
    saveBtn.addEventListener('click', function(e) {
      e.preventDefault();
    
      const firstName = profileForm.querySelector('#first_name').value.trim();
      const lastName = profileForm.querySelector('#last_name').value.trim();
      const phone = profileForm.querySelector('#phone').value.trim();
      const phoneCode = profileForm.querySelector('#phone_code').value.trim();
      const email = profileForm.querySelector('#email').value.trim();
      const customerId = profileForm.getAttribute('data-customer-id');
      const editProfileURL = "https://developmentquote.monitors.com/shopify/customer/update-profile";
    
      const fullPhoneNumber = `${phoneCode}${phone}`.trim();
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      if (!firstName) {
        handleInlinePopup("error", "First name cannot be empty");
        return;
      }
      
      if (!lastName) {
        handleInlinePopup("error", "Last name cannot be empty");
        return;
      }
  
      if (!email) {
        handleInlinePopup("error", "Email cannot be empty");
        return;
      }
      
      if (!emailRegex.test(email)) {
        handleInlinePopup("error", "Invalid email format");
        return;
      }
      
      if (!phoneCode || !phone) {
        handleInlinePopup("error", "Phone number cannot be empty");
        return;
      }
    
      const customerData = {
        customer: {
          id: customerId,
          first_name: firstName,
          last_name: lastName,
          phone: fullPhoneNumber,
          email: email
        }
      };
    
      console.log(customerData);
    
      handleInlinePopup('info', "Updating user info.");
    
      try {
        fetch(editProfileURL, {
          method: 'POST',
          body: JSON.stringify(customerData),
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if (data.status == 'error') {
              handleInlinePopup("error", data.message);
            } else if (data.status == true) {
              handleInlinePopup('success', "User info updated successfully!");
              profileEditCloseBtn.click();
            }
            document.querySelector('#save-button').disabled = true;
          })
          .catch(error => {
            handleInlinePopup("error", error);
            document.querySelector('#save-button').disabled = true;
          });
      } catch (err) {
        handleInlinePopup("error", err);
        document.querySelector('#save-button').disabled = true;
      }
    });
    
  
    
    // end profile form submit
  
  
  
    // scripts to manage address functionalities
  
    const addressAddBtn = document.querySelector('#addAddressBtn');
    const cancelAddAddress = document.querySelector('#cancelAddAddress');
  
    if (addressAddBtn) {
        addressAddBtn.addEventListener('click', handleAddAddress);
    }
  
    function handleAddAddress(){
        const addressList = document.querySelector('#addressList');
        addressList.classList.add('hide');
  
        const addressAdd = document.querySelector('#addressAdd');
        addressAdd.classList.remove('hide');
    }
  
    if(cancelAddAddress){
        cancelAddAddress.addEventListener('click', handleCancelAddAddress);
    }
  
    function handleCancelAddAddress(){
        const addressList = document.querySelector('#addressList');
        addressList.classList.remove('hide');
  
        const addressAdd = document.querySelector('#addressAdd');
        addressAdd.classList.add('hide');
    }
  
  
    // submit add address functionality
  
    console.log("form script loaded...")
    const addressForm = document.getElementById('customerAddressForm');
    const submitButton = document.getElementById('submitAddressForm');
  
    if (addressForm) {
        addressForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission
  
            const AddressFirstNameNew = document.getElementById('AddressFirstNameNew').value.trim();
            const AddressLastNameNew = document.getElementById('AddressLastNameNew').value.trim();
            const AddressPhoneNew = document.getElementById('AddressPhoneNew').value.trim();
            const AddressAddress1New = document.getElementById('AddressAddress1New').value.trim();
            const AddressAddress2New = document.getElementById('AddressAddress2New').value.trim();
            const AddressCityNew = document.getElementById('AddressCityNew').value.trim();
            const AddressZipNew = document.getElementById('AddressZipNew').value.trim();
  
  
            if (!AddressFirstNameNew) {
              handleInlinePopup('error', 'First name cannot be empty');
                return;
            }
            if (!AddressLastNameNew) {
              handleInlinePopup('error', 'Last name cannot be empty');
                return;
            }
            if (!AddressPhoneNew) {
              handleInlinePopup('error', 'Phone cannot be empty');
                return;
            }
            if (!AddressAddress1New) {
              handleInlinePopup('error', 'Address Line 1 cannot be empty');
                return;
            }
            if (!AddressAddress2New) {
              handleInlinePopup('error', 'Address Line 2 cannot be empty');
                return;
            }
            if (!AddressCityNew) {
              handleInlinePopup('error', 'City cannot be empty');
                return;
            }
            if (!AddressZipNew) {
              handleInlinePopup('error', 'Zip code cannot be empty');
                return;
            }
  
            const formData = new FormData(addressForm);
  
            handleInlinePopup("info", "Adding Address");
  
            fetch(addressForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest', 
                    'Accept': 'text/javascript, application/javascript'
                }
            })
            .then(response => {
                if (response.ok) {
                  handleInlinePopup("success", "Address added successfully!");
                  setTimeout(()=> window.location.reload(), 1000);
                } else {
                  handleInlinePopup('error', "Form submission failed.");
                }
            })
            .catch(error => {
              handleInlinePopup('error', 'Something went wrong.');
              console.log(error);
            });
        });
    }
  
    // edit address functionality
  
    const editAddressBtns = document.querySelectorAll('.edit-address-btn');
    const allEditAddresses = document.querySelectorAll('.account-edit-form');
    const addressElements = document.querySelectorAll('.address-element');
    const cancelEditForm = document.querySelectorAll('.cancelEditForm');
  
    editAddressBtns.forEach(e => {
      e.addEventListener('click', function(k){
        k.preventDefault();
  
        allEditAddresses.forEach(address => {
          address.classList.add('hide');
        });
  
        addressElements.forEach(address => {
          address.classList.add('hide');
        });
  
        const nextElement = e.closest('.address-item').nextElementSibling;
        if (nextElement && nextElement.classList.contains('account-edit-form')) {
          nextElement.classList.remove('hide');
        }
      })
    })
  
  
    // end edit address
  
    // cancel edit form
  
    cancelEditForm.forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
    
        addressElements.forEach(item => {
          item.classList.remove('hide');
        });
    
        const currentEditAddress = button.closest('.account-edit-form');
        if (currentEditAddress) {
          currentEditAddress.classList.add('hide');
        }
      });
    });
  
    // end cancel edit form
  
    //handle edit form submit
  
    const editForms = document.querySelectorAll('form[id^="address_form"]');
  
    if(editForms){
      editForms.forEach(function(form){
        form.addEventListener('submit', function(e){
          e.preventDefault();
          handleEditFormSubmit(form);
        })
      })
    }
  
    function handleEditFormSubmit(form){
      try {
  
        const formData = new FormData(form);
  
        handleInlinePopup("info", "Updating Address");
  
        fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
              'X-Requested-With': 'XMLHttpRequest', 
              'Accept': 'text/javascript, application/javascript'
          }
      })
      .then(response => {
          if (response.ok) {
              // console.log("worked.......", response);
              handleInlinePopup("success", "Address updated successfully!");
              setTimeout(()=> window.location.reload(), 1000);
          } else {
              handleInlinePopup('error', "Form submission failed.");
          }
      })
      .catch(error => {
        handleInlinePopup('error', "Error in submission of form.");
        console.log(error);
      });
      } catch (error) {
        handleInlinePopup('error', 'Something went wrong.');
        console.log(error);
      }
    }
  
  
    // end sumbit edit form
  
  
  
  
    // set as default address functionality, 
  
    const setAsDefaultForms = document.querySelectorAll('form[id^="customer-address-form"]');
  
    if(setAsDefaultForms){
      setAsDefaultForms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
  
            var formData = new FormData(form); // Collect form data
            const body = document.querySelector('body');
            handleInlinePopup('info', 'Updating Address')
  
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest' // To identify the AJAX request
                }
            })
            .then(function(response) {
                if (response.ok) {
                    // window.location.href = '/account#address-tab';
                    console.log('default address changed..');
                    const currentDefault = document.querySelectorAll('.address-item.default');
                    body.classList.remove('show-inline-popup');
                    body.classList.add('address-update', 'show-main-popup');
  
                    currentDefault.forEach(function(item) {
                        item.classList.remove('default');
                    });
  
                    form.closest('.address-item').classList.add('default');
  
                    setTimeout(function(){
                      body.classList.remove('show-main-popup', 'address-update');
                    }, 3000);
  
                } else {
                    console.error('Form submission failed.');
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
            });
        });
      });
    }
  
    // end address script
  
  
    // script to manage delete of addresses
  
    // bind remove form buttons with event listeners
  
    const addressDeleteForms = document.querySelectorAll('.address-delete-form');
  
    if(addressDeleteForms){
      addressDeleteForms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault(); 
          showConfirmationPopup(form); 
        });
      });
    }
  
    // function to show popup 
  
    function showConfirmationPopup(form) {
      // Show the popup
      const body = document.querySelector('body');
      body.classList.add('show-main-popup', 'address-delete');
  
      // Handle Confirm Button
      const confirmButton = document.getElementById('confirm-delete');
      confirmButton.onclick = function() {
        submitDeleteForm(form); // Submit the form via AJAX
        body.classList.remove('show-main-popup', 'address-delete');
        handleInlinePopup('info', 'Deleting Address');
      };
  
      // Handle Cancel Button
      const cancelButton = document.getElementById('cancel-delete');
      cancelButton.onclick = function() {
        body.classList.remove('show-main-popup', 'address-delete');
      };
    }
    // end show popup
  
    // handle submit of delete form
    function submitDeleteForm(form) {
      const formData = new FormData(form);
  
      const addressItem = form.closest('.address-item.address-element');
  
      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest' 
        }
      })
      .then(function(response) {
        if (response.ok) {
          // form.closest('.address-item').remove();
        //   console.log('address deleted.')
          handleInlinePopup('success', 'Address deleted successfully.');
          addressItem.remove();
        } else {
            handleInlinePopup('error', 'Failed to delete this address');
        }
      })
      .catch(function(error) {
        console.error('error:', error);
      });
    }
    // end handle submit of delete.
  
    // end delete script
  
  
    // manage inline popup 
  
    function handleInlinePopup(type, message){
        const body = document.querySelector('body');
        const inlinePopupContainer = document.querySelector('.inline-popup');
        const popupText = document.querySelector('.inline-popup h3');
  
        if(type == "success"){
            inlinePopupContainer.style.backgroundColor = "#14A44D";
        }
        else if(type == "error"){
            inlinePopupContainer.style.backgroundColor = "#DC4C64";
        }
        else{
            inlinePopupContainer.style.backgroundColor = "#332D2D";
        }
        popupText.innerHTML = message;
        body.classList.add('show-inline-popup');
  
        setTimeout(function(){
            body.classList.remove('show-inline-popup');
        }, 2000);
  
    }
  
  
    // end inline popup
  
  
    // function to get country from phone number
    function getCountryFromPhoneNumber(phoneNumber, defaultCountry = "US") {
      try {
          // Parse the phone number and use a default country if none is provided
          const phone = libphonenumber.parsePhoneNumberFromString(phoneNumber, defaultCountry);
          if (phone && phone.isValid()) {
              return phone.country;
          } else {
              return 'Invalid phone number';
          }
      } catch (error) {
          return 'Error parsing phone number';
      }
    }
  
    // end
  
    // script to manage change password functionality
  
    document.getElementById('custom-password-form').addEventListener('submit', function(event) {
      event.preventDefault(); 
  
      const customerId = document.querySelector('#custom-password-form').getAttribute('data-customer-id');
      const newPassword = document.getElementById('new_password').value;
      const confirmPassword = document.getElementById('confirm_password').value;
  
      let formIsValid = true;
  
      document.getElementById('new_password_error').style.display = 'none';
      document.getElementById('confirm_password_error').style.display = 'none';
      document.getElementById('main-error-message').style.display = 'none';
      document.getElementById('main-error-message').textContent = '';
  
      if (newPassword === '' || newPassword.length < 6 || newPassword.length > 40) {
        document.getElementById('new_password_error').textContent = 'Password must be between 6 to 40 characters.';
        document.getElementById('new_password_error').style.display = 'block';
        formIsValid = false;
      }
  
      if (confirmPassword === '') {
        document.getElementById('confirm_password_error').textContent = 'Please confirm your password.';
        document.getElementById('confirm_password_error').style.display = 'block';
        formIsValid = false;
      } else if (newPassword !== confirmPassword) {
        document.getElementById('confirm_password_error').textContent = 'Passwords do not match.';
        document.getElementById('confirm_password_error').style.display = 'block';
        formIsValid = false;
      }
  
      if (!formIsValid) {
        document.getElementById('main-error-message').textContent = 'Please fix the errors before submitting.';
        document.getElementById('main-error-message').style.display = 'block';
        return; 
      }
  
      const customerData = {
          customer: {
            id: customerId,
            password: newPassword,
            password_confirmation: confirmPassword
          }
        }
      
      fetch('https://developmentquote.monitors.com/shopify/customer/change-password', {
         method: 'POST', 
         body: JSON.stringify(customerData),
      })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
        
          handleInlinePopup('success', 'Password has been updated successfully!');
          setTimeout(() => window.location.reload(), 2000);
        
      } else {
          handleInlinePopup('error', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        handleInlinePopup('error', 'There was an error processing your request.');
      });
    });
    // end change password functionality
  
  
    // handle edit save button disabled if no value is changed
  
    function handleEditFormValues(){
      console.log("disable btn functionality test...");
  
      const forms = document.querySelectorAll('form[id^="address_form"]'); 
  
      forms.forEach(form => {
        const submitButton = form.querySelector('button[type="submit"]');
        const inputs = form.querySelectorAll('input, select, textarea');
  
        const initialFormData = new FormData(form);
  
        submitButton.disabled = true;
  
        function checkFormChanges() {
          const currentFormData = new FormData(form);
          let isChanged = false;
  
          for (let [key, value] of initialFormData.entries()) {
            if (currentFormData.get(key) !== value) {
              isChanged = true;
              break;
            }
          }
  
          submitButton.disabled = !isChanged;
        }
  
        inputs.forEach(input => {
          input.addEventListener('input', checkFormChanges);
          input.addEventListener('change', checkFormChanges); 
        });
      });
    }
  
    handleEditFormValues();
  
    // end
  
    // function to handle hide / show order page
  
    function handleAccordionOrderPage(){
      const accordionHeaders = document.querySelectorAll('.order-container .header-tab-cta');
  
      accordionHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const accordionItem = this.closest('.order-item');
            accordionItem.classList.toggle('active');
        });
      });
  
      const accordionLinks = document.querySelectorAll('.order-header a');
  
      accordionLinks.forEach(link => {
        link.addEventListener('click', function(event) {
          event.stopPropagation();
        });
      });
  
      const accordionButtons = document.querySelectorAll('.order-header button');
  
      accordionButtons.forEach(button => {
        button.addEventListener('click', function(event) {
          event.stopPropagation();
        });
      });
  
    }
  
    handleAccordionOrderPage();
  
    //end 
  
  
  
    // function to handle pagination click via javascript
  
    function setupPaginationRedirect() {
      const paginationLinks = document.querySelectorAll('.pagination-action');
  
        paginationLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault(); 
    
                const targetHref = link.getAttribute('data-href');
                if (targetHref) {
                    window.location.href = targetHref;
                }
            });
        });
    }
    
    setupPaginationRedirect();
  
  
    // end pagination click
  
    // check value change for profile form
  
    function valueCheckProfileForm() {
      const form = document.getElementById('customer-info-form');
      const saveButton = document.getElementById('save-button');
  
      const initialValues = {
        first_name: document.getElementById('first_name').value.trim(),
        last_name: document.getElementById('last_name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        phone_code: document.getElementById('phone_code').value.trim()
      };
    
      function checkForChanges() {
        const currentValues = {
          first_name: document.getElementById('first_name').value.trim(),
          last_name: document.getElementById('last_name').value.trim(),
          email: document.getElementById('email').value.trim(),
          phone: document.getElementById('phone').value.trim(),
          phone_code: document.getElementById('phone_code').value.trim()
        };
    
        
        if (JSON.stringify(initialValues) !== JSON.stringify(currentValues)) {
          saveButton.disabled = false;
        } else {
          saveButton.disabled = true;
        }
      }
    
      
      document.getElementById('first_name').addEventListener('input', checkForChanges);
      document.getElementById('last_name').addEventListener('input', checkForChanges);
      document.getElementById('email').addEventListener('input', checkForChanges);
      document.getElementById('phone').addEventListener('input', checkForChanges);
      document.getElementById('phone_code').addEventListener('input', checkForChanges);
  
      document.getElementById('phoneCodesSelect').addEventListener('change', checkForChanges);
    
      saveButton.disabled = true;
    }
  
    valueCheckProfileForm();
  
    // end value check profile form
  
    // function for buy it now functionality
  
    document.querySelectorAll('.buy-it-now-btn').forEach(button => {
      button.addEventListener('click', function(){
        const items = JSON.parse(this.getAttribute('data-items'));
        if(items){
          addToCart(items)
          .then(message => {
            const buttonText = button.innerHTML;
            if(message == 'Success'){
              button.innerHTML = "Item Added!";
              setTimeout(() => {
                const cartToggleButton = document.querySelector('.header__action-item-link.header__cart-toggle');
                if (cartToggleButton) {
                  cartToggleButton.click();
                }
              }, 1000);
              setTimeout(() => button.innerHTML = buttonText, 2000);
            }
          })
        }
      })
    })
  
    // end buy it now
  
    // function to manage re-order functionality for full order 
  
    // document.querySelectorAll('.reorder-button').forEach(button => {
    //   button.addEventListener('click', function() {
    //     const items = JSON.parse(this.getAttribute('data-items'));
    //     addToCart(items);
    //   });
    // });
    
    async function addToCart(items) {
      document.dispatchEvent(new CustomEvent('theme:loading:start'));
    
      return fetch("/cart/add.js", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          items: items
        }),
        credentials: 'same-origin'
      })
      .then(response => {
        document.dispatchEvent(new CustomEvent('theme:loading:end'));
    
        if (response.ok) {
          document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
            bubbles: true
          }));
          return 'Success';
    
        } else {
          return response.json().then(function(content) {
            const errorMsg = content['description'];
            handleInlinePopup('error', errorMsg); 
            throw new Error(errorMsg);
          });
        }
      })
      .catch(function(error) {
        handleInlinePopup('error', 'Error adding items to cart: ' + error.message);
        document.dispatchEvent(new CustomEvent('theme:loading:end'));
        console.log('Error:', error.message); // Log the error
      });
    }
    
    
  
    // end full order reorder
  
    // add to cart functionality buy again
  
    document.querySelectorAll('.buy-again-add-to-cart').forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
  
        const variantId = this.getAttribute('data-product-id');
        const quantityInput = this.closest('.product-item').querySelector('.buy-again-quantity-input');
        const quantity = parseInt(quantityInput.value, 10);
        const items = [{ id: variantId, quantity: quantity }];
    
        if(items){
          addToCart(items)
          .then(message => {
            const buttonText = button.innerHTML;
            if(message == 'Success'){
              button.innerHTML = "Item Added!"
              setTimeout(() => {
                const cartToggleButton = document.querySelector('.header__action-item-link.header__cart-toggle');
                if (cartToggleButton) {
                  cartToggleButton.click();
                }
              }, 300);
              
              setTimeout(() => button.innerHTML = buttonText, 2000);
            }
          })
          .catch(error => {
            handleInlinePopup('error', `${error.message}:${error.description}`);
          })
        }
      });
    });
  
    // end add to cart on buyagain
  
    // functionality for reorder selected items
  
    function handleCheckboxCheck() {
      const blocks = document.querySelectorAll('.order-content');
    
      blocks.forEach(block => {
        const checkboxes = block.querySelectorAll('.reorder-checkbox-container input');
        const reorderBtn = block.querySelector('.reorder-button');
    
        function toggleButtonVisibility() {
          const selectedItems = [];
    
          checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
              const variantId = checkbox.getAttribute('data-variant-id');
              const quantity = checkbox.getAttribute('data-quantity');
    
              selectedItems.push({
                id: variantId,
                quantity: quantity
              });
            }
          });
    
          reorderBtn.setAttribute('data-items', JSON.stringify(selectedItems));
    
          const isAnyChecked = selectedItems.length > 0;
          if (isAnyChecked) {
            block.classList.add('reorder-btn-show');
          } else {
            block.classList.remove('reorder-btn-show');
          }
        }
    
        // Add event listeners to the checkboxes in the current block
        checkboxes.forEach(checkbox => {
          checkbox.addEventListener('change', toggleButtonVisibility);
        });
      });
    }    
  
    handleCheckboxCheck();
  
    document.querySelectorAll('.reorder-button').forEach(button => {
      button.addEventListener('click', function(){
        const items = JSON.parse(this.getAttribute('data-items'));
        if(items){
          addToCart(items)
          .then(message => {
            const buttonText = button.innerHTML;
            if(message == 'Success'){
              button.innerHTML = "Items Added!";
              setTimeout(() => {
                const cartToggleButton = document.querySelector('.header__action-item-link.header__cart-toggle');
                if (cartToggleButton) {
                  cartToggleButton.click();
                }
              }, 1000);
              setTimeout(() => button.innerHTML = buttonText, 2000);
            }
          })
          .catch(error => {
            handleInlinePopup('error', `${error.message}:${error.description}`);
          })
        }
      })
    })
  
  
    // end reorder selected ones
  
  
    // scripts to manage add review popup and functionality
  
    function addAReview(){
      const addReviewBtns = document.querySelectorAll('.write-review-btn');
  
      addReviewBtns.forEach(button => {
          button.addEventListener('click', function(){
              const body = document.querySelector('body');
              const reviewPopup = document.querySelector('#reviewPopup');
              const reviewForm = reviewPopup.querySelector('#custom-review-form');
  
              // Select all existing hidden input fields with the class 'product-details-hidden'
              const existingHiddenInputs = reviewForm.querySelectorAll('input.product-details-hidden');
  
              if (existingHiddenInputs) {
                existingHiddenInputs.forEach(e => e.remove());
              }
  
              const hiddenProductInputs = `
                <input type="hidden" class="product-details-hidden" name="productId" value="${this.dataset.productId}">
                <input type="hidden" class="product-details-hidden" name="productName" value="${this.dataset.productName}">
                <input type="hidden" class="product-details-hidden" name="productSKU" value="${this.dataset.productSku}">
                <input type="hidden" class="product-details-hidden" name="productType" value="${this.dataset.productType}">
                <input type="hidden" class="product-details-hidden" name="productImageUrl" value="${this.dataset.productImageUrl}">
                <input type="hidden" class="product-details-hidden" name="productUrl" value="${this.dataset.productUrl}">
              `;
  
  
              reviewForm.insertAdjacentHTML('afterbegin', hiddenProductInputs);
  
              const productItemDetails = `<div class="product-image">
                                            <img src="${this.dataset.productImageUrl}">
                                        </div>
                                        <div class="product-title">
                                            <p>${this.dataset.productName}</p>
                                        </div>`;
  
              //  reviewPopup.querySelector('#productInfo').innerHTML = `${.thisdataset.productId}, ${this.dataset.productName}, ${this.dataset.productSku}, ${this.dataset.productType}, ${this.dataset.productImageUrl}, ${this.dataset.productUrl}`;
  
              reviewPopup.querySelector('#productInfo').innerHTML = productItemDetails;
  
              body.classList.add('show-review-popup');
          })
      })
  
      const closeBtn = document.querySelector('#popupCloseBtn');
      const reviewRatingInput = document.getElementById('reviewRating');
      const stars = document.querySelectorAll('.star');
  
      closeBtn.addEventListener('click', hanldeCloseBtnReviewPopup);
  
    }
  
    function hanldeCloseBtnReviewPopup(){
          
        document.querySelector('body').classList.remove('show-review-popup');
        const reviewForm = document.querySelector('#custom-review-form');
  
        const textInputs = reviewForm.querySelectorAll('input[type="text"], input[type="file"], textarea');
        const imageContainer = document.getElementById("uploaded-images");
  
        imageContainer.innerHTML = '';
        textInputs.forEach(input => {
            input.value = ''; 
        });
    
        reviewRatingInput.value = 0;
    
        stars.forEach(star => {
            const starFill = star.querySelector('.star-fill');
            starFill.setAttribute('fill', '#FFF'); 
        });
    }
  
    addAReview();
  
  
    // end add review script
  
  
    function handleStarHover() {
  
      const stars = document.querySelectorAll('.star');
      const reviewRatingInput = document.getElementById('reviewRating');
  
      stars.forEach((star, index) => {
          star.addEventListener('mouseenter', () => {
             
              stars.forEach((s, i) => {
                  const starFill = s.querySelector('.star-fill');
                  starFill.setAttribute('fill', i <= index ? '#F8D62D' : '#FFF');
              });
          });
  
          star.addEventListener('mouseleave', () => {
              updateStarColors();
          });
  
          star.addEventListener('click', () => {
              reviewRatingInput.value = index + 1;
              updateStarColors();
          });
      });
  
      function updateStarColors() {
          const currentRating = parseInt(reviewRatingInput.value, 10) || 0;
          stars.forEach((s, i) => {
              const starFill = s.querySelector('.star-fill');
              starFill.setAttribute('fill', i < currentRating ? '#F8D62D' : '#FFF');
          });
      }
  }
  
  handleStarHover();
  
  
  function handleReviewFormSubmit(){
    const reviewForm = document.querySelector('#custom-review-form');
    reviewForm.addEventListener('submit', function(event){
  
      event.preventDefault();
      const formData = new FormData(reviewForm);
  
      const fileInput = reviewForm.querySelector('input[type="file"]');
      console.log("File input found:", fileInput);
      console.log("Number of files selected:", fileInput?.files.length);
  
      if (fileInput && fileInput.files.length > 0) {
        // console.log("going inside this.....")
        Array.from(fileInput.files).forEach((file, index) => {
          formData.append(`image${index + 1}`, file);
        });
      }
  
      formData.delete('stamped-file-uploader-input');
  
      // console.log("form Data => ")
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }
  
      addLoaderReviewPopup();
  
      fetch('https://stamped.io/api/reviews3?apiKey=pubkey-C1GDETra4tfolQMJB903HhN8QJ574k&sId=140577', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Form submission successful:', data);
        closeLoaderAndReviewPopup();
        handleInlinePopup('success', "Review submitted successfully!");
      })
      .catch(error => {
        console.error('Form submission error:', error);
        closeLoaderAndReviewPopup();
        handleInlinePopup("error", "Failed to submit, please try again later");
      });
  
    })
  }
  
  handleReviewFormSubmit();
  
    // function to show loader on add review popup
  
    function addLoaderReviewPopup(){
      const loader = document.querySelector('#reviewPopup .loader');
  
      if(loader){
        loader.classList.add('loader-active');
      }
  
    }
    // end add review loader
  
    // start remove review loader
    function closeLoaderAndReviewPopup(){
      const loader = document.querySelector('#reviewPopup .loader');
      const body = document.querySelector('body');
  
      if(loader){
        loader.classList.remove('loader-active');
        hanldeCloseBtnReviewPopup();
      }
  
    }
    // end remove review loader
  
    // scripts to manage contact popup and functionality
  
    function contactFormPopup(){
      const contactFormBtns = document.querySelectorAll('.product-buttons button.contact-us');
  
      contactFormBtns.forEach(button => {
        button.addEventListener('click', function(){
  
          const body = document.querySelector('body');
          const orderId = this.getAttribute('data-order-id');
          const orderName = this.getAttribute('data-order-name');
          const productName = this.getAttribute('data-product-name');
          const customerId = this.getAttribute('data-customer-id');
  
          if(body){
            body.classList.add('show-contact-popup');
          }
  
          const contactForm = document.querySelector('.ContactForm');
  
          if (contactForm) {
            const orderField = contactForm.querySelector('#order_id');
            const productField = contactForm.querySelector('#product_name');
            const customerField = contactForm.querySelector('#customer_id');
            const orderNameField = contactForm.querySelector('#order_name');
            
            if (orderField) orderField.value = orderId;
            if (productField) productField.value = productName;
            if (customerField) customerField.value = customerId;
            if(orderNameField) orderNameField.value = orderName;
          }
  
        })
      })
  
      const closeBtn = document.querySelector('#contactPopupCloseBtn');
  
      closeBtn.addEventListener('click', hanldeCloseBtnContactPopup);
  
      
  
    }
  
    function hanldeCloseBtnContactPopup(){
      const body = document.querySelector('body');
          if(body){
            body.classList.remove('show-contact-popup');
          }
          const contactForm = document.querySelector('.ContactForm');
  
          if(contactForm){
            contactForm.reset();
            populateCountryCodesSelectContact();
          }
          
    }
  
    contactFormPopup();
  
  
  
    function hanldeContactFormSumbit(){
  
      const contactForm = document.querySelector('.ContactForm');
  
      contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
  
        const formData = new FormData(contactForm);
  
        const phoneCode = document.getElementById('contact_phone_code').innerHTML;
        const phoneNumber = document.getElementById('contact_phone').value;
  
        const fullPhoneNumber = phoneCode + phoneNumber;
  
        formData.delete('phone');
        formData.append('phone', fullPhoneNumber);
  
        // console.log("form Data => ")
        // for (let [key, value] of formData.entries()) {
        //   console.log(`${key}:`, value);
        // }
  
        fetch('https://developmentquote.monitors.com/shopify/contact-us', {
          method: 'POST',
          body: formData
        })
        .then(response => {
          if (!response.ok) {
            handleInlinePopup('error', 'An error occurred. Please try again.');
            hanldeCloseBtnContactPopup();
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.status) {
            handleInlinePopup('success', "Your message has been successfully sent!");
          } else {
            handleInlinePopup('error', data.message || 'An error occurred. Please try again.');
          }
          hanldeCloseBtnContactPopup();
        })
        .catch(error => {
          console.error('Error:', error);
          handleInlinePopup('error', 'An error occurred. Please try again.');
          hanldeCloseBtnContactPopup();
        });
        
      });
    }
  
    hanldeContactFormSumbit();
  
    function populateCountryCodesSelectContact() {
      const phoneCodesSelect = document.querySelector('#conatctPhoneCodesSelect');
      const phoneCodeData = countryPhoneCodes;
      const phoneCode = document.querySelector('#contact_phone_code');
      const phoneInput =  document.querySelector('#contact_phone');
      const phone = document.querySelector('#contact_phone').value;
      const _phone = document.querySelector('#contact_phone').getAttribute('data-phone');
    
      const customerCountry = getCountryFromPhoneNumber(_phone);
      
    
      let foundMatch = false;
      let customerPhoneData = {};
    
      phoneCodeData.forEach(function(country) {
        const option = document.createElement('option');
        option.value = country.code; 
        option.textContent = `${country.country} (${country.code})`;
        option.setAttribute('data-phone-code', country.shopifyCode);
        
        // Check if this option matches the customerCountry and set as selected
        if (country.shopifyCode === customerCountry) {
          option.selected = true;
          foundMatch = true;
          customerPhoneData = {
            countryCode: country.shopifyCode,
            code: country.code,
            country: country.country
          }
        }
    
        phoneCodesSelect.appendChild(option);
      });
  
      const phoneNumberToAppend = _phone.split(customerPhoneData.code);
  
      if(phoneInput){
        phoneInput.value = phoneNumberToAppend[phoneNumberToAppend.length - 1];
      }
    
      function handlePhoneCodeChange(event) {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const selectedValue = event.target.value;
        const countryCode = selectedOption.getAttribute('data-phone-code');
    
        const bgFlag = document.querySelector('.contact-bg-flag');
        bgFlag.style.backgroundImage = `url(https://cdn.shopify.com/static/images/flags/${countryCode.toLowerCase()}.svg)`;
        phoneCode.innerHTML = selectedValue;
      }
    
      phoneCodesSelect.addEventListener('change', handlePhoneCodeChange);
    
      if (foundMatch) {
        phoneCodesSelect.dispatchEvent(new Event('change'));
      }
    
    
    }
  
    populateCountryCodesSelectContact();  
  
    function hidePlaceholderText() {
      const reviewInputs = document.querySelectorAll('.toggle-placeholder');
    
      reviewInputs.forEach(reviewInput => {
        reviewInput.addEventListener('focus', function() {
          this.placeholder = '';
        });
    
        reviewInput.addEventListener('blur', function() {
          if (this.value === '') {
            const placeholder = this.getAttribute('data-placeholder');
            this.placeholder = placeholder;
          }
        });
      });
    }
    
    hidePlaceholderText();
  
   }
  