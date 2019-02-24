//<script>
$(document).ready(function(){
  //actualiza los colores
  function updateColors(color){
    function rgb2hex(rgb) {
      rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      function hex(x) {
          return ("0" + parseInt(x).toString(16)).slice(-2);
      }
      return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
    $("body").css("background-color", color);

    var optos = $("#options").children('.opt');
    var conto = 0, m=0;
    for(var m=0; m<optos.length; m++){
      if(coloros[conto] == rgb2hex(color)) conto++;

      optos.eq(m).css("background-color", coloros[conto]);
      conto++;
    }
  }

  //crea las opciones del fondo
  var coloros = ["#71cac4", "#ffffa5", "#f49ebb", "#fbad4b", "#c472a0", "#edf7f6"];
  $("body").css("background-color", coloros[1]);

  var cont = 0;
  //append all colors
  for(var n = 0; n< coloros.length; n++){
    if(coloros[n] == coloros[1]) continue;

    var ele = $("<div class=opt></div>");
    ele.css({
      "background-color": coloros[n],
      "width": 100/(coloros.length-1) +"%",
      "left": 100*cont/(coloros.length-1) +"%"
    });
    cont++;
    ele.hover(function(){
      //mouse enter
      $(this).animate({height: "100%"});
    }, function(){
      //mouse leave
      $(this).animate({height: "33%"});
    });

    ele.click(function(){
      updateColors($(this).css("background-color"));
    });
    $("#options").append(ele);
  }

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

  //escribir ambas listas
  writeSidebarList('struct');
  writeSidebarList('stuff');

  //al terminar de editar cualquiera de las listas, actualizarlas
  $("ul").on('blur',function(){
    var where = $(this).attr('id');

    var nenes = [];
    var nanos = $(this).children("li");

    for(var n=0; n<nanos.length; n++){
      nenes.push(nanos.eq(n).text());
    }

    google.script.run.replaceList(where,nenes);
  });

  //al clicar en #refresh, actualizar listas
  $("#refresh").on("click",function(){
    updateSidebarList('struct');
    updateSidebarList('stuff');
  });
});
//</script>
