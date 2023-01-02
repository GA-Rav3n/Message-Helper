// ==UserScript==
// @name         AT Global Message Helper
// @namespace    https://comastuff.com/
// @version      0.4
// @description  Provides templates for all universes in a particular community, without having to re-type them for each universe.
// @author       Neshi & Rav3n
// @match        https://*.ogame.gameforge.com/game/admin2/sendmsg.php?uid=*
// @icon         https://www.google.com/s2/favicons?domain=gameforge.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @updateURL    https://github.com/Neshi/Og/raw/main/scripts/ATMessagingHelper.user.js
// @downloadURL  https://github.com/Neshi/Og/raw/main/scripts/ATMessagingHelper.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	var urlID = document.URL.match(/(^https?):\/\/s([0-9]+)\-(\w+)/);
	var community = urlID[3];
	var jsonScript;
	setServerInfo();
	//console.log("Community: " + community);
    function sortSelect(selElem) {
        var tmpAry = new Array();
        for (var i=0;i<selElem.options.length;i++) {
            tmpAry[i] = new Array();
            tmpAry[i][0] = selElem.options[i].text;
            tmpAry[i][1] = selElem.options[i].value;
        }
        tmpAry.sort();
        while (selElem.options.length > 0) {
            selElem.options[0] = null;
        }
        for (var i=0;i<tmpAry.length;i++) {
            var op = new Option(tmpAry[i][0], tmpAry[i][1]);
            selElem.options[i] = op;
        }
        return;
    }

    let titleRegex = /^(.*)\) (.*)/
    let title = $(document).find("title").text();
    let match = title.match(titleRegex);
	//console.log("0: " + match[0] + "\n1: " + match[1] + "\n2: " + match[2] + "\n3: " + match[3]); // For debug purposes only
    const operator = match[2];

	let findName = $(document.getElementsByTagName("input"));
	if (findName[2].value != "on") {var recipient = findName[2].value;} else {var recipient = findName[3].value;}

       $.getJSON(jsonScript, function (data){

		   $('form tr:eq(4) td:eq(0)').css('width','33%');
		   $('form tr:eq(4) td:eq(0)').append('<select id=\'templatePicker\'></select>');

		   let templatePicker = $('#templatePicker');
		   templatePicker.append($('<option disabled selected>--Choose A Global Template--</option>'));
		   $('form input[type="checkbox"]').prop('checked',true);
		   $('form input[type="checkbox"]').prop('disabled',true); // Ensures that by using this script, notes MUST be saved and CANNOT be unchecked.
		   for(var i=0;i<data.messages.length;i++){
            templatePicker.append($('<option value=\''+data.messages[i].content+'\' text=\''+data.messages[i].title+'\'>'+data.messages[i].title+'</option>'));
        }

        templatePicker.on('change',function(){
            var selected = templatePicker.find('option:selected');
            var message = selected.val().replace('%username%',recipient).replace('%adminname%',operator);

            $('form textarea').val(message);
            $('form input[name="betreff"]').val(selected.text());
            $('form input[type="checkbox"]').prop('checked',true);
			$('form input[type="checkbox"]').prop('disabled',true); // Backup disable in case the first check fails.
        });
        sortSelect(document.getElementById('templatePicker'))
       });

function setServerInfo() {
	switch(community) {
        case 'en':
		case 'us':
            jsonScript="https://raw.githubusercontent.com/GA-Rav3n/Message-Helper/main/EN-TPL.json";
			break;
		case 'pl':
            jsonScript="https://raw.githubusercontent.com/Neshi/Og/main/data/messages.json";
			break;
		default:
            alert("UNSUPPORTED VERSION\n\nThis version of the Global Message Helper cannot be used on this domain in the host language as this language isn't currently supported.\nPlease contact Rav3n on Mattermost to advise him of this and to provide translations for your community.");
			break;
    }
}

})();