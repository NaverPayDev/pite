import { jsxs, jsx } from "react/jsx-runtime";
import classNames from "classnames/bind";
import style from "./Foo.module.mjs";
const cx = classNames.bind(style);
const Foo = () => {
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx("p", {
      className: cx("foo"),
      children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
    }), /* @__PURE__ */ jsx("p", {
      className: cx("bar"),
      children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
    }), /* @__PURE__ */ jsx("p", {
      className: cx("baz"),
      children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
    })]
  });
};
export {
  Foo as default
};
