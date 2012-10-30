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


$(function () {
  'use strict';

  // Initialize the jQuery File Upload widget:
  $('#fileupload').fileupload({
      // Uncomment the following to send cross-domain cookies:
      //xhrFields: {withCredentials: true},
      url: 'http://localhost:8888'
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

	
	//  settings:
	$('#fileupload').fileupload('option', {
	    url: 'http://localhost:8888',
	    maxFileSize: 1*1024*1024*1024,  //1GB	    
      acceptFileTypes: /(\.|\/)(txt)$/i,
	    process: [
		{
		    action: 'load',
		    fileTypes: /^image\/(gif|jpeg|png)$/,
		    maxFileSize: 1*1024*1024*1024,  //1GB	 
		},
		{
		    action: 'resize',
		    maxWidth: 1440,
		    maxHeight: 900
		},
		{
		    action: 'save'
		}
	    ]
	});

    $(window).load(function(){                  
        // Load existing files:
        $.ajax({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},       
            url: $('#fileupload').fileupload('option', 'url'),
            dataType: 'json',
            context: $('#fileupload')[0]
        }).done(function (result) {
            $('.files').children().remove();
            if (result && result.length) {
	        $(this).fileupload('option', 'done')
	            .call(this, null, {result: result});
            }
        });        
    });            
});
