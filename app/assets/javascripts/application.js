// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require turbolinks
//= require_tree .

// * we go to the creation page
// * it prompts us for the map title and description
// * when that's submitted, it goes to the server and creates a new map
// * when the map info comes back, we save the map id to the window

// * then we click on a div square to bring up a room creation form
// on click:
//   * the div changes to pending color
//   * a room creation form pops up
//   the javascript checks the four divs around the div you clicked on
//     for each div, if that div has an id, the javascript fills in the hidden room-creation form field corresponding
//       to that room (north_id, south_id, east_id, or west_id) with that div's id
//   we submit the form, and it goes to the server
//   the server makes a new room with the information we gave it
//   then, it finds the north/south/east/west rooms (if any) by the ids we gave and changes their south/north/west/east
//     ids to the id of the room we just created
//   then we return to the browser, change the color of the div to the "completed" color, and add an id to the div
//     that is the same as its corresponding room's id (aka the room we just made)
//   we hide the form and maybe do a confirmation msg?

//   def change_east_rooms
//     west.east_id = room.id
//   end

$(function(){
  $("#dialog-form").dialog({
    autoOpen: true,
    height: 350,
    width: 250,
    dialogClass: 'no-close',
    modal: true,
    buttons: {
      "Submit": function() {
        var data = $('#new_map').serialize();
        var url = $('#new_map').attr('action');
        window.userId = $('#map_creator_id').val();
        $.ajax({
          type: 'post',
          url: url,
          data: data,
          success: function(serverResponse) {
            console.log(serverResponse);
            window.mapId = serverResponse.map_id;
            $('#dialog-form').dialog("close");
          }
        })
      },
      Cancel: function() {
        window.location.href = "/users/" + window.userId;
      }
    },
  });

$(".clickable").on("click", function(){
  $('.grid-cell').each(function(){
    console.log(this);
    if($(this).css('background-color') == 'blue') {
      console.log('hey I am blue!')
    }
  });
  $(this).css("background", "blue");
  // save which div we clicked on here
  // unbind this from div clicks (remove class clickable)
  // search for neighbors
  $("#room-form-container").empty();
  $("#room-form-container").append("<form id='room-form' action='/users/" + window.userId + "/maps/" + window.mapId + "/rooms' method='POST'><input type='text' placeholder='Room Name' name='title'><textarea form='room-form' name='description' placeholder='Room Description'></textarea><input type='hidden' name='map_id' value=" + window.mapId + "><input type='submit' value='Add Room'></form>");
})

  $(document).on("submit", "#room-form", function(){
    event.preventDefault();
    var url = $('#room-form').attr('action');
    var data = $('#room-form').serialize();
    $.ajax({
      url: url,
      type: "POST",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      data: data,
      success: function(response){
        // reference back to that same div--change its ID to the ID of the room we created
        //  and change its color
        //  re-bind div click thing
        $("#room-form-container").empty();
        console.log("yay we got a response!");
        console.log(response);
      }
    });
  });
});

// style="background-color: blue; background-position: initial initial; background-repeat: initial initial;"

