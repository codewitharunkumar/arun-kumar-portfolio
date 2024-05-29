(function () {
  function getFormData(form) {
    var elements = form.elements;
    var honeypot;

    var fields = Object.keys(elements).filter(function (k) {
      if (elements[k].name === "honeypot") {
        honeypot = elements[k].value;
        return false;
      }
      return true;
    }).map(function (k) {
      if (elements[k].name !== undefined) {
        return elements[k].name;
      } else if (elements[k].length > 0) {
        return elements[k].item(0).name;
      }
    }).filter(function (item, pos, self) {
      return self.indexOf(item) == pos && item;
    });

    var formData = {};
    fields.forEach(function (name) {
      var element = elements[name];
      formData[name] = element.value;
      if (element.length) {
        var data = [];
        for (var i = 0; i < element.length; i++) {
          var item = element.item(i);
          if (item.checked || item.selected) {
            data.push(item.value);
          }
        }
        formData[name] = data.join(', ');
      }
    });

    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSendEmail = form.dataset.email || "";

    console.log('Form data:', formData);
    return { data: formData, honeypot: honeypot };
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    var form = event.target;
    var formData = getFormData(form);
    var data = formData.data;

    if (formData.honeypot) {
      return false;
    }

    disableAllButtons(form);

    // Get the action URL from data-sheet attribute
    var url = "https://script.google.com/macros/s/AKfycbwzKm5wQrV7_okVyufs2Y8e0C8p3uJl7H_FLxMEOOy7qjdfpEB1t3wW1FupNBPjV59I/exec";
    var sheetName = form.dataset.sheet || "responses"; // Get the sheet name from data-sheet attribute

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {;
        console.log('Form submitted successfully:', xhr.responseText);
        form.reset();
        document.getElementById("contact_form").classList.remove("opacity");
        document.getElementById("contact_overlay").classList.add("display-none");
        document.getElementById("form_title").classList.add("display-none");
        document.getElementById("form").classList.add("display-none");
        document.getElementById("thanks_message").classList.remove("display-none");
  
        setTimeout(() => {
          document.getElementById("form_title").classList.remove("display-none");
          document.getElementById("form").classList.remove("display-none");
          document.getElementById("thanks_message").classList.add("display-none");
        }, 3000);
      } else if (xhr.readyState === 4) {
        console.error('Error submitting form:', xhr.status, xhr.statusText);
      }
    };
  
    document.getElementById("contact_form").classList.add("opacity");
    document.getElementById("contact_overlay").classList.remove("display-none");
  
    var encoded = Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join('&');
    console.log('Sending data to Google Apps Script:', encoded);
    xhr.send("sheetName=" + encodeURIComponent(sheetName) + "&" + encoded);
  }

  function loaded() {
    var forms = document.querySelectorAll("form.gform");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handleFormSubmit, false);
    }
  };
  document.addEventListener("DOMContentLoaded", loaded, false);

  function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }
})();