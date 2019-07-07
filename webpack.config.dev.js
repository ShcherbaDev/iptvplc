const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	entry: {
		bootstrap: './src/assets/js/bootstrap.bundle.min.js',
		main: './src/assets/js/main.js',
		server: './src/server.js'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/',
		filename: '[name].js'
	},
	target: 'node',
	node: {
        __dirname: false,
        __filename: false
    },
	resolve: {
		extensions: ['.js', '.jsx', '.']
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						plugins: ['@babel/plugin-transform-runtime']
					}
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: true,
							removeComments: true,
							collapseWhitespace: false
						}
					}
				]
			},
			{
				test: /\.(css|scss)$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'static/images/[name].[ext]'
						}
					}
				]
			},
			{
				test: /\.(eot|woff|woff2|ttf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'static/fonts/[name].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'IPTVPLC - конструктор IPTV плейлистов',
			template: './src/index.ejs',
			filename: './index.html',
			excludeChunks: ['server']
		}),

		new CopyWebpackPlugin([
			{
				from: './src/assets/images', to: './static/images'
			},

			{
				from: './src/assets/fonts', to: './static/fonts'
			},

			{
				from: './src/playlists', to: './playlists'
			}
		]),

		new NodemonPlugin({
			watch: path.resolve('./dist'),
			script: './dist/server.js'
		})
	]
}
