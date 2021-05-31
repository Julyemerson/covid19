const path = require("path");

module.exports = {
  entry: ["@babel/polyfill", path.resolve(__dirname, "./src/main.js")],
  output: {
    path: path.resolve(__dirname, "./public/"),
    filename: "bundle.js",
    sourceMapFilename: "bundle.js.map",
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  devServer: {
    watchContentBase: true,
    contentBase: path.resolve(__dirname, "public"),
    open: true,
  },
  devtool: "source-map",
};
