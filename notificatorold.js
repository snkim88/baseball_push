var http = require('http');

process.on('message', function(msg) {
	if(msg == 'start'){
		for(var i=0; i<10; i++){
			var request = http.request('http://sportsdata.naver.com/ndata//kbo/2015/04/20150410HHLT0.nsd', function (res) {
				console.log("dlkfnasdlk");
				var data = '';
				res.on('data', function (chunk) {
					data += chunk;
				});
				res.on('end', function () {
					//console.log(data);
					var d = {};
					d["date"] = getCurrentDate();
					d["gametime"] = "20 Minutes";
					d["text"] = "some sample text";
					process.send(d);
				});
			});
			request.on('error', function (e) {
					console.log(e.message);
			});
			request.end();
		}
	}
});

function getCurrentDate(){
	var today = new Date();
	var d = today.getDate();
	var m = today.getMonth()+1;
	var y = today.getFullYear();
	
	if(d<10)
		d='0'+d;

	if(m<10)
		m='0'+m 

	return y+"-"+m+"-"+d;
}