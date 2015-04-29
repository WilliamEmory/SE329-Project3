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

$(function() {
  chrome.tabs.query({ currentWindow: true }, function(tab) {
    for (var i = tab.length - 1; i >= 0; i--) {
      var currentTab = tab[i];
        
      $('#tablist').append(
        '<li id="' + currentTab.id + '">' +
          '<img width="25" height="25" src="' + currentTab.favIconUrl + '">'  +
          '<a>' + ellipsize(currentTab.title) + '</a>' +
		 // '<span class="expand">^</span>' +
          '<span class="close">x</span>' +
        '</li>');
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

    jQuery('button').on('click', function () {
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
				
				tabsToRemove.push(currentTab.id);
				//condesedList.push(entry) is where the error in the program is happening.
				condensedList.push(entry);
				

            }

            localStorage.setItem("condensedList", condensedList);

            chrome.tabs.remove(tabsToRemove);
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
