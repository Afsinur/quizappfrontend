let db_uri = "https://quizappapi.onrender.com/api";
let localStorage_email_key = "ibrahim_quiz_user_email";

import selectors from "../Quiz/js/selectors.js";
let { qs_a, css, on } = selectors;
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

  let res1 = await fetch(`${db_uri}/data/leadersboard`);
  let data1 = await res1.json();

  setup_data_on_page(data, data1);
  css(qs_a("body")[0], { display: "inherit" });
}
function setup_data_on_page(data, data1) {
  console.log(data.data);

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
    css(three_class_section, { display: "none" });
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
