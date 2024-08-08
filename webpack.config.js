const path = require( 'path' );
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = ( env ) => {
	return [
		{
				...defaultConfig,
				module: {
					...defaultConfig.module,
					rules: [ ...defaultConfig.module.rules ],
				},
				mode: env.mode,
				devtool: 'source-map',
		},
		{
			mode: env.mode,
			entry: {
				blockstyles: { import: './src/block/style.scss' },
				admin: [ './src/scss/admin.scss' ],
			},
			output: {
				assetModuleFilename: 'fonts/[name][ext]',
				clean: true,
			},
			module: {
				rules: [
					{
						test: /\.scss$/,
						exclude: /(node_modules|bower_components)/,
						use: [
							{
								loader: MiniCssExtractPlugin.loader,
							},
							{
								loader: 'css-loader',
								options: {
									sourceMap: true,
									url: false,
								},
							},
							'sass-loader',
						],
					},
					{
						test: /\.(woff2?|ttf|otf|eot|svg)$/,
						include: [ path.resolve( __dirname, 'fonts' ) ],
						exclude: /(node_modules|bower_components)/,
						type: 'asset/resource',
					},
				],
			},
			plugins: [ new RemoveEmptyScriptsPlugin(), new MiniCssExtractPlugin() ],
		},
	];
};
