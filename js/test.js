$(function() {
	getTime();
	setInterval(getTime, 1000);
	function getTime() {
		var time = new Date();
		$('#time').text(time.getFullYear()+'-'+(time.getMonth() + 1)+'-'+time.getDate() + ' ' + time.getHours()+':'+time.getMinutes()+':'+time.getSeconds());
	}
});