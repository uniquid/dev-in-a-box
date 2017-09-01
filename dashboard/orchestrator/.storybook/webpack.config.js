const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"],
        include: path.resolve(__dirname, '../')
      },
      {
        test: /\.(eot|woff|png|jpeg|jpg|gif|woff2|svg|ttf)([\?]?.*)$/, 
        loader: "file-loader"
      }
    ]
  }
}