// ==UserScript==
// @name         AT Global Message Helper
// @namespace    https://comastuff.com/
// @version      0.7
// @description  Provides templates for all universes in a particular community, without having to re-type them for each universe.
// @author       Neshi & Rav3n
// @match        https://*.ogame.gameforge.com/game/admin2/sendmsg.php?uid=*
// @icon         https://www.google.com/s2/favicons?domain=gameforge.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @updateURL    https://github.com/GA-Rav3n/Message-Helper/raw/main/AT%20Global%20Message%20Helper.user.js
// @downloadURL  https://github.com/GA-Rav3n/Message-Helper/raw/main/AT%20Global%20Message%20Helper.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	//********** USE CUSTOM MESSAGE FILE **********
	var useCustomJson = false; // Change this to true to activate
	var customJsonLoc = "YOUR CUSTOM LINK HERE";
	//********** END CUSTOM SETTINGS **********

	// DO NOT EDIT ANYTHING BELOW THIS POINT!
	var urlID = document.URL.match(/(^https?):\/\/s([0-9]+)\-(\w+)/);
	var community = urlID[3];
	var jsonScript;
	var rankImage = "https://image.board.gameforge.com/uploads/ogame/en/Other_ogame_en_2021_676fdeb34b32ae65844ebcd411598c9f.png"; // Placeholder Only
	var lvl5Rank = "", lvl6Rank = "", lvl8Rank = "";
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

		   $('form tr:eq(4) td:eq(0)').css('width','35%');
		   $('form tr:eq(4) td:eq(0)').append('<select id=\'templatePicker\'></select>');

		   let templatePicker = $('#templatePicker');
		   templatePicker.append($('<option disabled selected>--Choose A Global Template--</option>'));
		   $('form input[type="checkbox"]').prop('checked',true);
		   setPermLevel();
		   for(var i=0;i<data.messages.length;i++){
            templatePicker.append($('<option value=\''+data.messages[i].content+'\' text=\''+data.messages[i].title+'\'>'+data.messages[i].title+'</option>'));
        }

        templatePicker.on('change',function(){
			setPermLevel(); // Backup disable in case the first check fails.
            var selected = templatePicker.find('option:selected');
            var message = selected.val().replace('%username%',recipient).replace('%adminname%',operator).replace('%rank%',rankImage);

            $('form textarea').val(message);
            $('form input[name="betreff"]').val(selected.text());
            $('form input[type="checkbox"]').prop('checked',true);
        });
        sortSelect(document.getElementById('templatePicker'))
       });

function setServerInfo() {
	switch(community) {
		case 'en':
			lvl5Rank = "https://image.board.gameforge.com/uploads/ogame/en/GameOperator_ogame_en_60b28f910d049ef1acab434f7eeb9860.png";
			lvl6Rank = "https://image.board.gameforge.com/uploads/ogame/en/SuperGameOperator_ogame_en_60b28f910d049ef1acab434f7eeb9860.png";
			lvl8Rank = "https://image.board.gameforge.com/uploads/ogame/en/GameAdmin_ogame_en_60b28f910d049ef1acab434f7eeb9860.png";
			jsonScript = "https://raw.githubusercontent.com/GA-Rav3n/Message-Helper/main/EN-TPL.json";
			break;
		case 'us':
			lvl5Rank = "https://image.board.gameforge.com/uploads/ogame/us/Other_ogame_us_2021_ca08e47d785e2c657b2f6c73a9f9f042.png";
			lvl6Rank = "https://image.board.gameforge.com/uploads/ogame/us/Other_ogame_us_2021_a64c12d93debc3b4bf2acf40accf4112.png";
			lvl8Rank = "https://image.board.gameforge.com/uploads/ogame/us/Other_ogame_us_2020_c5ff26ada345b170145639b3ce318f5f.png";
            jsonScript = "https://raw.githubusercontent.com/GA-Rav3n/Message-Helper/main/US-TPL.json";
			break;
		case 'pl':
			lvl5Rank = "https://image.board.gameforge.com/uploads/ogame/pl/GameOperator_ogame_pl_2017_4cfb45587345335871ea2905af0d8195.png";
			lvl6Rank = "https://image.board.gameforge.com/uploads/ogame/pl/SuperGameOperator_ogame_pl_2017_3d5443be51fa69395c04a8d15e4fe7ec.png";
			lvl8Rank = "https://image.board.gameforge.com/uploads/ogame/pl/GameAdmin_ogame_pl_3fba1e1ad4cb45fe3fbb6af772458cf8.png";
            jsonScript = "https://raw.githubusercontent.com/Neshi/Og/main/data/messages.json";
			break;
		default:
            alert("UNSUPPORTED VERSION\n\nThis version of the Global Message Helper cannot be used on this domain in the host language as this language isn't currently supported.\nPlease contact Rav3n on Mattermost to advise him of this and to provide translations for your community.");
			break;
    }
	if (useCustomJson) {jsonScript = customJsonLoc;}
}

function setPermLevel() {
	var adminLevel = 0;
	var x = document.evaluate("/html/body/div[3]/div[2]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
	if(x){
		if ((document.querySelector('a[href*="op_overview"]') !== null) && (document.querySelector('a[href*="interface"]') !== undefined)) {adminLevel = 8;} // Admin is GA or higher
		else if ((document.querySelector('a[href*="op_overview"]') !== null) && (document.querySelector('a[href*="interface"]') == undefined)) {adminLevel = 6;} // User is SGO
		else {adminLevel = 5;} // User is GO
		console.log("AdminLevel: " + adminLevel);
		switch(adminLevel) {
			case 8:
				$('form input[type="checkbox"]').prop('disabled',false);
				rankImage = lvl8Rank;
				break
			case 7:
			case 6:
				$('form input[type="checkbox"]').prop('disabled',false);
				rankImage = lvl6Rank;
				break;
			case 5:
			default:
				$('form input[type="checkbox"]').prop('disabled',true);
				rankImage = lvl5Rank;
				break;
		}
	}
}

})();
