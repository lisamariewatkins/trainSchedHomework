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
		firstTrainTime = moment($("#time-input").val().trim(), "HH:mm").format("X");
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

		var trainName = childSnapshot.val().trainName;
		var trainDestination = childSnapshot.val().destination;
		var trainFrequency = childSnapshot.val().frequency;

		var difference = moment().diff(moment.unix("firstTrainTime"), "minutes")
		console.log(difference);
		var x = difference%trainFrequency
		console.log(x);
		var minutesAway = trainFrequency - x
		console.log(minutesAway)
		var nextArrival = moment() + minutesAway
		console.log(nextArrival);

		var prettyNextArrival = moment(nextArrival, "HH:mm");

		$("#trainTable > tbody").append('<tr><td>' + 
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
