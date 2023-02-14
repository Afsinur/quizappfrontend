let db_uri = "https://quizappapi.onrender.com/api";
let localStorage_email_key = "ibrahim_quiz_user_email";

import selectors from "./selectors.js";
let { qs_a, css, mk_arr, on } = selectors;

let time_div = qs_a(".time-div")[0];
let animation_div = qs_a(".animation-div")[0];
let play_div = qs_a(".play-div")[0];
let notification_div = qs_a(".notification-div")[0];
let qsn_div = qs_a(".qsn-div")[0];
let options_ul = qs_a(".options-ul")[0];
let total_correct_ans = qs_a(".total-correct-ans")[0];
let total_question = qs_a(".total-question")[0];
let total_time = qs_a(".total-time")[0];
//buttons
let btn_replay = qs_a(".btn-replay")[0];
let btn_result = qs_a(".btn-result")[0];
let btn_next = qs_a(".btn-next")[0];
let btn_next_for_results = qs_a(".btn-next-for-results")[0];
let btn_finish = qs_a(".btn-finish")[0];
let btn_goback = qs_a(".btn-goback")[0];
let btn_go_board = qs_a(".btn-go-board")[0];
let btn_start = qs_a(".btn-start")[0];

let if_updating = qs_a(".if-updating")[0];
let update_completed = qs_a(".update-completed")[0];

//DOM arrays
let hide_all_btn_array = [
  btn_replay,
  btn_result,
  btn_next,
  btn_next_for_results,
  btn_finish,
  btn_goback,
  btn_go_board,
  btn_start,
];
let init_show = [btn_start, btn_go_board];
let init_dont_show = [animation_div, btn_next];
let at_first_show = [btn_next, play_div];
let at_first_dont_show = [
  notification_div,
  btn_replay,
  btn_next_for_results,
  btn_result,
  btn_finish,
  btn_goback,
  btn_go_board,
  btn_start,
];
let game_last_turn_show = [btn_finish];
let after_game_finises_hide = [
  btn_finish,
  play_div,
  btn_next,
  btn_next_for_results,
];
let after_game_finises_show = [
  notification_div,
  btn_replay,
  btn_result,
  btn_goback,
  btn_go_board,
];
let after_see_result_press_show = [btn_next_for_results, play_div, btn_finish];
let after_see_result_press_hide = [notification_div];
let when_updating_db_hide = [if_updating, update_completed];
let when_updating_db_show = [if_updating];
let after_update_hide = [if_updating, update_completed];
let after_update_show = [update_completed];
//vars
let game_array = [];
let putted_answer_array = [];
let current_putted_answer_obj = {};
let question_position = 0;
let animation_delay = 1000;
let more_than_one_played = false;

let ref_play_max_time = null;
let play_max_time = null;
let game_timer_interval = null;
let game_timer_interval_time = 10;
let add_minus_by = 0.01;
let puse_game = false;

let count_played_time = 0;
let to_fixed = 2;

let show_result_position = 0;

let preview_run_init = false;

//functions
function setup_li_events(lists, question_no) {
  mk_arr(lists).forEach((li) => {
    on(li, "click", (e) => {
      mk_arr(options_ul.children).forEach((child, i) => {
        let ans_number = Number(e.target.dataset.answer);

        if (i + 1 === ans_number) {
          css(child, { border: "2px solid rgb(9, 136, 247)" });
        } else {
          css(child, { border: "2px solid rgb(116, 213, 255)" });
        }
      });

      current_putted_answer_obj = {
        ans: e.target.dataset.answer,
        qsn: question_no,
      };
    });
  });
}

function setup_question(qsn_pos) {
  let current_qsn = game_array[qsn_pos]["question"];
  qsn_div.innerHTML = current_qsn;
}

function setup_options(ul, preview, current_pos) {
  reset_ul();

  let current_obj = game_array[current_pos];

  let filter = Object.keys(current_obj).filter(
    (itm) => itm !== `question` && itm !== `answer`
  );

  for (let i = 0; i < filter.length; i++) {
    const el = current_obj[i + 1];
    ul.innerHTML += `<li data-answer="${i + 1}">${el}</li>`;
  }

  !preview && setup_li_events(ul.children, current_pos);
}

function check_game_status_and_update() {
  if (
    game_array.length - 2 === question_position ||
    game_array.length - 2 === show_result_position - 1
  ) {
    hide_all_btn_array.forEach((btn) => {
      css(btn, { display: "none" });
    });

    game_last_turn_show.forEach((btn) => {
      css(btn, { display: "inherit" });
    });
  }
}

function reset_ul() {
  options_ul.innerHTML = ``;
}

function setup_btn_next() {
  on(btn_next, "click", () => {
    check_game_status_and_update();

    if (game_array.length > question_position) {
      putted_answer_array.push(current_putted_answer_obj);

      question_position++;
      setup_game();
      current_putted_answer_obj = {};
    }
  });
}

function setup_game() {
  question_position === 0 &&
    (at_first_dont_show.forEach((itm) => {
      css(itm, { display: "none" });
    }),
    at_first_show.forEach((itm) => {
      css(itm, { display: "inherit" });
    }),
    reset_ul(),
    !more_than_one_played && setup_btn_next());

  question_position < game_array.length && setup_question(question_position);
  question_position < game_array.length &&
    setup_options(options_ul, false, question_position);
}

function show_game() {
  setup_game();
}

function show_animation() {
  puse_game = true;
  css(animation_div, { display: "inherit" });

  let count = 3;
  animation_div.innerHTML = `Game starts in..`;

  let interval = setInterval(() => {
    if (count <= 1) {
      count === 1 && (animation_div.innerHTML = count);
      count === 0 && (puse_game = false);
      count === 0 && !more_than_one_played && start_timer();

      count === 1 &&
        setTimeout(() => {
          css(animation_div, { display: "none" });

          clearInterval(interval);
        }, animation_delay);
    } else {
      animation_div.innerHTML = count;
    }

    count--;
  }, animation_delay);
}

async function get_game_data() {
  let res = await fetch("./json/Quiz.json");
  let data = await res.json();

  game_array = data.data;
  ref_play_max_time = data.time / 1000; //convert into seconds

  show_animation();
  show_game();
}

async function send_data_to_db(data) {
  await fetch(`${db_uri}/save`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data, email: get_user_email() }),
  });

  after_update_hide.forEach((itm) => css(itm, { display: "none" }));
  after_update_show.forEach((itm) => css(itm, { display: "inherit" }));
}

async function setup_notification_div() {
  total_question.innerHTML = game_array.length;

  let answers = game_array.map((itm) => itm.answer);
  let answer_played = putted_answer_array.filter(
    (itm, i) => itm.ans === answers[i]
  );

  total_correct_ans.innerHTML = answer_played.length;
  let times = (count_played_time - add_minus_by).toFixed(to_fixed);
  total_time.innerHTML = times;

  let data_ = {
    total_question: game_array.length,
    total_correct_ans: answer_played.length,
    total_time: Number(times),
  };

  if (!preview_run_init) {
    when_updating_db_hide.forEach((itm) => css(itm, { display: "none" }));
    when_updating_db_show.forEach((itm) => css(itm, { display: "inherit" }));

    await send_data_to_db(data_);
  }
}

function start_timer() {
  play_max_time = ref_play_max_time;

  time_div.innerHTML = `${play_max_time}s`;

  if (!more_than_one_played) {
    game_timer_interval = setInterval(() => {
      if (play_max_time >= -add_minus_by) {
        !puse_game && (count_played_time += add_minus_by);

        !puse_game &&
          (time_div.innerHTML = `${Math.abs(play_max_time).toFixed(
            to_fixed
          )}s`);
      } else {
        !puse_game && (game_time_up(), pause_timer());
      }

      !puse_game && (play_max_time -= add_minus_by);
    }, game_timer_interval_time);
  }
}

function game_time_up() {
  setup_notification_div();

  after_game_finises_hide.forEach((btn) => {
    css(btn, { display: "none" });
  });

  after_game_finises_show.forEach((btn) => {
    css(btn, { display: "inherit" });
  });

  let left_to_put_ans = game_array.length - putted_answer_array.length;

  for (let i = 0; i < left_to_put_ans; i++) {
    putted_answer_array.push({});
  }
}

function pause_timer() {
  puse_game = true;
}

function setup_finish_btn() {
  on(btn_finish, "click", () => {
    pause_timer();
    show_result_position <= 0 &&
      putted_answer_array.push(current_putted_answer_obj);
    game_time_up();

    show_result_position = 0;
  });
}

function setup_replay_btn() {
  on(btn_replay, "click", () => {
    reset_vars();

    show_animation();
    show_game();
  });
}

function reset_vars() {
  putted_answer_array = [];
  current_putted_answer_obj = {};
  question_position = 0;

  more_than_one_played = true;

  play_max_time = ref_play_max_time;
  count_played_time = 0;

  show_result_position = 0;
  preview_run_init = false;
}

function show_results_and_putted_one(my_ans_arr, pos) {
  console.log(my_ans_arr, pos);

  let { ans } = my_ans_arr[pos];
  let { answer } = game_array[pos];

  setup_question(pos);
  setup_options(options_ul, true, show_result_position);

  mk_arr(options_ul.children).forEach((child, i) => {
    if (i + 1 === Number(ans)) {
      css(child, { border: "2px solid rgb(9, 136, 247)" });
    } else {
      css(child, { border: "2px solid rgb(116, 213, 255)" });
    }

    if (i + 1 === Number(ans)) {
      css(child, { "background-color": "rgb(255, 190, 193)" });
    }

    if (i + 1 === Number(answer)) {
      css(child, { "background-color": "rgb(190, 255, 193)" });
    }
  });
}

function setup_see_results_btn() {
  on(btn_result, "click", () => {
    preview_run_init = true;

    hide_all_btn_array.forEach((itm) => {
      css(itm, { display: "none" });
    });

    after_see_result_press_hide.forEach((itm) => {
      css(itm, { display: "none" });
    });

    after_see_result_press_show.forEach((itm) => {
      css(itm, { display: "inherit" });
    });

    show_results_and_putted_one(putted_answer_array, show_result_position);
    show_result_position++;
  });
}

function setup_next_button_for_results_btn() {
  on(btn_next_for_results, "click", () => {
    check_game_status_and_update();

    if (game_array.length > show_result_position) {
      show_results_and_putted_one(putted_answer_array, show_result_position);

      show_result_position++;
    }
  });
}

function setup_back_btn() {
  on(btn_goback, "click", () => {
    window.location.replace("../../menu.html");
  });
}

function setup_board_btn() {
  on(btn_go_board, "click", () => {
    window.location.replace("../../leaderboard.html");
  });
}

function setup_start_btn() {
  on(btn_start, "click", () => {
    get_game_data();

    setup_finish_btn();
    setup_replay_btn();

    setup_see_results_btn();
    setup_next_button_for_results_btn();

    setup_back_btn();
  });
}

function setup_init_show() {
  at_first_dont_show.forEach((itm) => {
    css(itm, { display: "none" });
  });

  init_dont_show.forEach((itm) => {
    css(itm, { display: "none" });
  });

  init_show.forEach((itm) => {
    css(itm, { display: "inherit" });
  });

  setup_start_btn();
}

function get_user_email() {
  let email = localStorage.getItem(localStorage_email_key);

  return email;
}

//init
setup_init_show();
setup_board_btn();
