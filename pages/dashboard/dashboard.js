let db_uri = "https://quizappapi.onrender.com/api";
let localStorage_email_key = "ibrahim_quiz_user_email";

import selectors from "../quiz/js/selectors.js";
let { qs_a, css, on } = selectors;
//
let db_user_name = qs_a(".db-user-name")[0];
let db_img = qs_a(".db-img")[0];

let user_page_user_rank = qs_a(".user-page-user-rank")[0];
let user_page_user_points = qs_a(".user-page-user-points")[0];
let user_page_user_badge = qs_a(".user-page-user-badge")[0];

let quiz_dashboard_nav_card_qz = qs_a(".qz")[0];
let quiz_dashboard_nav_card_lb = qs_a(".lb")[0];

let resetLocationCounter = 0;

//
function get_percent(got, total) {
  return got * (100 / total);
}

function set_localStorage_email_key_and_value() {
  let url = new URL(url_string);
  let email = url.searchParams.get("email");

  if (email) {
    localStorage.setItem(localStorage_email_key, email);
  }
}
async function get_and_set_user_data_from_db() {
  let email = localStorage.getItem(localStorage_email_key);
  let res = await fetch(`${db_uri}/data/${email}`);
  let data = await res.json();

  let res1 = await fetch(`${db_uri}/data/leadersboard`);
  let data1 = await res1.json();

  setup_data_on_page(data, data1);
  css(qs_a(".content-container")[0], { display: "inherit" });
  css(qs_a(".loader-container")[0], { display: "none" });
}
function setup_data_on_page(data, data1) {
  if (data.data.my_quize_info) {
    let { total_question, total_correct_ans } = data.data.my_quize_info;

    user_page_user_points.innerHTML = `${total_correct_ans}/${total_question}`;

    let percent = get_percent(total_correct_ans, total_question);
    if (percent >= 0 && percent < 50) {
      user_page_user_badge.innerHTML = `Wood`;
    }

    if (percent >= 50 && percent < 70) {
      user_page_user_badge.innerHTML = `Bronze`;
    }

    if (percent >= 70 && percent < 90) {
      user_page_user_badge.innerHTML = `Silver`;
    }

    if (percent >= 90 && percent <= 100) {
      user_page_user_badge.innerHTML = `Gold`;
    }
  }

  if (data.data.my_info) {
    let { fullname, img_file } = data.data.my_info;

    db_user_name.innerHTML = fullname;
    db_img.src = img_file;
  }

  if (data1.data) {
    let data_arr = data1.data;

    let sort_point = data_arr
      .sort((a, b) => {
        return a.data.total_time - b.data.total_time;
      })
      .sort((a, b) => {
        return b.data.total_correct_ans - a.data.total_correct_ans;
      });

    let rank_ = sort_point
      .map((itm, i) => {
        if (itm.email === localStorage.getItem(localStorage_email_key)) {
          return i;
        } else {
          return "-";
        }
      })
      .filter((itm) => itm != "-");

    let my_rank = rank_[0] + 1;
    data.data.my_quize_info && (user_page_user_rank.innerHTML = my_rank);
  }
}
//
on(quiz_dashboard_nav_card_qz, "click", () => {
  window.location.replace("./pages/quiz/");
});
on(quiz_dashboard_nav_card_lb, "click", () => {
  window.location.replace("./leaderboard.html");
});
//
set_localStorage_email_key_and_value();
await get_and_set_user_data_from_db();
