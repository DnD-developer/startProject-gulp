let { src, dest, watch, parallel } = require("gulp"),
    browserSync = require("browser-sync"),
    // uglify = require('gulp-uglify'),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    pug = require("gulp-pug"),
    autoprefixer = require("gulp-autoprefixer"),
    sass = require("gulp-sass")(require("sass"));

const webpack = require("webpack-stream");

const dist = "./dist/";
const distServer = "/Users/nikitakuvasov/Sites/Gwint/";

function gulpPug() {
    return src("app/*.pug")
        .pipe(
            pug({
                pretty: true,
            }),
        )
        .pipe(dest("app"))
        .pipe(
            browserSync.reload({
                stream: true,
            }),
        );
}

function scss() {
    return src("app/assets/scss/**/*.scss")
        .pipe(
            sass({
                outputStyle: "compressed",
            }),
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 8 versions"],
            }),
        )
        .pipe(
            rename({
                suffix: ".min",
            }),
        )
        .pipe(dest("app/assets/css"))
        .pipe(dest(dist + "/assets/css"))
        .pipe(dest(distServer + "/assets/css"))
        .pipe(
            browserSync.reload({
                stream: true,
            }),
        );
}

function css() {
    return src([
        "node_modules/normalize.css/normalize.css",
        "node_modules/slick-carousel/slick/slick.css",
        //'node_modules/magnific-popup/dist/magnific-popup.css',
        "node_modules/simplebar/dist/simplebar.min.css",
        "node_modules/animate.css/animate.css",
        //'node_modules/rateyo/src/jquery.rateyo.css',
        //'node_modules/ion-rangeslider/css/ion.rangeSlider.css',
        //'node_modules/jquery-form-styler/dist/jquery.formstyler.css',
        //'node_modules/jquery-form-styler/dist/jquery.formstyler.theme.css',
    ])
        .pipe(concat("_libs.scss"))
        .pipe(dest("app/assets/scss"))
        .pipe(
            browserSync.reload({
                stream: true,
            }),
        );
}

function html() {
    return src("app/*.html").pipe(dest(dist)).pipe(dest(distServer)).pipe(browserSync.stream());
}

function buildJs() {
    return src("app/assets/js/main.js")
        .pipe(
            webpack({
                mode: "development",
                output: {
                    filename: "bundle.js",
                },
                module: {
                    rules: [
                        {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                                loader: "babel-loader",
                                options: {
                                    presets: [
                                        [
                                            "@babel/preset-env",
                                            {
                                                // debug: true,
                                                corejs: 3,
                                                useBuiltIns: "usage",
                                            },
                                        ],
                                    ],
                                },
                            },
                        },
                    ],
                },
            }),
        )
        .pipe(dest(dist + "assets/js"))
        .pipe(dest(distServer + "assets/js"))
        .on("end", browserSync.reload);
}

function copyAssets() {
    return src(["./app/assets/**/*.*", "!app/assets/scss/**/*.*", "!app/assets/js/**/*.*"])
        .pipe(dest(dist + "/assets"))
        .pipe(dest(distServer + "/assets"))
        .on("end", browserSync.reload);
}

function watching() {
    browserSync.init({
        server: dist,
        port: 4000,
        notify: true,
    });
    watch("app/**/*.pug", parallel(gulpPug));
    watch("app/**/*.html", parallel(html));
    watch("app/assets/scss/**/*.scss", parallel(scss));
    watch("app/assets/js/**/*.js", parallel(buildJs));
}

// gulp.task ('images', function(){
// 	return gulp.src('app/assets/img/**/*')
// 		.pipe(imagemin([
// 			imagemin.gifsicle({interlaced: true}),
// 			imagemin.mozjpeg({quality: 75, progressive: true}),
// 			imagemin.optipng({optimizationLevel: 5}),
// 			imagemin.svgo({
// 				plugins: [
// 					{removeViewBox: true},
// 					{cleanupIDs: false}
// 				]
// 			})
// 		]))
// 		.pipe(gulp.dest('dist/assets/img'));
// });

// gulp.task("build-prod-js", () => {
//     return gulp.src("app/assets/js/main.js")
//                 .pipe(webpack({
//                     mode: 'production',
//                     output: {
//                         filename: 'bundle.js'
//                     },
//                     module: {
//                         rules: [
//                           {
//                             test: /\.m?js$/,
//                             exclude: /(node_modules|bower_components)/,
//                             use: {
//                               loader: 'babel-loader',
//                               options: {
//                                 presets: [['@babel/preset-env', {
//                                     corejs: 3,
//                                     useBuiltIns: "usage"
//                                 }]]
//                               }
//                             }
//                           }
//                         ]
//                       }
// 				}))
// 				.pipe(gulp.dest(dist+ 'assets/js'));
// });
// gulp.task('build', gulp.series("build-prod-js"));

exports.default = parallel(gulpPug, html, css, buildJs, copyAssets, watching);
