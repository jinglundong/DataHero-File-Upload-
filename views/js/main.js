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
	    maxFileSize: 5*1024*1024,  //5MB	    
      acceptFileTypes: /(\.|\/)(txt)$/i,
	    process: [
		{
		    action: 'load',
		    fileTypes: /^image\/(gif|jpeg|png)$/,
		    maxFileSize: 5*1024*1024,  //5MB	 
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

});
