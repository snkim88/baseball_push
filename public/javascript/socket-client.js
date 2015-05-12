var socket = io.connect('http://localhost:3000');

socket.on('notification', function(data){
	console.log(data);
	$("#push_container").append(newEntry(data.date, data.gameScore, data.text));
});

function newEntry(date, gameScore, text){
	return "<div class='entry'><table>"
	+"<tr>"
	+"	<td>Date: " + date + "</td>"
	+" 	<td> " + gameScore + "</td>"
	+"</tr>"
	+"<tr>"
	+"	<td colspan='2'>" + text + "</td>"
	+"</tr>"
	+"</table></div>";
}