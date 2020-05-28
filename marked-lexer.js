const marked = require('marked');
const through = require('through2');
const PluginError = require('plugin-error');

const walker = (cur) => {
    if (cur.type !== "heading" && cur.type !== "space") {
        console.log(cur);
    }
    if (Array.isArray(cur.tokens) && cur.tokens.length > 0) {
        for (let token of cur.tokens) {
            walker(token);
        }
    }
}
function gulpPrefixer(options) {

    // creating a stream through which each file will pass
    const stream = through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }
        console.log(file.path)
        if (file.isBuffer()) {
            // file.contents = Buffer.concat([prefixText, file.contents]);
            const tokens = marked.lexer(file.contents.toString(enc), options);
            //console.log(tokens, enc);
            walker(tokens);
            file.contents = Buffer.from(JSON.stringify(tokens, null, 4))
        }

        // make sure the file goes through the next gulp plugin
        this.push(file);

        // tell the stream engine that we are done with this file
        cb();
    });

    // returning the file stream
    return stream;
};
module.exports = gulpPrefixer;
