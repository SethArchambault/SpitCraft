/* Init */

var testing = true;

debug('load elements');


var $poem_textarea 	= document.getElementById('poem-textarea');
var $logo_div 		= document.getElementById('logo-div');
var $save_a 		= document.getElementById('save-a');
var $save_panel_div = document.getElementById('save-panel-div');
var $title_input 	= document.getElementById('title-input');
var $save_input_fields 	= document.getElementById('save-input-fields');
var $title_input_group 	= document.getElementById('title-input-group');
var $save_button_div 	= document.getElementById('save-button-div');
var $save_header 		= document.getElementById('save-header');
var $title_done_button  = document.getElementById('title-done-button');
var $poet_input_group 	= document.getElementById('poet-input-group');
var $poet_input 		= document.getElementById('poet-input');
var $poet_done_button 	= document.getElementById('poet-done-button');
var $share_input_group 	= document.getElementById('share-input-group');
var $share_desc			= document.getElementById('share-desc'); 
var $share_input		= document.getElementById('share-input'); 
var $feedback_div 		= document.getElementById('feedback-div');


var state = undefined;


/* init */

function init()
{

	if (!localStorage.poem_content)
	{
		localStorage.poem_content = "";
	}

	if (!localStorage.poem_poet)
	{
		localStorage.poem_poet = "";
	}

	if (!localStorage.poem_title)
	{
		localStorage.poem_title = "";
	}

	initial_state.init();
	blank_slate_state.init();
	typing_poem_state.init();
	save_title_state.init();
	save_poet_state.init();
	share_state.init();

	state = initial_state;
	state.enter();

	if(localStorage.poem_title.length > 0)
	{
		$share_input.value = convertTextToUrl(localStorage.poem_title);	
	}

	if (localStorage.poem_content.length <= 0)
	{
		initial_state.blank_slate();
	}
	else
	{
		$poem_textarea.value = localStorage.poem_content;
		initial_state.typing_poem();
	}

}




/* KeyUpEvents */

$poem_textarea.onkeyup = poemTextareaKeyUp;
function poemTextareaKeyUp() {
	localStorage.poem_content = this.value;
	if(this.value.length > 0) 
	{
		state.typing_poem();
	}
	else
	{
		state.blank_slate();
		localStorage.poem_title = "";
	}
}


$title_input.onkeyup = titleInputKeyUp;
function titleInputKeyUp()
{
	localStorage.poem_title = this.value;
	$share_input.value = convertTextToUrl(this.value);

	if (this.value.length > 0) 
	{

		$title_done_button.classList.add("active");
		$title_done_button.removeAttribute('disabled');
	}
	else
	{
		$title_done_button.classList.remove("active");
		$title_done_button.setAttribute('disabled', "");
	}
}

$poet_input.onkeyup = poetInputKeyUp;
function poetInputKeyUp()
{
	localStorage.poem_poet = this.value;
	if (this.value.length > 0) 
	{
		$poet_done_button.classList.add("active");
		$poet_done_button.removeAttribute('disabled');
	}
	else
	{
		$poet_done_button.classList.remove("active");
		$poet_done_button.setAttribute('disabled', "");
	}
}


/** Clicks **/

$poem_textarea.onclick = poemTextareaClick;
function poemTextareaClick() {
	state.typing_poem();
}

$save_a.onclick = saveClick;
function saveClick(e)
{
	e.preventDefault();
	state.save_title();
}
$poet_done_button.onclick = poetDoneButtonClick;
function poetDoneButtonClick()
{
	state.share();
}

$title_done_button.onclick = titleDoneButtonClick;
function titleDoneButtonClick()
{
	state.save_poet();
}

$title_input.onclick = titleInputClick;
function titleInputClick() 
{
	state.save_title();
}

$poet_input.onclick = poetInputClick;
function poetInputClick() 
{
	state.save_poet();
}

$share_input.onclick = shareInputClick;
function shareInputClick()
{
	state.share();
	this.select();
}


/** New State Machine **/

var initial_state = {
	init : function()
	{

	},
	enter : function()
	{
		debug('Entering initial_state');
	},
	exit : function()
	{
		debug('Exiting initial_state');
	},
	blank_slate : function()
	{
		debug('Changing from Initial State to Blank Slate');
		randomInspiration();

		changeState(blank_slate_state);
	},
	typing_poem : function()
	{
		debug('Changing from Initial State to Typing Poem State');
		
		/* Hide Logo */
		$logo_div.classList.add("hide");	

		changeState(typing_poem_state);
	},
	save_title : function()
	{

	},
	save_poet : function()
	{

	},
	share : function()
	{

	}
}

/* Blank Slate State */

var	blank_slate_state = {
	init : function()
	{

	},
	enter : function() 
	{
		debug('Entering blank slate');
		/* Show Logo */
	    $logo_div.classList.remove("hide");		

		/* MOVE THIS Hide Save Button */
		$save_panel_div.classList.add("hide");

	},
	exit : function() 
	{
		debug('Exiting blank slate');
	},
	blank_slate : function()
	{
		debug('already in blank slate state');
	},
	typing_poem : function() 
	{
		if ($poem_textarea.value.length > 0)
		{
			/* Hide Logo */
			$logo_div.classList.add("hide");	

			changeState(typing_poem_state);			
		}
	},
	save_title : function()
	{
		debug('Can not change from blank slate state to save title state');
	},
	save_poet : function()
	{
		debug('Can not change from blank slate state to save poet state');

	},
	share : function()
	{
		debug('Can not change from blank slate state to share state');
	}
};

/* Typing Poem State */

var typing_poem_state = {
	init : function()
	{

	},
	enter : function() 
	{
		debug('Entering typing poem slate');

		/* Toggle Save Header to Button */
		$save_panel_div.classList.remove('hide');

		/* Activate Poem Textarea */
		$poem_textarea.classList.add("active");
	},
	exit : function()
	{
		debug('Exiting typing poem slate');

	},
	blank_slate : function()
	{
		/* TypingPoem > BlankSlate */
		/* Show Logo */
	    $logo_div.classList.remove('hide');		
	    
	    /* Hide Save Button */
	    $save_panel_div.classList.add("hide");

		changeState(blank_slate_state);
	},
	typing_poem :function()
	{
		// debug('already in typing poem state');
	},
	save_title : function()
	{
		if (!localStorage.poem_content || localStorage.poem_content.length <= 0)
		{
			debug("No poem content, can't change to save title state");
			return;
		}

		/* Deactivate Poem Textarea */
		$poem_textarea.classList.remove('active');

		/* Toggle Save Button to Header */    
	    $save_button_div.classList.add('hide');
	    $save_header.classList.remove('hide');
	
		/* Scrollup Save Panel */
	    $save_panel_div.classList.add("active", "scroll-up");

	    /* Show Save Fields */
	    $save_input_fields.classList.remove('hide');
		changeState(save_title_state);

	},
	save_poet : function()
	{
		debug('can not change from typing poem to save title state');

	},
	share : function()
	{
		debug('can not change from typing poem to share state');		
	}

};

/* save title state */

var save_title_state = {
	init : function()
	{

		$title_input.value = localStorage.poem_title;


		/* Toggle Save Header to Button */
		$save_header.classList.add("hide");
		$save_button_div.classList.remove('hide');

		/* Hide Save Input Fields */
		$save_input_fields.classList.add('hide');

	},
	enter : function() 
	{
		debug('Entering save title state');

	    $title_input_group.classList.add("active");

	    // Check Title Length, display done button if needed
		if ($title_input.value.length > 0) 
		{
			$title_done_button.classList.add("active");
			$title_done_button.removeAttribute('disabled');
		}
		else
		{
			$title_done_button.classList.remove("active");
			$title_done_button.setAttribute('disabled', "");
		}

	},
	exit : function()
	{
		debug('Exiting save title state');

	    /* Deactivate Title Button */
		$title_done_button.setAttribute("disabled", "");
		$title_done_button.classList.remove("active");

		/* Deactivate Title Group */
	    $title_input_group.classList.remove("active");

	    $title_input.focus();
	},
	typing_poem : function()
	{
		debug('changing from save title state to typing poem state');
		/* Toggle Save Header to Button */
		$save_header.classList.add("hide");
		$save_button_div.classList.remove("hide");

	    /* Hide Save Panel */
	    $save_input_fields.classList.add('hide');
		$save_panel_div.classList.remove('active', "scroll-up");

	    changeState(typing_poem_state);
	},
	save_title : function()
	{
		debug('Already in save title state');
	},
	save_poet : function()
	{
		debug('changing from save title state to save poet state');

		if (localStorage.poem_content.length <= 0)
		{
			debug("No poem content, can't change to save poet state");
			return;
		}

		if (localStorage.poem_title.length <= 0)
		{
			debug("No poem title, can't change to save poet state");
			return;
		}
		
	    changeState(save_poet_state);
	},
	share : function()
	{
		debug('changing from save title state to share state');

		if (localStorage.poem_content.length <= 0)
		{
			debug("No poem content, can't change to share state");
			return;
		}

		if (localStorage.poem_title.length <= 0)
		{
			debug("No poem title, can't change to share state");
			return;
		}

		if (localStorage.poem_poet.length <= 0)
		{
			debug("No poem poet, can't change to share state");
			return;
		}

		changeState(share_state);

	}
};

var save_poet_state = {
	init : function()
	{
		$poet_input.value = localStorage.poem_poet;



		if (localStorage.poem_content.length > 0 && localStorage.poem_title.length > 0)
		{
		    /* Activate Poet Input */
		    $poet_input.removeAttribute('disabled');
		}




	},
	enter : function()
	{
		debug('Entering save poet state');

		/* Activate Poet Group */
	    $poet_input_group.classList.add("active");

	    /* Activate Poet Input */
	    $poet_input.removeAttribute('disabled');

	    // see if poet done button should be displayed
    	if ($poet_input.value.length > 0) 
		{
			$poet_done_button.classList.add("active");
			$poet_done_button.removeAttribute('disabled');
		}
		else
		{
			$poet_done_button.classList.remove("active");
			$poet_done_button.setAttribute('disabled', "");
		}

		$poet_input.focus();
	},
	exit : function()
	{
		debug('Exiting save poet state');

	    /* Deactivate Poet Group */
	    $poet_input_group.classList.remove("active");

	    /* Deactivate Poet Button */
		$poet_done_button.setAttribute("disabled", "");	
		$poet_done_button.classList.remove("active");
	},
	blank_slate_state : function()
	{

	},
	typing_poem : function()
	{
		/* Toggle Save Header to Button */
		$save_header.classList.add("hide");
		$save_button_div.classList.remove('hide');

	    /* Hide Save Panel */
	    $save_input_fields.classList.add('hide');
		$save_panel_div.classList.remove('active', "scroll-up");


	    changeState(typing_poem_state);

	},
	save_title : function()
	{
	    changeState(save_title_state);
	},
	save_poet : function()
	{

	},
	share : function()
	{


		if (localStorage.poem_content.length <= 0)
		{
			debug("No poem content, can't change to share state");
			return;
		}

		if (localStorage.poem_title.length <= 0)
		{
			debug("No poem title, can't change to share state");
			return;
		}

		if (localStorage.poem_poet.length <= 0)
		{
			debug("No poem poet, can't change to share state");
			return;
		}

	    changeState(share_state);
	}
};

var share_state = {
	init : function()
	{

	},
	enter : function()
	{
		debug('Entering share state');

		/* Activate Share Group */
	    $share_input_group.classList.add("active");


		/* Ajax Save */
		$share_desc.innerText = "Saving";

		/* set loading indicator */
		var sending = setInterval(sendingInterval, 150);
		function sendingInterval()
		{
			if ($share_desc.innerText.length < 9)
			{
				$share_desc.innerText = $share_desc.innerText + ".";
			}
			else {
				$share_desc.innerText = "Saving";			
			}
		}

		/* save */
		var ajax = new XMLHttpRequest();
		ajax.open("POST", "/poems");
		ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		ajax.onreadystatechange = function () {
			if (ajax.readyState != 4) return;

			if (ajax.status != 200)
			{
				/* Error */
				$share_desc.innerText = "Dang, something broke: " + ajax.status + " " + ajax.responseText;
				clearInterval(sending);

				$feedback_div.classList.add("fade-in");
				$feedback_div.classList.remove("is-paused");
				$feedback_div.classList.remove("hide");

				return;				
			}

			/* Success */
			setShareInstructions();
			clearInterval(sending);

			$feedback_div.classList.add("fade-in");
			$feedback_div.classList.remove("is-paused");
			$feedback_div.classList.remove("hide");

		};
		ajax.onerror = function() {
			/* Error */
			$share_desc.innerText = "Dang, something broke: " + ajax.status + " " + ajax.responseText;
			clearInterval(sending);

			$feedback_div.classList.add("fade-in");
			$feedback_div.classList.remove("is-paused");
			$feedback_div.classList.remove("hide");

		}
		ajax.send(JSON.stringify({
	        content: 	localStorage.poem_content,
	        title: 		localStorage.poem_title,
	        poet: 		localStorage.poem_poet
	    }));




	},
	exit : function()
	{
		debug('Entering share state');

	    /* Deactivate Share Group */
	    $share_input_group.classList.remove("active");

		$feedback_div.classList.add("hide");

	},
	typing_poem : function()
	{
		/* Toggle Save Header to Button */
		$save_header.classList.add("hide");
		$save_button_div.classList.remove('hide');

	    /* Hide Save Panel */
	    $save_input_fields.classList.add('hide');
		$save_panel_div.classList.remove('active', "scroll-up");


		changeState(typing_poem_state);
	},
	save_title : function()
	{
	    changeState(save_title_state);
	},
	save_poet : function()
	{
	    changeState(save_poet_state);
	},
	share : function()
	{
		debug('Already on share state');
	}
};

/* this should be private */
function changeState(_state)
{

	if (state === _state) {
		debug("You are running in circles. You may not change from state " + state + " to state "+ state);
		return;
	}
	state.exit();
	state = _state;
	state.enter();
}






function setShareInstructions()
{

	var isMobile = {
	    Android: function() {
	        return navigator.userAgent.match(/Android/i);
	    },
	    BlackBerry: function() {
	        return navigator.userAgent.match(/BlackBerry/i);
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	    },
	    Opera: function() {
	        return navigator.userAgent.match(/Opera Mini/i);
	    },
	    Windows: function() {
	        return navigator.userAgent.match(/IEMobile/i);
	    },
	    any: function() {
	        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	    }
	};

	var shareInstructionText = "Copy this link and share with someone who gets it.";
	if (isMobile.Android)
	{
		shareInstructionText = "Press and hold the link above. Click [icon] to copy. Share with someone who gets it."
	}
	else if (isMobile.iOS)
	{
		shareInstructionText = "Tap the link above. Share with someone who gets it."

	}

	$share_desc.innerText = shareInstructionText;

}


/** Utility **/


function convertTextToUrl(text)
{
	var clean_text = text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
	var url = window.location.protocol + "//" + window.location.host + "/p/" + clean_text;
	return url;
}


function randomInspiration()
{
	var inspiration = [
		"Write your poem here..",
		"Pour your soul here..",
		"Vent your frustration here..",
		"Sing your terror here..",
		"Prove motherfuckers wrong here.."
	];
	$poem_textarea.placeholder = inspiration[Math.floor(Math.random() * inspiration.length)];
	$poem_textarea.classList.remove('is-paused');
}

function debug(message) 
{
	if (testing) {
		console.log("Debug:");
		console.log(message);	
	}
}

init();
