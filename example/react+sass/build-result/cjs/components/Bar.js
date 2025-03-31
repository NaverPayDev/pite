"use strict";
const jsxRuntime = require("react/jsx-runtime");
const classNames = require("classnames/bind");
const Bar_module = require("./Bar.module.js");
const cx = classNames.bind(Bar_module.default);
const Bar = () => {
  const options = [{
    name: "foo",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  }, {
    name: "bar",
    content: "Mauris vitae volutpat est. Donec vitae mattis est, quis suscipit mi."
  }, {
    name: "baz",
    content: "Donec mattis gravida felis id ullamcorper."
  }];
  return /* @__PURE__ */ jsxRuntime.jsx("div", {
    children: options.map(({
      name,
      content
    }) => /* @__PURE__ */ jsxRuntime.jsx("p", {
      className: cx(name),
      children: content
    }, name))
  });
};
module.exports = Bar;
