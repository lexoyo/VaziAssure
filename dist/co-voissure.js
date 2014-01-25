
window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    // alert("Error occured: " + errorMsg);//or any message
    return false;
}
$(function() {
console.log('2');
    var count = 0;
    $("form").submit(function (e) {
	  e.preventDefault();
	  return false;
    });
    $("a").click(function(e) {
	e.preventDefault();
	console.log('count', count);
	count++;
	if(count===10){
	    alert('WTF you think you\'re doing?! Stop it.')
	}
	else if(count===5){
	    alert('Don\'t do that. Links are not active')
	}
	else if(count===2){
	    alert('This is a demo site, links are not active.')
	}
	return false;
    });
    $("a").each(function(e) {
	console.log(this.href);
	this.setAttribute('href', '#');
    });
});
