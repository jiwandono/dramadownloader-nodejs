$(function() {
	var endpoints = [
		'http://api.dramadownloader.com',
	];

	handleInputBoxChange();
	detectRequestParameter();
	initSubmitListener();
	initRetryButton();
	initDownloadButtonListener();
	
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
		$('#result-fail').hide();
		$('#result-processing').show();
		
		var postData = {
			url: url
		};

		var endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];

		var t0 = 0;
		try {
			t0 = performance.now();
		} catch(e) {
			// no-op
		}

		$.ajax({
			type: "POST",
			url: endpoint + "/v1/drama/fetchstreams",
			data: JSON.stringify(postData),
			success: function(response) {
				var elapsedMsec = 0;
				try {
					var t1 = performance.now();
					elapsedMsec = Math.round(t1 - t0);
				} catch(e) {
					// no-op
				}

				var downloadables = response.links;
				if(response.status == "OK") {
					ga('send', 'event', 'downloads', 'submit-success', url, elapsedMsec);
					handleSuccess(downloadables);
				} else if(response.status == "FAILED") {
					ga('send', 'event', 'downloads', 'submit-fail-int', url, elapsedMsec);
					handleFail();
				} else {
					ga('send', 'event', 'downloads', 'submit-unsupported', url, elapsedMsec);
					handleFail();
				}
			},
			error: function() {
				try {
					var t1 = performance.now();
					var elapsedMsec = Math.round(t1 - t0);
					ga('send', 'event', 'downloads', 'submit-fail-ext', url, elapsedMsec);
				} catch(e) {
					// no-op
				}

				handleFail();
			}
		});
	}

	function initSubmitListener() {
		$('#form-main').submit(function(e) {
			var origUrl = $('#form-text').val();
			var trimUrl = origUrl.trim();
			$('#form-text').val(trimUrl);
			ga('send', 'event', 'downloads', 'submit', trimUrl);
		});
	}

	function initRetryButton() {
		$('a.button-retry').click(function() {
			detectRequestParameter();
		});
	}

	function initDownloadButtonListener() {
		$(document).on('click', '.button-download', function(e) {
			ga('send', 'event', 'downloads', 'download-lclick');
		});

		$(document).on('contextmenu', '.button-download', function(e) {
			ga('send', 'event', 'downloads', 'download-rclick');
		});
	}
	
	function createDownloadButtons(downloadables) {
		var caption = "DOWNLOAD";
		for(var i = 0; i < downloadables.length; i++) {
			var buttonText = caption + ' <br />(' + downloadables[i].name + ')';
			var $button = $('<a>', {
				class   : 'button button-download',
				href    : downloadables[i].url,
			}).html(buttonText);

			if(downloadables[i].isDirectLink)
				$button.attr("download", "");
			else
				$button.attr("target", "_blank");
			
			$('#download-links').append($button);
		}
	}
	
	function handleSuccess(downloadables) {
		$('form input').removeAttr('disabled', 'disabled');
		$('.result').hide();
		$('#result-success').show();
		
		createDownloadButtons(downloadables);
	}
	
	function handleFail() {
		$('form input').removeAttr('disabled', 'disabled');
		$('.result').hide();
		$('#result-fail').show();
	}

	function handleUnsupported() {
		$('form input').removeAttr('disabled', 'disabled');
		$('.result').hide();
		$('#result-unsupported').show();
	}
});
