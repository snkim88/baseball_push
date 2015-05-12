var http = require('http');
var fs = require('fs');
var context = ['1','T', '0', '0', '0', '0'];
var success = 0;
var fail = 0;

process.on('message', function(msg) {
	if(msg == 'start'){
		while(true){			
			var token = parser();

			if ( compareTokenAndContext(token, context) ){
			   console.log("nothing changed....");
			} else {
				console.log("something happened");
				context = token; // change context
				console.log(context);
				
				outputText = analyze(context);
				
				if (outputText != null){
					pushYadong(outputText);
				}
			}
			
			success = 0;
			fail = 0;
			sleep(1000);
		}		
	}
});

function pushYadong(outputText) {
	var d = {};
	d["date"] = getCurrentDate();
	d["gameScore"] = "home "+context[2]+" : "+context[3]+" away";
	d["text"] = outputText;
	process.send(d);
}

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

function sleep(milliSeconds) {
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
}

function parser() {
	var data = fs.readFileSync('./data.txt', 'utf8');
	var arr = data.split("\n");
	
	return arr[arr.length-1].split(", ");
}

function compareTokenAndContext(token, context){
	if(token.length == context.length 
		&& token.every(function(u, i) {
		return u === context[i];
	})) {
		return true;
	} else {
		return false;
	}
}

function analyze(context){
	var outCounts = Number(context[4]);
	var baseCondition = Number(context[5]);
	var homeScore = Number(context[2]);
	var awayScore = Number(context[3]);
	var TorB = context[1];
	
	if ( TorB === 'T') {
		if (awayScore-homeScore<=0) {
			foo(outCounts, baseCondition, 1, homeScore-awayScore+1, 0);
		}
	} else {
		if (homeScore-awayScore<=0) {
			foo(outCounts, baseCondition, 1, awayScore-homeScore+1, 0);
		}
	}
	
		console.log(success);
	if (success>0.3){
		return "alert!!!"
	} else {
		return null;
	}
}

function foo(outCounts, baseCondition, percentage, successCondition, earnedScore){
	if(outCounts !== 3 && successCondition !== earnedScore) {
		//hit
		if( baseCondition >= 4 ){
			foo(outCounts, baseCondition*2-8+1, percentage*0.3, successCondition, earnedScore+1);
		} else {
			foo(outCounts, baseCondition*2+1, percentage*0.3, successCondition, earnedScore);
		}
		
		//out
		foo(outCounts+1, baseCondition, percentage*0.7, successCondition, earnedScore);
	} else {
		if ( outCounts === 3) {
			fail = fail + percentage;
		} else {
			success = success + percentage;
		}
	}
}