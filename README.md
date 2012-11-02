# File Upload Demo

## Author 
    Jinglun Dong 

## Version
+    v0.2.1 Fixed a bug which is related to regular expression. Fixed a bug when input file is less than 5 words.
+    v0.2.0 Implemented the five most frequent words function. Rewrite the line and word count using Node.js.
+    v0.1.1 If there is no file information update, there is no content reload on browse view.
+    v0.1.0 Added "delete button" back to browse view. Deactivate the ajax call when load index view first time. 
+    v0.0.9 Fixed a bug which crashes the server when different users delete files asynchronously. 
+    v0.0.8 Seperated server to app server and web server.
+    v0.0.7 Fixed a bug which related to uploading empty directory to github.
    
## AWS DEMO

+    An online demo can be found here: [http://ec2-107-22-110-147.compute-1.amazonaws.com:8080/](http://ec2-107-22-110-147.compute-1.amazonaws.com:8080/);
+    The version of online demo is still 0.1.1, which will be upgraded soon.

## Description
    This demo is based on a jQuery plug-in called "jQuery-File-Upload". 
    Two servers needed app server app.js, web server web.js. Web server used express frame work.
    File Upload widget with multiple file selection, drag drop support, progress bars and preview images for jQuery.

## Features
+   The maximum file size for uploads in this demo is 1 GB.
+   Only text files (.txt) are allowed in this demo.
+   Uploaded files will be saved on public/files.
+   In the browse view, current uploading fils(which are not finish yet) will appears with line and word count unkown.
+   The metadata of uploaded files will be saved on public/meta as JSON format.
+   jQuery.tmpl() is used to update the content on index page.
+   jQuery.ajax is used to update the browse view.
+   Express is used for the web server.
+   Use HashMap and min-heap to calculate the most frequent words, using Node.js.
+    Please refer to the [project website](https://github.com/blueimp/jQuery-File-Upload) and 
    [documentation](https://github.com/blueimp/jQuery-File-Upload/wiki"documentation) for more information related to jQuery file upload plugin.
    

## How to run
+    For the dependency, please use "$npm install".
+    Create an app server by "$node ./app.js".
+    A web server is also needed, by "$node ./web.js".
+    Open [http://localhost:8080/](http://localhost:8080/)

## Problem not solved
+    Only test on Chrome version 22.0.1229.79 and Firefox version 15.0.1.
+    The function which computes the line and word number of uploaded file is not completely asynchronized. 
+    If multiple large file(several GB) are uploaded at the same time, the progress bar may not fade out smoothly. 
     One possible reason is calculating number of lines and words leads to huge amount of CPU utilization and I/O for large file.

## Git
+    Ropository can be found here: [https://github.com/jinglundong/DataHero-File-Upload-.git](https://github.com/jinglundong/DataHero-File-Upload-.git).

## License
Released under the [MIT license](http://www.opensource.org/licenses/MIT).

