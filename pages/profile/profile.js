let db_uri = "https://quizappapi.onrender.com/api";
let localStorage_email_key = "ibrahim_quiz_user_email";

import selectors from "../quiz/js/selectors.js";
let { qs_a, css, on, set_attr } = selectors;
//
let three_class_section = qs_a(".three-class-section")[0];
let user_profile_box_name = qs_a(".user-profile-box-name")[0];
let user_profile_box_clg = qs_a(".user-profile-box-clg")[0];
let user_profile_box_img = qs_a(".user-profile-box-img")[0];
let header_section_profile_page = qs_a(".header-section-profile-page")[0];

let user_page_user_rank = qs_a(".user-page-user-rank")[0];
let user_page_user_points = qs_a(".user-page-user-points")[0];
let user_page_user_badge = qs_a(".user-page-user-badge")[0];

let db_name = qs_a(".db_name")[0];
let db_btc_name = qs_a(".db_btc_name")[0];
let db_sec_roll = qs_a(".db_sec_roll")[0];
let db_joined = qs_a(".db_joined")[0];
let db_mobile = qs_a(".db_mobile")[0];
let db_email = qs_a(".db_email")[0];
let db_password = qs_a(".db_password")[0];

//
function get_percent(got, total) {
  return got * (100 / total);
}
async function get_and_set_user_data_from_db() {
  let email = localStorage.getItem(localStorage_email_key);
  let res = await fetch(`${db_uri}/data/${email}`);
  let data = await res.json();

  setup_data_on_page(data);

  set_attr(qs_a(".del-me")[0], "data-id-one", data.data.my_info.email);
  set_attr(qs_a(".del-me")[0], "data-id-two", data.data.my_info.password);

  css(qs_a(".content-container")[0], { display: "inherit" });
  css(qs_a(".loader-container")[0], { display: "none" });

  let res1 = await fetch(`${db_uri}/data/leadersboard`);
  let data1 = await res1.json();

  setup_data_on_page_again(data1);
}
function setup_data_on_page(data) {
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
  } else {
    user_page_user_points.innerHTML = `NaN`;
    user_page_user_badge.innerHTML = `NaN`;
  }

  if (data.data.my_info) {
    let {
      fullname,
      img_file,
      batchname,
      section_and_roll,
      date,
      mobile,
      email,
      password,
    } = data.data.my_info;

    //db_user_name.innerHTML = fullname;
    //db_img.src = img_file;

    css(header_section_profile_page, {
      "background-image": `linear-gradient(rgba(10, 10, 10, 0.4), rgba(10, 10, 10, 0.4)), url(${img_file})`,
    });
    user_profile_box_img.src = img_file;

    user_profile_box_name.innerHTML = fullname;
    user_profile_box_clg.innerHTML = batchname;

    db_name.innerHTML = fullname;
    db_btc_name.innerHTML = batchname;
    db_sec_roll.innerHTML = section_and_roll;
    db_joined.innerHTML = date;
    db_mobile.innerHTML = mobile;
    db_email.innerHTML = email;
    db_password.innerHTML = password;
  }
}
function setup_data_on_page_again(data1) {
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
    user_page_user_rank.innerHTML = my_rank;
  }
}
//
await get_and_set_user_data_from_db();

on(qs_a(".modal-btn")[0], "click", () => {
  let modal = qs_a(".modal-edit")[0];

  // Get the computed styles of the element
  let computedStyles = window.getComputedStyle(modal);

  if (computedStyles.display === "none") {
    css(modal, { display: "grid" });
  } else {
    css(modal, { display: "none" });
  }
});

on(qs_a(".del-me")[0], "click", async (e) => {
  qs_a(".del-me")[0].innerText = "deleting..";

  let { idOne, idTwo } = e.target.dataset;
  let res = await fetch(`${db_uri}/delete/${idOne}/${idTwo}`);
  let data = await res.json();

  if (data.done) {
    window.location.replace("./dashboard.html?logout=true");
  }
});

on(qs_a(".close-modal")[0], "click", (e) => {
  let modal = qs_a(".modal-edit")[0];

  // Get the computed styles of the element
  let computedStyles = window.getComputedStyle(modal);

  if (computedStyles.display === "none") {
    css(modal, { display: "grid" });
  } else {
    css(modal, { display: "none" });
  }
});
