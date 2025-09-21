const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = (env, argv) => {
    const isDev = argv.mode === "development";

    return {
        entry: "./index.js", // входной JS в корне
        output: {
            filename: "bundle.[contenthash].js",
            path: path.resolve(__dirname, "dist"),
            clean: true,
            publicPath: "./", // важно для GitHub Pages
        },
        mode: isDev ? "development" : "production",
        devtool: isDev ? "inline-source-map" : "source-map",
        devServer: {
            static: "./dist",
            open: true,
            hot: true,
            watchFiles: ["./index.html", "./index.js", "./style.scss"], // вотчер
        },
        module: {
            rules: [
                // SCSS → CSS
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        isDev ? "style-loader" : MiniCssExtractPlugin.loader, // HMR в dev
                        "css-loader",
                        "sass-loader",
                    ],
                },
                // Оптимизация и вставка картинок
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: "asset",
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./index.html", // шаблон в корне
                inject: "body",
            }),
            !isDev &&
            new MiniCssExtractPlugin({
                filename: "styles.[contenthash].css",
            }),
            !isDev &&
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            ["svgo", {}],
                        ],
                    },
                },
            }),
        ].filter(Boolean),
        optimization: {
            minimize: !isDev,
            minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
        },
    };
};
