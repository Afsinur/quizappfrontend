const qs_a = (sl) => document.querySelectorAll(sl);
const css = (el, obj) => Object.assign(el.style, obj);
const on = (el, e, f) => el.addEventListener(e, f);
const add = (el, str) => el.classList.add(str);
const remove = (el, str) => el.classList.remove(str);
const set_attr = (el, n, v) => el.setAttribute(n, v);
const rmv_attr = (el, n) => el.removeAttribute(n);
const html = (el, str) => (el.innerHTML = str);
const mk_arr = (arr) => Array.from(arr);
const mk = (str) => document.createElement(str);

export default {
  qs_a,
  css,
  on,
  add,
  remove,
  set_attr,
  rmv_attr,
  html,
  mk_arr,
  mk,
};
