var nodepccc = require('nodepccc');
var conn = new nodepccc;
var doneReading = false;
var doneWriting = false;

conn.initiateConnection({port: 44818, host: '192.168.1.14' /* , routing: [0x01,0x00,0x01,0x00] */}, connected);
// Either uncomment the routing or uncomment this next line for ControlLogix/CompactLogix or if otherwise using routing	
// First 0x01, 0x00 = 1 word in the path, second 0x01, 0x00 = Port 0x01 (backplane port of Ethernet module), 0x00 = PLC is in slot 0 in chassis.   

function connected(err) {
	if (typeof(err) !== "undefined") {
		// We have an error.  Maybe the PLC is not reachable.  
		console.log(err);
		process.exit();
	}
	conn.setTranslationCB(tagLookup);
	// conn.addItems(['TEST1', 'TEST4']);
	conn.addItems('2180LSH0501');
//	conn.removeItems(['TEST2', 'TEST3']);  // Demo of "removeItems".  
//	conn.writeItems(['TEST5', 'TEST6'], [ 867.5309, 9 ], valuesWritten);  // You can write an array of items like this if you want.  
	// conn.writeItems('TEST7', [ 666, 777 ], valuesWritten);  // You can write a single array item too.  
	conn.readAllItems(valuesReady);	
}

function valuesReady(anythingBad, values) {
	if (anythingBad) { console.log("SOMETHING WENT WRONG READING VALUES!!!!"); }
	console.log(values);
// alternative syntax		console.log("Value is " + conn.findItem('TEST1').value + " quality is " + conn.findItem('TEST1').quality);
	doneReading = true;
	if (doneWriting) { process.exit(); }
}

function valuesWritten(anythingBad) {
	if (anythingBad) { console.log("SOMETHING WENT WRONG WRITING VALUES!!!!"); }
	console.log("Done writing.");
	doneWriting = true;
	if (doneReading) { process.exit(); }
}

// This is a very simple "tag lookup" callback function that would eventually be replaced with either a database findOne(), or a large array in memory.  
// Note that the return value is a controller absolute address and datatype specifier.  
// If you want to use absolute addresses only, you can do that too.  
function tagLookup(tag) {
	switch (tag) {

	case '2180LSH0501':
		return 'B3:0/0';			// Bit

	default:
		return undefined;
	}
}