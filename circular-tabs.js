/**
 * Simple jQuery script to handle circular tabs.
 * @author Dirk Dresch <dirk.dresch@gmail.com>
 */

var tabs = new Array();
var maxTabNum = 23;
var draggedTab;
var activeTab = null;
var hasDragged = false;

var tabContents = [
  { title: 'Welcome', icon: '&#9733;', text: 'Click the "+" button to add more tabs. Drag any tab to reorder them around the circle.' },
  { title: 'Profile', icon: '&#9787;', text: 'Manage your user profile, update your avatar, and configure your display preferences.' },
  { title: 'Messages', icon: '&#9993;', text: 'You have 3 new messages. Check your inbox for the latest updates from your team.' },
  { title: 'Calendar', icon: '&#9776;', text: 'Upcoming: Team standup at 10:00 AM, Design review at 2:00 PM, Sprint planning at 4:00 PM.' },
  { title: 'Analytics', icon: '&#9650;', text: 'Page views are up 24% this week. Engagement rate: 67%. Average session duration: 4m 32s.' },
  { title: 'Settings', icon: '&#9881;', text: 'Configure your notification preferences, theme settings, and account security options.' },
  { title: 'Projects', icon: '&#9998;', text: 'Active projects: 5. In progress: 3. Completed this month: 12. Next deadline: Friday.' },
  { title: 'Files', icon: '&#9783;', text: 'Recent uploads: report.pdf, design-v3.sketch, meeting-notes.md. Storage used: 2.4 GB of 10 GB.' },
  { title: 'Team', icon: '&#9734;', text: '8 team members online. 2 away. Last activity: Anna updated the project roadmap 5 min ago.' },
  { title: 'Tasks', icon: '&#10003;', text: '14 tasks due this week. 6 completed, 3 in review, 5 remaining. Priority: redesign landing page.' },
  { title: 'Notes', icon: '&#9997;', text: 'Quick note: Remember to follow up on the API integration. Draft blog post due Thursday.' },
  { title: 'Search', icon: '&#8981;', text: 'Search across all your projects, files, messages, and team members in one place.' },
  { title: 'Reports', icon: '&#9638;', text: 'Monthly report ready for review. Revenue: +18%. Customer satisfaction: 4.6/5. Churn: -2%.' },
  { title: 'Contacts', icon: '&#9742;', text: '142 contacts synced. 12 new this month. Top interaction: Alex (15 conversations this week).' },
  { title: 'Bookmarks', icon: '&#9829;', text: '23 saved items. Categories: Design (8), Development (7), Research (5), Inspiration (3).' },
  { title: 'Alerts', icon: '&#9888;', text: '2 new alerts: Server CPU at 85% capacity. SSL certificate expires in 14 days.' },
  { title: 'Timeline', icon: '&#8634;', text: 'Project kickoff: Jan 15. Beta launch: Mar 1. Public release: Apr 20. Post-launch review: May 5.' },
  { title: 'Gallery', icon: '&#9856;', text: '48 images uploaded. 12 albums created. Most viewed: Product Screenshots (1.2k views).' },
  { title: 'Integrations', icon: '&#9096;', text: 'Connected: Slack, GitHub, Jira, Figma. Available: Trello, Notion, Linear, Asana.' },
  { title: 'Billing', icon: '&#941;', text: 'Current plan: Pro. Next billing date: Aug 1. Payment method: Visa ending 4242.' },
  { title: 'Support', icon: '&#9743;', text: 'Open tickets: 2. Average response time: 1.4 hours. Knowledge base articles: 156.' },
  { title: 'Logs', icon: '&#9783;', text: 'Last 24h: 1,247 events logged. 3 warnings, 0 errors. System uptime: 99.97%.' },
  { title: 'Export', icon: '&#10149;', text: 'Export your data as CSV, JSON, or PDF. Last export: July 20. Schedule automatic weekly exports.' }
];

function getTabContent(tabIndex) {
  if(tabIndex < tabContents.length){
    return tabContents[tabIndex];
  }
  return { title: 'Tab ' + (tabIndex + 1), icon: '&#9672;', text: 'Content for tab ' + (tabIndex + 1) + '.' };
}

function selectTab(tabDom) {
  var tabIndex = parseInt(tabDom.attr('data-index'));

  $('.circular-tab').removeClass('active');
  tabDom.addClass('active');
  activeTab = tabDom;

  var content = getTabContent(tabIndex);
  var $tabContent = $('#tabContent');

  $tabContent.removeClass('visible');
  setTimeout(function(){
    $tabContent.html(
      '<div class="tab-content-icon">' + content.icon + '</div>' +
      '<div class="tab-content-title">' + content.title + '</div>' +
      '<div class="tab-content-text">' + content.text + '</div>'
    );
    $tabContent.addClass('visible');
  }, 150);
}

function rotateAnnotationCropper(offsetSelector, xCoordinate, yCoordinate, cropper)
{
  var x = xCoordinate - offsetSelector.offset().left - offsetSelector.width()/2;
  var y = -1*(yCoordinate - offsetSelector.offset().top - offsetSelector.height()/2);
  var theta = Math.atan2(y,x)*(180/Math.PI);
  var cssDegs = convertThetaToCssDegs(theta);
  var moveable = cropper.attr('data-moveable');
  var tabIndex = cropper.attr('data-index');

  hasDragged = true;

  if(moveable != false && tabs.length > 1){
    // check if we need to switch tabIndex
    var swapTab = getTabIndexOfDegree(cssDegs);

    if(swapTab !== false)
    {
      // get copy of swap tab
      var swapTabIndex = swapTab.attr('data-index');
      var swapTabDegree = swapTab.attr('data-degree');

      // adjust rotation of swap tab
      rotateTab(swapTab, cropper.attr('data-degree'));

      // swap values of tabs
      swapTab.attr('data-degree', cropper.attr('data-degree'));
      cropper.attr('data-degree', swapTabDegree);
      swapTab.attr('data-index', cropper.attr('data-index'));
      cropper.attr('data-index', swapTabIndex);

      tabIndex = swapTabIndex;
    }

    rotateTab(draggedTab, cssDegs);
  }
}

function getTabIndexOfDegree(degree){
  console.log(degree);
  var allTabs = $(".circular-tab");
  for(var i=0; i < allTabs.length; i++){
    var element = allTabs[i];
    var tabDegree = $(element).attr('data-degree');
    if(degree > (parseInt(tabDegree) - 4) && degree < (parseInt(tabDegree) + 4) &&
       $(element).attr('data-degree') !== draggedTab.attr('data-degree')){
      return $(element);
    }
  }

  return false;
}

function rotateTab(tab, cssDegs){
  var rotate = 'rotate(' + cssDegs + 'deg)';
  tab.css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
}

function convertThetaToCssDegs(theta){
  var cssDegs = 90 - theta;
  return cssDegs;
}

function addTab(){
  if(tabs.length < maxTabNum){
    var tabIndex = tabs.length;
    tabs.push({index: tabIndex, lbl: tabIndex + 1, degree: (tabIndex + 1) * 15});
    var newTab = tabs[tabs.length - 1];
    createTabView(newTab);
    selectTab($('.circular-tab[data-index="' + newTab.index + '"]'));
  }

  if(tabs.length == maxTabNum){
    $('#marker').hide();
  }
}

function createTabView(newTab){
  var tabDom = $('<div class="circular-tab animate" data-degree="' + newTab.degree + '" data-index="' + newTab.index + '"><span>' + newTab.lbl + '</span></div>');
  $('#circular-tabs').append(tabDom);

  rotateTab(tabDom, newTab.degree);

  $(tabDom).on('mousedown', function(event){
    hasDragged = false;
    draggedTab = $(event.target.offsetParent);
    draggedTab.removeClass('animate');
    draggedTab.addClass('selected');
    draggedTab.css("z-index", maxTabNum);
    $('body').on('mouseup', function(event){
      $('body').unbind('mousemove');
      $('body').unbind('mouseup');
      // snap tab to center position of it's index
      rotateTab(draggedTab, draggedTab.attr('data-degree'));
      draggedTab.addClass('animate');
      draggedTab.removeClass('selected');
      draggedTab.css("z-index", draggedTab.attr('data-index'));
      if(!hasDragged){
        selectTab(draggedTab);
      }
    });
    $('body').on('mousemove', function(event){
      rotateAnnotationCropper($('#innerCircle').parent(), event.pageX,event.pageY, $(tabDom));
    });
  });
}

$(document).ready(function(){

});