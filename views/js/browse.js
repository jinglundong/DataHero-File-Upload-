/*
 * jQuery File Upload Plugin JS Example 6.11
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Modified by Jinglun Dong. October 27, 2012.
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global $, window, document */

$(function () {
  'use strict';

  // Initialize the jQuery File Upload widget:
  $('#fileupload').fileupload({
      // Uncomment the following to send cross-domain cookies:
      //xhrFields: {withCredentials: true},
      url: 'http://ec2-107-22-110-147.compute-1.amazonaws.com:8888/'
  });

  // Enable iframe cross-domain access via redirect option:
  $('#fileupload').fileupload(
      'option',
      'redirect',
      window.location.href.replace(
          /\/[^\/]*$/,
          '/cors/result.html?%s'
      )
  );
    
    var fileInfo_local_copy=[{}];
    var ajaxCall = function() {
	    $.ajax({
	        // Uncomment the following to send cross-domain cookies:
	        //xhrFields: {withCredentials: true},
	        url: $('#fileupload').fileupload('option', 'url'),
	        dataType: 'json',
	        context: $('#fileupload')[0]
	    }).done(function (result) {	             
            if (result && result.length) {
                //only refresh the table if server return a different JSON                             
                if (JSON.stringify(result) !== JSON.stringify(fileInfo_local_copy)){                    
                    $('.files').children().remove();
                    fileInfo_local_copy = result;
		            $(this).fileupload('option', 'done').call(this, null, {result: result});
                }
	        }         
            else{
                //empty result
                if (!result.length){
                    $('.files').children().remove();
                }
            }
	    });
    };
    $(window).load(ajaxCall);
	// Load existing files:
    // Update the data in every 5 seconds. 
    setInterval(ajaxCall,5000);
	
});
