import path from 'path';

import { interpolateName } from 'loader-utils';

export const raw = true;

export default function loader(content) {
  const name = '[contenthash].[ext]';

  const outputPath = interpolateName(this, name, {
    content,
    context: this.rootContext,
  });

  const publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

  const assetInfo = {
    immutable: true,
    sourceFilename: path.relative(this.rootContext, this.resourcePath),
  };

  this.emitFile(outputPath, content, null, assetInfo);

  return `
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;

  var _react = _interopRequireDefault(require("react"));

  require("@dotlottie/player-component");

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function Player({
    className,
    ...props
  }, forwardedRef) {
    return /*#__PURE__*/_react.default.createElement("dotlottie-player", _extends({
      ref: forwardedRef
    }, props, {
      class: className,
      src: ${publicPath}
    }));
  }

  var _default = /*#__PURE__*/_react.default.forwardRef(Player);

  exports.default = _default;
  `;
}
