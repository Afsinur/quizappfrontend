let db_uri = "https://quizappapi.onrender.com/api";
let redirect_link = "./dashboard.html";

import selectors from "../quiz/js/selectors.js";
let { qs_a, on } = selectors;

let login_form = qs_a(".login-form")[0];

//
on(login_form, "submit", async (e) => {
  e.preventDefault();
  login_form.loginMe.children[0].innerHTML = "logging in..";

  let email = e.target.email.value;
  let password = e.target.password.value;

  let res = await fetch(`${db_uri}/login`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  let data = await res.json();

  if (data.done) {
    redirect_link += `?email=${email}&`;
    redirect_link += `logout=false`;
    window.location.replace(redirect_link);
  }

  if (data.Errors) {
    data.Errors.msg && alert(data.Errors.msg);
    data.Errors.email && alert(data.Errors.email);
    data.Errors.password && alert(data.Errors.password);
  }
});
