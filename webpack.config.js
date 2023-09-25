const HtmlWebPackPlugin = require("html-webpack-plugin");

const path = require("path");
const webpack = require("webpack");

const htmlPlugin = new HtmlWebPackPlugin({
  title: "RogueLike",
  template: "./public/index.html",
  filename: "./index.html",
});

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: path.join(__dirname, "dist/"),
    filename: "bundle.js",
    publicPath: "/",
  },
  plugins: [htmlPlugin, new webpack.HotModuleReplacementPlugin()],
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg|mp3)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    alias: {
      images: path.resolve(__dirname, "./src/assets/img"),
      sounds: path.resolve(__dirname, "./src/assets/snd"),
      jsons: path.resolve(__dirname, "./src/assets/json"),
      music: path.resolve(__dirname, "./src/assets/msc"),
      scenes: path.resolve(__dirname, "./src/scenes"),
      utils: path.resolve(__dirname, "./src/utils"),
    },
    extensions: ["*", ".js", ".jsx"],
  },
};
