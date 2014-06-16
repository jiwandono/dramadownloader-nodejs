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
			url: "getDownloadInfo",
			data: postData,
			success: function(response) {
				var downloadInfo = response.downloadInfo;
				if(downloadInfo) {
					handleSuccess(downloadInfo);
				} else {
					handleFail();
				}
			},
			error: function() {
				handleFail();
			}
		});
	}
	
	function handleSuccess(downloadInfo) {
		console.log(downloadInfo);
		$('form input').removeAttr('disabled', 'disabled');
		$('#download-url').attr('href', downloadInfo.url);
		$('#download-url').attr('title', 'Download ' + downloadInfo.title);
		$('.result').hide();
		$('#result-success').show();
	}
	
	function handleFail() {
		$('form input').removeAttr('disabled', 'disabled');
		$('.result').hide();
		$('#result-fail').show();
	}
});