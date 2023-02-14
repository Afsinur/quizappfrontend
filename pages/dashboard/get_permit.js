let localStorage_logout_key = "ibrahim_quiz_user_logout";
let redirect_link = "./";

function get_permit() {
  let url_string = window.location.href;
  let url = new URL(url_string);
  let logout = url.searchParams.get("logout");

  if (logout === "true") {
    localStorage.setItem(localStorage_logout_key, logout);
    window.location.replace(redirect_link);
  } else if (logout === "false") {
    localStorage.setItem(localStorage_logout_key, logout);
  }
}
get_permit();
