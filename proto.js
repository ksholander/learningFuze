  // declare some global variables
  // these will be ccessible to all of the functions
  var jsonData;    // the data read from the json file
  var editor;      // handle for the ace editor object
  var lines;       // the lines that are displayed for matching

  // load the JSON data
  $.getJSON("sequence_sample.json",function(data) {
    // once the data is loaded, build the menus
      jsonData = data;
      buildSequenceMenu();
  });

  // build a drop down listing all of the sequences
  function buildSequenceMenu() {
    // build a string holding the html for the select menu
    var dropdown = "<select>\n";
    dropdown+="<option id='-1' value='-1'>Select a sequence</option>\n";
    for (var i=0; i < jsonData[0].sequences.length; i++) {
      dropdown += "<option id='"+jsonData[0].sequences[i].id+"' value='"+i+"'>"+jsonData[0].sequences[i].name+"</option>\n";
    }
    dropdown += "</select>\n";

    // modify the dom to display the values and menus that have been read
    $("#headerTitle").html(jsonData[0].name);
    $("#dropdown").html(dropdown);

    // use a callback to rebuild the task menu whenever the sequence is selected
    $("#dropdown").change(buildTaskMenu);
  }

  // build the task menu that goes with the selected sequence
  function buildTaskMenu() {
    // figure out which sequence is selected
    var item = $("#dropdown option:selected").attr("value");

    // now build the submenu
    var submenu = "";
    if (item != -1) {
      // extract each task from the json data
      for (var i = 0; i < jsonData[0].sequences[item].tasks.length; i++) {
        seqData=jsonData[0].sequences[item].tasks[i];
        submenu += "<div><a class='task' href='#' seq='"+item+"' task='"+i+"' type='"+seqData.options.type+"'>"+seqData.name+"</a></div>\n";
      }
    }
    $("#submenu").html(submenu);

    // define a callback to handle when a task is selected
    $(".task").click(loadTask);
  }

  // what happens when a task item is selected from the list
  function loadTask() {
    $this = $(this);

    // determine the type of the task
    switch ($this.attr("type")) {
      case "info" : $("#INFO").html(jsonData[0].sequences[$this.attr("seq")].tasks[$this.attr("task")].lines);
                    break;
      case "code" : lines = jsonData[0].sequences[$this.attr("seq")].tasks[$this.attr("task")].lines;
                    lineNum = 0;
                    $("#INFO").html("<div class='unmatched'>"+lines[0] +"</div>");
                    editor.setValue("");
                    break;

    }
  }

  // once the document has finished loading
  $(document).ready(function() {
    // start up the ace editor
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");

    // create a callback to watch the changes in the editor
    editor.getSession().on('change',function(e) {
      // get the lines that have been typed in the editor
      var typedLines = editor.getValue();

      // if there are no typed lines then just exit
      if (typedLines == "") {
        return;
      }

      // the json lines were input with escaped char codes.
      // need to escape the charcodes in the typed lines before
      // being able to do a compare between the typed lines and json lines
      typedLines = typedLines.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#'+i.charCodeAt(0)+';';
      });

      // split the typed lines into an array of strings
      typedLines = typedLines.split("\n");

      // build up an html string for the INFO box
      var outputLines = "";

      // step through each of the typed lines and compare to the expected
      for (var j=0; j<typedLines.length; j++) {
        // don't search beyond the end of the json lines
        if (j <= lines.length) {
          if (typedLines[j].localeCompare(lines[j]) == 0) {
            // line matched
            outputLines += "<div class='matched'>"+lines[j]+"</div>";
          } else {
            // line didn't match
            outputLines += "<div class='unmatched'>"+lines[j]+"</div>";
            // once an unmatched line is detected, stop stepping
            j = typedLines.length;
          }
        }
      }

      // now replace the INFO box with the newly built html string
      $("#INFO").html(outputLines);
      return;

    });

  });
