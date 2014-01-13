/**
 * Simple jQuery script to handle circular tabs.
 * @author Dirk Dresch <dirk.dresch@gmail.com>
 */

var tabs = new Array();
var maxTabNum = 23;
var draggedTab;

function rotateAnnotationCropper(offsetSelector, xCoordinate, yCoordinate, cropper)
{
  var x = xCoordinate - offsetSelector.offset().left - offsetSelector.width()/2;
  var y = -1*(yCoordinate - offsetSelector.offset().top - offsetSelector.height()/2);
  var theta = Math.atan2(y,x)*(180/Math.PI);        
  var cssDegs = convertThetaToCssDegs(theta);
  var moveable = cropper.attr('data-moveable');
  var tabIndex = cropper.attr('data-index');  

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
    createTabView(tabs[tabs.length - 1]);
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
    });
    $('body').on('mousemove', function(event){
      rotateAnnotationCropper($('#innerCircle').parent(), event.pageX,event.pageY, $(tabDom));    
    });   
  });
}

$(document).ready(function(){
  
});