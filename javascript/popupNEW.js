//https://github.com/dburles/chrome-tab-popup trying to get jquery to work
var ellipsize = function(string) {
  var length = 40;
  if (string.length > length)
    return string.substr(0, length) + '&hellip;';
  return string;
};

function filterTabs(element){
    value = $(element).val();
    
}

function saveTab(group, title, url){
	console.log("group = " + group);
	console.log("title = " + title);
	console.log("url = " + url);
	var array = JSON.parse(localStorage.getItem(group));
	//if (typeof array !== typeof []) {
	if (array == null) {
			array = [];
   }
	var tab = {Title: title, Url:url};
	array.push(tab);
	localStorage.setItem(group, JSON.stringify(array));
	//console.log("Saved!" + tab);
};

function getGroup(group){
	var tabs = JSON.parse(localStorage.getItem(group));
	if (tabs == null) {
			tabs = [];
	}
	return tabs;
}

function createGroup(group){
	var groups = JSON.parse(localStorage.getItem("groups329"));
	
	if (groups == null) {
			groups = [];
	}
	
	groups.push(group);
	
	localStorage.setItem("groups329", JSON.stringify(groups));	
}

function getGroups(){
	var groups = JSON.parse(localStorage.getItem("groups329"));
	
	if (groups == null) {
			groups = [];
	}
	
	return groups;
}

function loadSavedGroups(){
	var groups = getGroups();
	//$('#tab3').empty();
	for(var i = 0; i<groups.length; i++){
		var name = groups[i];
		var removeid = "#" + name + "div";
		$(removeid).remove();
		console.log("name:" + name);
		$('#tab3').append(
			'<div id="' + name + "div" + '">' +
			'<h3>' + name + '</h3>' +
			'<ul id="' + name + "list" + '">' + '</ul>' +
			'</div>'
		);
		var tabs = getGroup(groups[i]);
		var listid = "#" + name + "list";
		for(var j = 0; j<tabs.length; j++){
			$(listid).append('<a href="' + tabs[j].Url + 
							'"<li>' + tabs[j].Title + '</li>' + '</a>');
		}
	}	
}

$('.test.menu .item').tab({history:false});


$(function() {
  chrome.tabs.query({ currentWindow: true }, function(tab) {
    for (var i = tab.length - 1; i >= 0; i--) {
      var currentTab = tab[i];
      //console.log("i = " + i);  
      $('#tablist').append(
        '<li id="' + currentTab.id + '">' +
          '<img width="25" height="25" src="' + currentTab.favIconUrl + '">'  +
          '<a>' + ellipsize(currentTab.title) + '</a>' +
		 // '<span class="expand">^</span>' +
          '<span class="close"><i class="remove circle icon"></span>' +
        '</li>' + '<button id="addButton' + i + '">Add to Group</button>' 
		+ '<select id="select' + i + '">Select Group</select>');
		var groups = getGroups();
		for(var j = 0; j<groups.length; j++){
			var id = "#select" + i;
			$(id).append('<option value="' + groups[j] + '">' +  groups[j] + '</option>');
		}
		var id = "#addButton" + i;

		//console.log(id);
		var size = tab.length;
	    jQuery(id).on('click', function () {
			//console.log("this is in response to the on click i = " + i);
			//console.log("the id is " + this.id);
			for(var k = 0; k<size; k++){
				var check = "addButton" + k;
				if(check == this.id){
					//console.log(this.id + " is equal to " + check);
					var selectid = "#select" + k;
					var groupid = $(selectid).val();
					currentTab = tab[k];
				}
			}
			saveTab(groupid,currentTab.title,currentTab.url);
			loadSavedGroups();
		});
    }
      $('#search').keyup(function(){
            var value = $(this).val().toLocaleLowerCase();
            if(value == ""){
                $('.tablist > li').show();
            }
            else{
                $('.tablist > li').each(function(){
                    var select = $(this).text().toLocaleLowerCase();
                    (select.indexOf(value) >= 0) ? $(this).show() : $(this).hide();
                });
            
            };
        });
    $('.tab-count').text(tab.length);
	
  });

  function expand() {
	var tabId = parseInt($(this).attr('id'), 10);
	chrome.windows.create({ tabId: tabId, focused: true });
  }
  
  $('body').on('dblclick', '#tablist li', expand);
  
  $('body').on('click', '.expand', expand);

  $('body').on('click', '#tablist li', function() {
    var tabId = parseInt($(this).attr('id'), 10);
    chrome.tabs.update(tabId, { active: true });
  });

  $('body').on('click', '.close', function() {
    var parent = $(this).parent();
    chrome.tabs.remove(parseInt(parent.attr('id'), 10));
    parent.remove();
  });
});

function empty(){
  $("#tablist").empty();
  $("#condenseList").empty();
  //$("#tab3").empty();
}

function refresh(){
  empty();
  chrome.tabs.query({ currentWindow: true }, function(tab) {
    for (var i = tab.length - 1; i >= 0; i--) {
	  var selectid = "#select" + i;
	  $(selectid).empty();
      var currentTab = tab[i];
      //console.log("i = " + i);  
      $('#tablist').append(
        '<li id="' + currentTab.id + '">' +
          '<img width="25" height="25" src="' + currentTab.favIconUrl + '">'  +
          '<a>' + ellipsize(currentTab.title) + '</a>' +
		 // '<span class="expand">^</span>' +
          '<span class="close">x</span>' +
        '</li>' + '<button id="addButton' + i + '">Add to Group</button>' 
		+ '<select id="select' + i + '">Select Group</select>');
		var groups = getGroups();
		for(var j = 0; j<groups.length; j++){
			var id = "#select" + i;
			$(id).append('<option value="' + groups[j] + '">' +  groups[j] + '</option>');
		}
		var id = "#addButton" + i;

		//console.log(id);
		var size = tab.length;
	    jQuery(id).on('click', function () {
			//console.log("this is in response to the on click i = " + i);
			//console.log("the id is " + this.id);
			for(var k = 0; k<size; k++){
				var check = "addButton" + k;
				if(check == this.id){
					//console.log(this.id + " is equal to " + check);
					var selectid = "#select" + k;
					var groupid = $(selectid).val();
					currentTab = tab[k];
				}
			}
			saveTab(groupid,currentTab.title,currentTab.url);
			loadSavedGroups();
		});
    }
      $('#search').keyup(function(){
            var value = $(this).val().toLocaleLowerCase();
            if(value == ""){
                $('.tablist > li').show();
            }
            else{
                $('.tablist > li').each(function(){
                    var select = $(this).text().toLocaleLowerCase();
                    (select.indexOf(value) >= 0) ? $(this).show() : $(this).hide();
                });
            
            };
        });
    $('.tab-count').text(tab.length);
	
  });
}

jQuery(document).ready(function () {
    jQuery('.tabs .tab-links a').on('click', function (e) {
        var currentAttrValue = jQuery(this).attr('href');

        // Show/Hide Tabs
        jQuery('.tabs ' + currentAttrValue).show().siblings().hide();

        // Change/remove current tab to active
        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');

        jQuery(".tab" + currentAttrValue).addClass('active').siblings().removeClass('active');
		
        e.preventDefault();
    });
	
	loadSavedGroups();
	
	function setTab(group, title, url){
		var storage = chrome.storage.local;
		var tabJson = {Title:title, Url:url};
		//console.log(tabJson.Title);
		storage.set({group:tabJson},function(result){
			//console.log(result.Title);
		});
		storage.get(group,function(result){
			//console.log(result.Title);
		});
	}

	function getTabGroup(group){
		var pages = [];
		var storage = chrome.storage.local;
		var allKeys;
		var allTitles = {};
		var allUrls;
		storage.get("",function(result){
			//console.log("result:" + result);
		});
		/*
					console.log("Keys" + allKeys);
			for(var i = 0; i<keys.length; i++){
				if(allKeys[i].Group.equals(group)){
					console.log("group equals group!]");
					pages.push(({title: allKeys[i].Title, url: allKeys[i].Url}));
				}
			}
		*/
		return pages;
	}
	
	/*
	function loadSavedGroups(){
		var groups = getGroups();
		for(var i = 0; i<groups.length; i++){
			var name = groups[i];
			console.log("name:" + name);
			$('#tab3').append(
				'<div id="' + name + "div" + '">' +
					'<h3>' + name + '</h3>' +
					'<ul id="' + name + "list" + '">' + '</ul>' +
				'</div>'
			);
			var tabs = getGroup(groups[i]);
			var listid = "#" + name + "list";
			for(var j = 0; j<tabs.length; j++){
				$(listid).append('<a href="' + tabs[j].Url + 
								'"<li>' + tabs[j].Title + '</li>' + '</a>');
			}
		}	
	}
	*/
	jQuery('#removeGroupButton').on('click', function () {
		localStorage.clear();
		chrome.runtime.reload();
	});
	
    jQuery('#condenseButton').on('click', function () {
        chrome.tabs.query({ currentWindow: true, active: false }, function (tab) {

            var tabsToRemove = [];
            condensedList = localStorage.getItem("condensedList");

            if (typeof condensedList !== typeof []) {
                condensedList = [];
            }

			var entry = {title: "", url: ""};

            for (var i = 0; i < tab.length; i++) {
                var currentTab = tab[i];
				
                entry = { title: currentTab.title, url: currentTab.url };

                $('#condenselist').append(
                '<li title="' + currentTab.title + '">' +
                    '<a href="' + currentTab.url + '">' + ellipsize(currentTab.title) + '</a>' +
                    '<span class="delete">x</span>' +
                '</li>');
				setTab("Group1",currentTab.title,currentTab.url);
				
				tabsToRemove.push(currentTab.id); 
				//condensedList.push(entry) is where the error in the program is happening.
				//condensedList.push(entry);
				//console.log(condensedList[i]);
            }
			var condensedGroup = condensedList; //getTabGroup("Group1");
		/*	for (var j = 0; j < condensedGroup.length; j++) {
				console.log(j);
				$('#tab3').append(
					'<div>' +
						'<ul>' +
							'<a href="' + condensedGroup[j].url + 
								'"<li>' + condensedGroup[j].title + '</li>' + 
							'</a>' +
						'</ul>' +
					'</div>'
				);
			}
		*/	
            localStorage.setItem("condensedList", condensedList);

            chrome.tabs.remove(tabsToRemove);
        });
    });
	
	jQuery('#sendGroupButton').on('click', function () {
		console.log("Hello World!")
	});
	
	
	$('#submitGroupButton').on('click', function () {
			var name = $('#addgroupname').val();
			createGroup(name);
			$('#tab3').append(
				'<div id="' + name + "div" + '">' +
					'<h3>' + name + '</h3>' +
					'<ul id=' + name + '">' + '</ul>' +
				'</div>'
			);
			$('#groupform').remove();
			$('#submitGroupButton').remove();
			refresh();
			//console.log("does this work?" + getGroup("Group1"));
		});
	
	jQuery('#createGroupButton').on('click', function () {
		$('#tab3').append(
          '<form id="groupform">' + 
		  '<br>Group Name:<br><input type="text" name="groupname" id=groupname>' +
		  '</form>' +
		  '<button id="submitGroupButton">Submit</button>');
		$('#submitGroupButton').on('click', function () {
			var name = $('#addgroupname').val();
			createGroup(name);
			$('#tab3').append(
				'<div id="' + name + "div" + '">' +
					'<h3>' + name + '</h3>' +
					'<ul id=' + name + '">' + '</ul>' +
				'</div>'
			);
			$('#groupform').remove();
			$('#submitGroupButton').remove();
			refresh();
			//console.log("does this work?" + getGroup("Group1"));
		});
	});

    $('body').on('click', '.delete', function () {
        var parent = $(this).parent();

        condensedList = localStorage.getItem("condensedList");
		//Error here condensed list null
		if(condensedList!= null){
			for (var i = 0; i < condensedList.length; i++) {
				if (condensedList[i].title === parent.attr('title')) {
					condensedList.splice(i, 1);
					break;
				}
			}
		}

        localStorage.setItem("condensedList", condensedList);

        parent.remove();
    });

    $('body').on('click', '#condenselist li', function () {
        var tabTitle = $(this).attr('title');
        var tabUrl = "";
        condensedList = localStorage.getItem("condensedList");

        for (var i = 0; i < condensedList.length; i++) {
            if (condensedList[i].title === tabTitle) {
                tabUrl = condensedList[i].url;
                $(this).remove();
                condensedList.splice(i, 1);
                localStorage.setItem("condensedList", condensedList);
                chrome.tabs.create({ url: tabUrl });
            }
        }
    });

});
