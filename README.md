# learningFuze
prototype test for learningFuze interview

JAVASCRIPT TEST:
 
Given the JSON: https://gist.githubusercontent.com/thireven/841b585de43a7d708bff/raw/abe8f8ceacff3817fb3ee5bf8219408819563629/sequence_sample.json
 
And using ACE editor: http://ace.c9.io
 
Objective: Build an application where the contents of the JSON is validated against the user's input in the ACE editor with visual feedback when the two values don't match.
 
Breakdown:
1. Load the JSON - it contains an array of "sequences" with n-number of "tasks" in them
2. Generate a menu for each Sequence and Task so that when the user clicks on a task, the contents for that task are loaded into the page.
3. Load the contents of the task based on its type:
3a. type: code
Display the first item in the "lines" array in the INFO container and don't show the user the next line until what they typed don't validate. Any lines that doesn't pass validation should be colored red. If the line does pass validation, it should be colored green. Validation in this case means exact match between what's shown from the "lines" array and what the user has typed in.
3b. type: info
"lines" here is just a string. Display it in the INFO container.
4. Once the user reaches the end of a code type or info type, pressing ENTER will load up the next task within the sequence (don't worry about it going out of bounds on the last task)
 
 
Upload code to a repository (for instance, Github or Bitbucket) and share it with thi.nguyen@learningfuze.com
 
