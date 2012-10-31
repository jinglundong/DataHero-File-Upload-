# File Upload Demo

## Author 
    Jinglun Dong 

## Version

+    v0.1.1 If there is no file information update, there is no content reload on browse view.
+    v0.1.0 Added "delete button" back to browse view. Deactivate the ajax call when load index view first time. 
+    v0.0.9 Fixed a bug which crashes the server when different users delete files asynchronously. 
+    v0.0.8 Seperated server to app server and web server.
+    v0.0.7 Fixed a bug which related to uploading empty directory to github.
    
## AWS DEMO

+    An online demo can be found here: [http://ec2-107-22-110-147.compute-1.amazonaws.com:8080/](http://ec2-107-22-110-147.compute-1.amazonaws.com:8080/);

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
+   Number of lines and words are calculated by Linux shell "wc". Line number is based on '\n'. Word number is based on space.
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
+    If multiple large file are uploaded at the same time, the progress bar may not fade out smoothly. 
     One possible reason is calculating number of lines and words leads to huge amount of CPU utilization and I/O for large file.
+    Must run on a Linux or Unix shell with wc command. Windows compatible will be added soon.
+    Haven't finish the top 5 frequent words question. Planning to write a C/C++ code and use exec module to run it. 
     The algorithm is: scan the whole file and using a HashMap to save the frequency of words. 
     Iterate the HashMap and maintain a maxHeap with size 5 to track the top 5 words. 
     It's a O(n(logk)) (where k=5) algorithm.

## Git
+    Ropository can be found here: [https://github.com/jinglundong/DataHero-File-Upload-.git](https://github.com/jinglundong/DataHero-File-Upload-.git).

## License
Released under the [MIT license](http://www.opensource.org/licenses/MIT).

