//initial variables
var dataRef = new Firebase("https://trainschedule2437.firebaseio.com/");

var name;
var destination;
var frequency;
var firstTrainTime;

//======================================

function addTrain(){
	$("#addTrain").on('click', function(){
		var time = $("#time-input").val().trim().split(":");
		var hours = time[0];
		var minutes = time[1];
		name = $("#name-input").val().trim();
		destination = $("#destination-input").val().trim();
		frequency = $("#frequency-input").val().trim();
		firstTrainTime = moment({hours: hours, minutes:minutes}).format("hh:mm");
		//send data to Firebase
		dataRef.push({
			trainName: name,
			destination: destination,
			frequency: frequency,
			firstTime: firstTrainTime,
			dateAdded: Firebase.ServerValue.TIMESTAMP
		})
		//clear form after entry
		$(".form-control").val("");
		//perhibit page from refreshing
		return false;
	})
}

function myInterval(frequency, firstTrainTime, counter){

		var difference = moment().diff(moment(firstTrainTime, "hh:mm"), "minutes");
		var x = difference % frequency;
		var minutesAway = frequency - x;
		var nextArrival = moment().add(minutesAway, "minutes");

		return {
			next: nextArrival.format("hh:mm"), 
			away: minutesAway, 
			counter: counter
		};

}
//=======================================


	

//=======================================

$(document).ready(function(){
	var counter = 0;
	var newTime = {};
	addTrain();
	dataRef.on("child_added", function(childSnapshot){
		var name = childSnapshot.val().trainName;
		var destination = childSnapshot.val().destination;
		var frequency = childSnapshot.val().frequency;
		var firstTrainTime = childSnapshot.val().firstTime;

		newTime = myInterval(frequency, firstTrainTime, counter);

		$("#trainTable > tbody").append('<tr id=train-'+counter+'><td>' + 
			name +'</td><td>' + 
			destination + '</td><td>' + 
			frequency + '</td><td data-first-time=' + firstTrainTime + '>' +
			newTime.next + '</td><td>' +
			newTime.away + '</td></tr>');

		counter++;

	});

	setInterval(function(){
		console.log('hi');

		for(var i = 0; i < $("#trainTable > tbody").children.length; i++){
			var frequency = $($("#train-"+i)[0].children[2]).text();
			var firstTime = $($("#train-"+i)[0].children[3]).data('first-time');
			var myRowForNext = $("#train-"+i)[0].children[3];
			var myRowForAway= $("#train-"+i)[0].children[4];

			console.log(frequency, firstTime, counter);
			newTime =  myInterval(frequency, firstTime, counter);

			console.log(newTime);

			$(myRowForNext).html(newTime.next);
			$(myRowForAway).html(newTime.away);
		}
	}, 1000);
});
