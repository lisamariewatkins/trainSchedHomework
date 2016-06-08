//initial variables
var dataRef = new Firebase("https://trainschedule2437.firebaseio.com/");

var name;
var destination;
var frequency;
var firstTrainTime;

//======================================

function addTrain(){
	$("#addTrain").on('click', function(){
		name = $("#name-input").val().trim();
		destination = $("#destination-input").val().trim();
		frequency = $("#frequency-input").val().trim();
		firstTrainTime = $("#time-input").val().trim();
		//send data to Firebase
		dataRef.push({
			trainName: name,
			destination: destination,
			frequency: frequency
		})
		//clear form after entry
		$(".form-control").val("");
		//perhibit page from refreshing
		return false;
	})
}

//=======================================

function pushData(){
	dataRef.on("child_added", function(childSnapshot){

		var trainName = childSnapshot.val().name;
		var trainDestination = childSnapshot.val().destination;
		var trainFrequency = childSnapshot.val().frequency;

		var difference = moment().diff(moment.unix("firstTrainTime"), "minutes")
		var x = difference%trainFrequency
		var minutesAway = trainFrequency - x
		var nextArrival = moment() + minutesAway

		var prettyNextArrival = nextArrival.format("HH:mm");

		$("#trainTable tbody:last-child").append('<tr><td>' + 
			trainName +'</td><td>' + 
			trainDestination + '</td><td>' + 
			trainFrequency + '</td><td>' +
			prettyNextArrival + '</td><td>' +
			minutesAway + '</td></tr>');
	});
}

//=======================================

$(document).ready(function(){
	addTrain();
	pushData();
});
