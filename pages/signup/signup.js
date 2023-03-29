let db_uri = "https://quizappapi.onrender.com/api";
let redirect_link = "./dashboard.html";
//
import selectors from "../quiz/js/selectors.js";
let { qs_a, mk, on } = selectors;
//
let signup_form = qs_a("#signup-form")[0];
//const toBase64 = (file) =>
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function resizeMe(img) {
  img.onload = function () {
    img.width = this.naturalWidth;
    img.height = this.naturalHeight;
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let max_width = 377;
      let max_height = 377;

      let canvas = mk("canvas");

      let width = img.width;
      let height = img.height;

      // calculate the width and height, constraining the proportions
      if (width > height) {
        if (width > max_width) {
          //height *= max_width / width;
          height = Math.round((height *= max_width / width));
          width = max_width;
        }
      } else {
        if (height > max_height) {
          //width *= max_height / height;
          width = Math.round((width *= max_height / height));
          height = max_height;
        }
      }

      // resize the canvas and draw the image data into it
      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      let data_url = canvas.toDataURL("image/jpeg", 0.7);

      resolve(data_url);
    }, 100);
  });
}

on(signup_form, "submit", async (e) => {
  e.preventDefault();
  signup_form.loginMe.children[0].innerHTML = "signning up..";

  let fullname = e.target.fullname.value;
  let batchname = e.target.batchname.value;
  let section_and_roll = e.target.section_and_roll.value;

  let img_file = e.target.img_file.files[0];

  let mobile = e.target.mobile.value;
  let email = e.target.email.value;
  let password = e.target.password.value;
  let condition_accepted = e.target.condition_accepted.value;

  let data = {
    date: new Date().toLocaleDateString(),
    email,
    password,
    fullname,
    batchname,
    section_and_roll,
    img_file: await get_compressed_img(img_file),
    mobile,
    condition_accepted,
  };

  let send_data = { email, password, data };

  let res = await fetch(`${db_uri}/signup`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(send_data),
  });

  let data_ = await res.json();

  if (data_.done) {
    redirect_link += `?email=${email}&`;
    redirect_link += `?logout=false`;
    window.location.replace(redirect_link);
  }

  if (data_) {
    data_.Errors.email && alert(data_.Errors.email);
    data_.Errors.password && alert(data_.Errors.password);
  }
});

async function get_compressed_img(file) {
  let base_64_data = await toBase64(file);
  let img = new Image();
  img.src = base_64_data;

  let data_ = await resizeMe(img);
  return data_;
}
