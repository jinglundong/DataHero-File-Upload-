#!/usr/bin/env node
/*
 * DataHero File Upload Plugin based on jQuery File Upload plugin
 * https://github.com/jinglundong/DataHero-File-Upload-.git
 *
 * Author: Jinglun Dong. October 27, 2012.
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */


//web server:
(function (port){
    var express = require('express');
    var app = express();

    // Configuration
    app.set("view options", {layout: false});

    app.engine('html', require('ejs').renderFile);

    app.configure('development', function(){
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    });

    app.configure('production', function(){
        app.use(express.errorHandler()); 
    });
    app.use("/css", express.static(__dirname + '/views/css'));
    app.use(express.static(__dirname + '/views'));

    app.get('/', function(req, res){
      res.render(__dirname + "/views/index.html");
    });  

    app.get('/index', function(req, res){
      res.render(__dirname + "/views/index.html");
    });

    app.get('/browse', function(req, res){
      res.render(__dirname + "/views/browse.html");
    });  
    app.listen(port);    
}(8080));
