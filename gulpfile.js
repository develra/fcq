var gulp = require('gulp'),
    csv2 = require('csv2'),
    through2 = require('through2'),
    _ = require('lodash'),
    rename = require("gulp-rename")

gulp.task('csv2json', function() {

    var src = './data/fcq.csv'
    var dest  = './data'

    return gulp.src(src, {
            buffer: false   // assuming the input data file is large, open it as a stream
        })        
        .pipe(through2.obj(function(file, enc, callback) {
                    
            var header
            // modify the file contents to be a stream of JSON strings
            file.contents = file.contents
                .pipe(csv2())
                .pipe(through2.obj(function(record, enc, callback) {

                    if (!header) {
                        // take the first record as the header
                        header = record

                    } else {

                        var obj = _.zipObject(header, record)
                        this.push(JSON.stringify(obj) + '\n')
                    }

                    callback()
                }))

            this.push(file)
            callback()

        }))
        .pipe(rename(function(path) {
            path.extname = ".json"
        }))
        .pipe(gulp.dest(dest))
})