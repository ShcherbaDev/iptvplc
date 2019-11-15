const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	entry: {
		'static/main': './src/assets/js/main.js',
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
		extensions: ['.js', '.jsx', '.'],
		alias: {
			assets: path.resolve(__dirname, 'src/assets'),
			components: path.resolve(__dirname, 'src/components'),
			database: path.resolve(__dirname, 'src/database'),
			modules: path.resolve(__dirname, 'src/modules'),
			routes: path.resolve(__dirname, 'src/routes'),
			store: path.resolve(__dirname, 'src/store'),
			views: path.resolve(__dirname, 'src/views'),
		}
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
			}
		]),

		new NodemonPlugin({
			watch: path.resolve('./dist'),
			script: './dist/server.js'
		}),

		new Dotenv({
			path: './environments/.env.development'
		})
	]
}
