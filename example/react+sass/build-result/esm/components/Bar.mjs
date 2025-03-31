import { jsx } from "react/jsx-runtime";
import classNames from "classnames/bind";
import style from "./Bar.module.mjs";
const cx = classNames.bind(style);
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
  return /* @__PURE__ */ jsx("div", {
    children: options.map(({
      name,
      content
    }) => /* @__PURE__ */ jsx("p", {
      className: cx(name),
      children: content
    }, name))
  });
};
export {
  Bar as default
};
