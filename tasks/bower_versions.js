/*
 * grunt-bower-versions
 * https://github.com/vetruvet/grunt-bower-versions
 *
 * Copyright (c) 2015 Valeriy Trubachev
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var _ = require('lodash');

  grunt.registerMultiTask('bower_versions', 'Writes bower component versions to a file', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      variable: 'BowerComponents',
      components: null,
      dest: null
    });

    var bower_dir = grunt.file.exists('.bowerrc') ? (grunt.file.readJSON('.bowerrc').directory || 'bower_components') : 'bower_components';

    var versions = {};
    var readBowerJson = function (path) {
      var bower_json = grunt.file.readJSON(path);
      versions[bower_json.name] = bower_json.version;
    };

    if (options.components == null) {
      var installed = grunt.file.expand(bower_dir + '/*/.bower.json');
      _.each(installed, function (bower_json_path) {
        readBowerJson(bower_json_path);
      });
    } else {
      if (!_.isArray(options.components)) options.components = [options.components];
      _.each(options.components, function (component) {
        var bower_json_path = bower_dir + '/' + component + '/.bower.json';
        if (!grunt.file.exists(bower_json_path)) {
          grunt.log.warn('Bower component "' + component + '" is not installed!');
          return;
        }

        readBowerJson(bower_json_path);
      });
    }

    if (options.dest == null) {
      _.each(versions, function (version, component) {
        grunt.log.writeln('"' + component + '": ' + version);
      });
    } else {
      grunt.file.write(options.dest, 'var ' + options.variable + '=' + JSON.stringify(versions) + ';');
      grunt.log.writeln('File "' + options.dest + '" created.');
    }
  });

};
