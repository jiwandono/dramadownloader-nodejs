$(function() {
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
		
		$.ajax({
			type: "POST",
			url: "getDownloadables",
			data: postData,
			success: function(response) {
				var downloadables = response.downloadables;
				if(downloadables) {
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
		
		$('#download-title').text(downloadables[0].title);
		createDownloadButtons(downloadables);
	}
	
	function handleFail() {
		$('form input').removeAttr('disabled', 'disabled');
		$('.result').hide();
		$('#result-fail').show();
	}
});