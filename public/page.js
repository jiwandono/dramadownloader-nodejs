$(function() {
	var endpoints = [
		'http://dd11.dramadownloader.com',
		'http://dd12.dramadownloader.com',
		'http://dd13.dramadownloader.com',
		'http://dd14.dramadownloader.com'
	];

	handleInputBoxChange();
	detectRequestParameter();
	
	/* ---------------- */
	
	function handleInputBoxChange() {
		$('#form-text').on('input', function() {
			$('.result').hide();
		});
	}
	
	function detectRequestParameter() {
		var url = $.url().param('url');
		if(url) {
			$('#form-text').val(url);
			getDownloadUrl(url);
		}
	}

	function getDownloadUrl(url) {
		$('form input').attr('disabled', 'disabled');
		$('#result-processing').show();
		
		var postData = {
			url: url
		};
		
		var endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];

		$.ajax({
			type: "POST",
			url: endpoint + "/getDownloadables",
			data: postData,
			success: function(response) {
				var downloadables = response.downloadables;
				if(downloadables.length > 0) {
					handleSuccess(downloadables);
				} else {
					handleFail();
				}
			},
			error: function() {
				handleFail();
			}
		});
	}
	
	function createDownloadButtons(downloadables) {
		var caption = "DOWNLOAD";
		for(var i = 0; i < downloadables.length; i++) {
			var buttonText = downloadables.length > 1
					? caption + ' ' + 'PART ' + (i+1)
					: caption;
			var $button = $('<a>', {
				class   : 'button button-download',
				href    : downloadables[i].url,
				download: ''
			}).text(buttonText);
			
			$('#download-links').append($button);
		}
	}
	
	function handleSuccess(downloadables) {
		$('form input').removeAttr('disabled', 'disabled');
		$('.result').hide();
		$('#result-success').show();
		
		if(downloadables[0].title) {
			$('#download-title').text(downloadables[0].title);
			document.title = downloadables[0].title + ' | ' + document.title;
		}
		createDownloadButtons(downloadables);
	}
	
	function handleFail() {
		$('form input').removeAttr('disabled', 'disabled');
		$('.result').hide();
		$('#result-fail').show();
	}
});