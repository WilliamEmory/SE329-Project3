<!-- 
/* 
 * @author Branden Sammons
 *
 * This file has the sole purpose of testing things in javascript.
 * The file will have some functions that test inputs and change elements to
 * show the results of those tests. This more or less will become a Junit testing
 * file for just javascript.
 *
 * Note: a <div> with the Id of Junit will be needed within the calling file.
 */
 
 
 var out = document.getElementById("Junit");
  
 function assertEquals(testname, failMessage, realOutput, expectedOutput) {
	 
	 var result = "";
	 
	 if (realOutput == expectedOutput) { // passed
		result += "<h3 style=\"background-color:green\">Test : " + testname + " Passed</h3>\n";
	 } 
	 
	 else { // failed
		result += "<h3 style=\"background-color:red\">Test : " + testname + " Failed</h3>\n";
		result += "<pre>" + failMessage + "\n";
		result += "Expected: " + expectedOutput;
		result += " Was: " + realOutput + "</pre>\n";
		result += "<br>\n"; // add some spacing
	 }
	 
	 out.innerHTML += "<div>" + result + "</div>"; // close the <div>
	 
	 
 }
// -->