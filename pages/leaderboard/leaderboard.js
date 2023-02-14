let db_uri = "https://quizappapi.onrender.com/api"; //
let localStorage_email_key = "ibrahim_quiz_user_email";

import selectors from "../Quiz/js/selectors.js";
let { qs_a, css, on } = selectors;
//
let trimg_ = qs_a(".profile-pic-btn > img")[0];
let leaderboard_list = qs_a("#leaderboard-list")[0];

let trimg = qs_a(`.trimg`)[0];
let leaderboard_top_ranker_name = qs_a(`.leaderboard-top-ranker-name`)[0];
let leaderboard_top_ranker_clg = qs_a(`.leaderboard-top-ranker-clg`)[0];
let leaderboard_top_ranker_score = qs_a(`.leaderboard-top-ranker-score`)[0];
let leaderboard_top_ranker_time_span = qs_a(
  `.leaderboard-top-ranker-time > span`
)[0];

//
function template_leaders_list(src, full_name, deprt_name, point, time) {
  return `
        <div class="leaderboard-list-div mi-ripple mi-ripple-dark">
          <div class="ldb-sln"></div>
          <div class="ldb-img">
            <img
              src="${src}"
            />
          </div>
          <div class="ldb-name-div">
            <p class="ldb-name">${full_name}</p>
            <p class="ldb-clg">${deprt_name}</p>
          </div>
          <div class="ldb-point-div">
            <p class="ldb-point">${point}</p>
            <p class="ldb-time">${time}s</p>
          </div>
        </div>
    `;
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
  console.log(data.data, data1.data);

  if (data.data.my_info) {
    let { img_file } = data.data.my_info;

    trimg_.src = img_file;
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

    sort_point.forEach(({ data, user_data }, i) => {
      if (i > 0) {
        leaderboard_list.innerHTML += template_leaders_list(
          user_data.img_file,
          user_data.fullname,
          user_data.batchname,
          data.total_correct_ans,
          data.total_time
        );
      } else {
        trimg.src = user_data.img_file;
        leaderboard_top_ranker_name.innerHTML = user_data.fullname;
        leaderboard_top_ranker_clg.innerHTML = user_data.batchname;
        leaderboard_top_ranker_score.innerHTML = data.total_correct_ans;
        leaderboard_top_ranker_time_span.innerHTML = data.total_time;
      }
    });
  }
}
await get_and_set_user_data_from_db();
