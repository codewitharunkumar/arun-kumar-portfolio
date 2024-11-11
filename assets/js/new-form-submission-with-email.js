(function () {
  "use strict";
  /*
   * Form Validation
   */

  // Fetch all the forms we want to apply custom validation styles to
  const forms = document.querySelectorAll(".needs-validation");
  const result = document.getElementById("result");
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();

          form.querySelectorAll(":invalid")[0].focus();
        } else {
          /*
           * Form Submission using fetch()
           */

          const formData = new FormData(form);
          event.preventDefault();
          event.stopPropagation();
          const object = {};
          formData.forEach((value, key) => {
            object[key] = value;
          });
          const json = JSON.stringify(object);
          //result.innerHTML = "Please wait...";

          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: json
          })
            .then(async (response) => {
              let json = await response.json();

              document.getElementById("contact_form").classList.remove("opacity");
              document.getElementById("contact_overlay").classList.add("display-none");
              document.getElementById("form_title").classList.add("display-none");
              document.getElementById("form").classList.add("display-none");

              if (response.status == 200) {
                document.getElementById("thanks_message").classList.remove("display-none");
              } else {
                console.log(response);
                document.getElementById("failed_message").classList.remove("display-none");
              }

              setTimeout(() => {
                  document.getElementById("form_title").classList.remove("display-none");
                  document.getElementById("form").classList.remove("display-none");
                  document.getElementById("thanks_message").classList.add("display-none");
                  document.getElementById("failed_message").classList.add("display-none");
              }, 3000);
            }).then(function () {
              form.reset();
              form.classList.remove("was-validated");
            });

            document.getElementById("contact_form").classList.add("opacity");
            document.getElementById("contact_overlay").classList.remove("display-none");
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();


function validatePhoneNumber(input) {
    input.value = input.value.replace(/[^0-9+\-]/g, ''); // Replaces any character that is not a number, + or -
}