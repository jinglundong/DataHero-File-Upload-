#!/usr/bin/env node
/*
 * DataHero File Upload Plugin based on jQuery File Upload plugin
 *    jQuery File Upload Plugin JS Example 6.11
 * 
 * https://github.com/jinglundong/DataHero-File-Upload-.git
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Modified by Jinglun Dong. October 27, 2012.
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */


//app server:
(function (port) {
    'use strict';
    var path = require('path'),
        fs = require('fs'),
        // Since Node 0.8, .existsSync() moved from path to fs:
        _existsSync = fs.existsSync || path.existsSync,
        formidable = require('formidable'),
        nodeStatic = require('node-static'),
        imageMagick = require('imagemagick'),
        exec = require('child_process').exec,
        options = {
            tmpDir: __dirname + '/tmp',
            publicDir: __dirname + '/public',
            uploadDir: __dirname + '/public/files',
            metadataDir: __dirname + '/public/meta',
            uploadUrl: '/files/',
            maxPostSize: 1.1*1024*1024*1024, // 11 GB
            minFileSize: 1,
            maxFileSize: 1*1024*1024*1024, // 10 GB
            acceptFileTypes: /\.+(txt)/i,
            // Files not matched by this regular expression force a download dialog,
            // to prevent executing any scripts in the context of the service domain:
            safeFileTypes: /\.(txt)$/i,
            imageTypes: /\.(gif|jpe?g|png)$/i,
            imageVersions: {
                'thumbnail': {
                    width: 80,
                    height: 80
                }
            },
            accessControl: {
                allowOrigin: '*',
                allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE'
            },
            /* Uncomment and edit this section to provide the service via HTTPS:
            ssl: {
                key: fs.readFileSync('/Applications/XAMPP/etc/ssl.key/server.key'),
                cert: fs.readFileSync('/Applications/XAMPP/etc/ssl.crt/server.crt')
            },
            */
            nodeStatic: {
                cache: 3600 // seconds to cache served files
            }
        },
        utf8encode = function (str) {
            return unescape(encodeURIComponent(str));
        },
        fileServer = new nodeStatic.Server(options.publicDir, options.nodeStatic),
        nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/,
        nameCountFunc = function (s, index, ext) {
            return ' (' + ((parseInt(index, 10) || 0) + 1) + ')' + (ext || '');
        },
        FileInfo = function (file) {
            this.name = file.name;
            this.size = file.size;
            this.type = file.type;
            this.delete_type = 'DELETE';
            this.line ;
            this.word ;
        },        
        UploadHandler = function (req, res, callback) {
            this.req = req;
            this.res = res;
            this.callback = callback;
        },
        serve = function (req, res) {
            res.setHeader(
                'Access-Control-Allow-Origin',
                options.accessControl.allowOrigin
            );
            res.setHeader(
                'Access-Control-Allow-Methods',
                options.accessControl.allowMethods
            );
            var handleResult = function (result, redirect) {
                    if (redirect) {
                        res.writeHead(302, {
                            'Location': redirect.replace(
                                /%s/,
                                encodeURIComponent(JSON.stringify(result))
                            )
                        });
                        res.end();
                    } else {
                        res.writeHead(200, {
                            'Content-Type': req.headers.accept
                                .indexOf('application/json') !== -1 ?
                                        'application/json' : 'text/plain'
                        });
                        res.end(JSON.stringify(result));
                    }
                },
                setNoCacheHeaders = function () {
                    res.setHeader('Pragma', 'no-cache');
                    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
                    res.setHeader('Content-Disposition', 'inline; filename="files.json"');
                },
                handler = new UploadHandler(req, res, handleResult);
            switch (req.method) {
            case 'OPTIONS':
                res.end();
                break;
            case 'HEAD':
            case 'GET':
                if (req.url === '/') {
                    setNoCacheHeaders();
                    if (req.method === 'GET') {
                        handler.get();
                    } else {
                        res.end();
                    }
                } else {
                    fileServer.serve(req, res);
                }
                break;
            case 'POST':
                setNoCacheHeaders();
                handler.post();
                break;
            case 'DELETE':
                handler.destroy();
                break;
            default:
                res.statusCode = 405;
                res.end();
            }
        };
    fileServer.respond = function (pathname, status, _headers, files, stat, req, res, finish) {
        if (!options.safeFileTypes.test(files[0])) {
            // Force a download dialog for unsafe file extensions:
            res.setHeader(
                'Content-Disposition',
                'attachment; filename="' + utf8encode(path.basename(files[0])) + '"'
            );
        } else {
            // Prevent Internet Explorer from MIME-sniffing the content-type:
            res.setHeader('X-Content-Type-Options', 'nosniff');
        }
        nodeStatic.Server.prototype.respond
            .call(this, pathname, status, _headers, files, stat, req, res, finish);
    };
    FileInfo.prototype.validate = function () {
        if (options.minFileSize && options.minFileSize > this.size) {
            this.error = 'File is too small';
        } else if (options.maxFileSize && options.maxFileSize < this.size) {
            this.error = 'File is too big';
        } else if (!options.acceptFileTypes.test(this.name)) {
            this.error = 'Filetype not allowed';
        }
        return !this.error;
    };
    FileInfo.prototype.safeName = function () {
        // Prevent directory traversal and creating hidden system files:
        this.name = path.basename(this.name).replace(/^\.+/, '');
        // Prevent overwriting existing files:
        while (_existsSync(options.uploadDir + '/' + this.name)) {
            this.name = this.name.replace(nameCountRegexp, nameCountFunc);
        }
    };
    FileInfo.prototype.initUrls = function (req) {
        if (!this.error) {
            var that = this,
                baseUrl = (options.ssl ? 'https:' : 'http:') +
                    '//' + req.headers.host + options.uploadUrl;
            this.url = this.delete_url = baseUrl + encodeURIComponent(this.name);
            Object.keys(options.imageVersions).forEach(function (version) {
                if (_existsSync(
                        options.uploadDir + '/' + version + '/' + that.name
                    )) {
                    that[version + '_url'] = baseUrl + version + '/' +
                        encodeURIComponent(that.name);
                }
            });
        }
    };
    
    //Modified by Jinglun
    UploadHandler.prototype.get = function () {
        var handler = this,
            files = [];
        //Check if directory exsit.
        fs.mkdir(options.metadataDir, function(){
            fs.readdir(options.metadataDir, function (err, list) {
                if(list){
                    list.forEach(function (name) {
                        var metaString = fs.readFileSync(options.metadataDir + '/' + name),
                            fileInfo,
                            meta;      
                        if (metaString){             
                            var meta = JSON.parse(metaString);
                        }
                        fileInfo = new FileInfo({
                            name: meta.name,
                            size: meta.size                    
                        });
                        fileInfo.line = meta.line;
                        fileInfo.word = meta.word;
                        fileInfo.initUrls(handler.req);
                        files.push(fileInfo);
                        
                    });
                }            
                handler.callback(files);
            });
        });
    };
    
    //Modified by Jinglun
    UploadHandler.prototype.post = function () {
        var handler = this,
            form = new formidable.IncomingForm(),
            tmpFiles = [],
            files = [],
            map = {},
            counter = 1,
            redirect,
            finish = function () {
                counter -= 1;
                var filesCount = files.length;
                if (!counter) {
                    files.forEach(function(fileInfo){   
                        fileInfo.initUrls(handler.req);                 
                        //Run Linux shell "wc" to count lines and words.
                        var fileServerPath =  options.uploadDir + '/' + fileInfo.name;
                        //use " " to deal with the space in the file names
                        exec('wc ' + '"' + fileServerPath + '"', function (error, stdout, stderr) {               
                            var splitedStdout = stdout.split(" ");
                            var lineFlag = false;
                            for (var i=0; i!=splitedStdout.length;i++){
                                if (splitedStdout[i]){
                                    if (!lineFlag){         //get the line count
                                        fileInfo.line= parseInt(splitedStdout[i],10);                          
                                        lineFlag = true;
                                    }
                                    else{                   //get the word count
                                        fileInfo.word = parseInt(splitedStdout[i],10); 
                                        //write to file asynchronously
                                        fs.writeFile(options.metadataDir + '/' + fileInfo.name, 
                                            JSON.stringify(fileInfo), function (err) {
                                            if (err) throw err;                                            
                                        });
                                        console.log("line:" + fileInfo.line + " word:" + fileInfo.word);
                                        filesCount--;    
                                        //I shouldn't block here. 
                                        //But I haven't find a proper and easy way to update the content asynchronously.
                                        //I used console to test the performance of asynchronous way, and it is much more smooth for large file.
                                        if (filesCount === 0){      
                                            handler.callback(files, false);
                                         }                  
                                        break;  
                                    }                      
                                }
                            }                                                                                
                        });
                        //A better solution is to call handler.callback just after all file upload finish. 
                        //Dealing with the calculated line and word separately is necessary if file is large. 
                        //But no time to implement it for now.
                        //handler.callback(files, redirect);          (<-here is the the asynchronous solution.)       
                    });                    
                }
            };
        form.uploadDir = options.tmpDir;
        form.hash = 'md5';
        form.on('fileBegin', function (name, file) {
            tmpFiles.push(file.path);
            var fileInfo = new FileInfo(file, handler.req, true);
            fileInfo.safeName();
            map[path.basename(file.path)] = fileInfo;
            files.push(fileInfo);
        }).on('field', function (name, value) {
            if (name === 'redirect') {
                redirect = value;
            }
        }).on('file', function (name, file) {
            var fileInfo = map[path.basename(file.path)];
            fileInfo.size = file.size;
            if (!fileInfo.validate()) {
                fs.unlink(file.path);
                return;
            }
            fs.renameSync(file.path, options.uploadDir + '/' + fileInfo.name); 
            fs.writeFile(options.metadataDir + '/' + fileInfo.name, JSON.stringify(fileInfo), function(err){
                if (err) throw err;
            });
            if (options.imageTypes.test(fileInfo.name)) {
                Object.keys(options.imageVersions).forEach(function (version) {
                    counter += 1;
                    var opts = options.imageVersions[version];
                    imageMagick.resize({
                        width: opts.width,
                        height: opts.height,
                        srcPath: options.uploadDir + '/' + fileInfo.name,
                        dstPath: options.uploadDir + '/' + version + '/' +
                            fileInfo.name
                    }, finish());
                });
            }

        }).on('aborted', function () {
            tmpFiles.forEach(function (file) {
                fs.unlink(file);
            });
        }).on('error', function (e) {
            console.log(e);
        }).on('progress', function (bytesReceived, bytesExpected) {
            if (bytesReceived > options.maxPostSize) {
                handler.req.connection.destroy();
            }
        }).on('end', finish).parse(handler.req);
    };
    UploadHandler.prototype.destroy = function () {
        var handler = this,
            fileName;
        if (handler.req.url.slice(0, options.uploadUrl.length) === options.uploadUrl) {
            fileName = path.basename(decodeURIComponent(handler.req.url));
            //check if file exsit. if not log through console. 
            //The uploaded files are shared by all users, one user may try to delete a file which has been deleted by another user.
            fs.exists(options.uploadDir + '/' + fileName, function (exists) {
                if (exists){
                    fs.unlink(options.uploadDir + '/' + fileName, function (err) {
                        if (err) throw err; 
                    });
                }
                else{
                    console.log("try to delete file:" + options.uploadDir + '/' + fileName + " which is not exsit.");
                }
            });

            //check if metadata exsit. if not log through console.             
            fs.exists(options.metadataDir + '/' + fileName, function (exists) {
                if (exists){
                    //unlink the meta data
                    fs.unlink(options.metadataDir + '/' + fileName, function (err) {            
                        if (err) throw err;
                        else handler.callback(!err);
                    });
                }
                else{
                    handler.callback(!exists);
                    console.log("try to delete metadata:" + options.metadataDir + '/' + fileName + " which is not exsit.");
                }
            });
        } else {
            handler.callback(false);
        }
    };
    if (options.ssl) {
        require('https').createServer(options.ssl, serve).listen(port);
    } else {
        require('http').createServer(serve).listen(port);
    }
}(8888));