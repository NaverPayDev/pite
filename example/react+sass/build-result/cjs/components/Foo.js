"use strict";
const jsxRuntime = require("react/jsx-runtime");
const classNames = require("classnames/bind");
const Foo_module = require("./Foo.module.js");
const cx = classNames.bind(Foo_module.default);
const Foo = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", {
    children: [/* @__PURE__ */ jsxRuntime.jsx("p", {
      className: cx("foo"),
      children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
    }), /* @__PURE__ */ jsxRuntime.jsx("p", {
      className: cx("bar"),
      children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
    }), /* @__PURE__ */ jsxRuntime.jsx("p", {
      className: cx("baz"),
      children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
    })]
  });
};
module.exports = Foo;
