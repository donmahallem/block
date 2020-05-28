const gulp = require("gulp");
const path = require("path");
const { parallel } = require('gulp');
const glob = require('glob');
const markdown = require('gulp-markdown');
function javascript(cb) {
    // body omitted
    cb();
}

function css(cb) {
    // body omitted
    cb();
}
const through = require('through2');
const PluginError = require('plugin-error');
exports.build = parallel(javascript, css);
const PLUGIN_NAME = 'gulp-prefixer';
const { parse } = require('node-html-parser');
function gulpPrefixer(prefixText) {
    if (!prefixText) {
        throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
    }

    prefixText = new Buffer(prefixText); // allocate ahead of time

    // creating a stream through which each file will pass
    const stream = through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }
        console.log(file.path)
        if (file.isBuffer()) {
            // file.contents = Buffer.concat([prefixText, file.contents]);
            const imgTags = parse(file.contents).querySelectorAll("img");
            for (let tag of imgTags) {
                console.log(tag.getAttribute("src"))
            }
        }

        // make sure the file goes through the next gulp plugin
        this.push(file);

        // tell the stream engine that we are done with this file
        cb();
    });

    // returning the file stream
    return stream;
};

const kkk = require('./marked-lexer');
gulp.task("ng-bump-version", function () {
    const mdFiles = glob.sync('posts/**/*.md');
    return gulp
        .src(mdFiles, { base: './' })
        //.pipe(markdown())
        .pipe(kkk())
        .pipe(gulp.dest('dist'));
});
gulp.task('default', gulp.parallel('ng-bump-version'));
