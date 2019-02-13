//<script>
$(document).ready(function(){

  //escribe la lista correspondiente
  function writeSidebarList(which){
    google.script.run.withSuccessHandler(function(list){
      for(var n=0; n<list.length; n++)
        $("#" + which).append('<li>' + list[n] + '</li>');
    })
      .readList(which);
  }

  //actualiza la lista correspondiente
  function updateSidebarList(which){
    //primero se vacía la lista
    $("#" + which).children().remove();
    //luego se re-escribe
    writeSidebarList(which);
  }

  writeSidebarList('struct');
  writeSidebarList('stuff');

  $("ul").on('blur',function(){
    var where = $(this).attr('id');

    var nenes = [];
    var nanos = $(this).children("li");

    for(var n=0; n<nanos.length; n++){
      nenes.push(nanos.eq(n).text());
    }

    google.script.run.replaceList(where,nenes);
  });

  $("#refresh").on("click",function(){
    updateSidebarList('struct');
    updateSidebarList('stuff');
  })
});
//</script>
