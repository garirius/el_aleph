//VARIABLES GLOBALES
var doc = DocumentApp.getActiveDocument(); //documento
var Marks = { // ID de los marcadores
  STRUCT: 'id.bfk03wto1mc6',
  SCRIPT: 'id.rhmmz56y773z',
  STUFF: 'id.zf0ghkx0r065'
}
var boks = doc.getBookmarks();
var Estilos = {}

/**
 * Esta función se ejecuta al abrir el archivo. Arregla automáticamente
 * el formato de los guiones y crea el menú para lanzar el Borges Sidebar.
 *
 * @param {object} e Parámetro de evento para un trigger onOpen.
 */
function onOpen(e) {
  //Reformatear texto
  fixFormat();

  //añadir el menú
  DocumentApp.getUi().createMenu('El Aleph')
      .addItem('Borges Sidebar', 'launchBorges')
      .addItem('Repintar', 'fixFormat')
      .addSeparator()
      .addItem('Insertar cuña', 'randomAleph')
      .addItem('Insertar alefismo', 'randomAlefismo')
      .addToUi();

}
/**
 * Inicializa las variables de estilo
 */
function initStyle(){
  var family = 'Quattrocento Sans', size = 14, spacey = 1.15;

  function jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
  }

  //estilo base
  Estilos.BASE = {};
  Estilos.BASE[DocumentApp.Attribute.FONT_SIZE] = size;
  Estilos.BASE[DocumentApp.Attribute.FONT_FAMILY] = family;
  Estilos.BASE[DocumentApp.Attribute.LINE_SPACING] = spacey;
  Estilos.BASE[DocumentApp.Attribute.ITALIC] = false;
  Estilos.BASE[DocumentApp.Attribute.BOLD] = false;
  Estilos.BASE[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';

  //Estilo negrita
  Estilos.BOLD = jsonCopy(Estilos.BASE);
  Estilos.BOLD[DocumentApp.Attribute.BOLD] = true;

  //Estilo acotar display
  Estilos.ACOTAR_DISPLAY = jsonCopy(Estilos.BASE);
  Estilos.ACOTAR_DISPLAY[DocumentApp.Attribute.ITALIC] = true;
  Estilos.ACOTAR_DISPLAY[DocumentApp.Attribute.BOLD] = true;
  Estilos.ACOTAR_DISPLAY[DocumentApp.Attribute.FOREGROUND_COLOR] = '#FF0000';

  //Estilo acotar inline
  Estilos.ACOTAR_INLINE = jsonCopy(Estilos.ACOTAR_DISPLAY);
  Estilos.ACOTAR_INLINE[DocumentApp.Attribute.FONT_SIZE] = size - 2;
  Estilos.ACOTAR_INLINE[DocumentApp.Attribute.FOREGROUND_COLOR] = '#4a86e8';

  //Estilo tramo
  Estilos.TRAMO = jsonCopy(Estilos.ACOTAR_DISPLAY);
  Estilos.TRAMO[DocumentApp.Attribute.FOREGROUND_COLOR] = '#e69138';
}

/**
 * Arregla el formato: añade negritas, cursivas y demás formatos según el guión.
 */
function fixFormat(){
  initStyle();
  //accedemos al marcador del guión
  var bok = getMark('script');
  if(bok == null) return null;

  var daddy = bok.getPosition().getElement().getParent();
  var pars = doc.newRange().addElementsBetween(bok.getPosition().getElement(),  daddy.getChild(daddy.getNumChildren()-1)).getRangeElements();

  //vamos recorriendo elementos a partir del marcador
  //y, si son un párrafo, los tratamos
  for(var n = 1; n < pars.length; n++){
    var elm = pars[n].getElement();
    if(elm.getType() === DocumentApp.ElementType.PARAGRAPH){
      //Comprobar es un párrafo describiendo una acotación o una acción
      if(elm.getText()[0] == '(' || elm.getText()[0] == '['){
        elm.setAttributes(Estilos.ACOTAR_DISPLAY);
      } else if(elm.getText().indexOf('TRAMO') >= 0){ //si incluye la palabra tramo
        elm.setAttributes(Estilos.TRAMO);
      } else { //si no, es un párrafo normal y tenemos que tratarlo como tal
        // Saltar cualquier cosa que no sea un texto
        if (elm.editAsText) {
          var text = elm.editAsText();
          var colPos = text.getText().indexOf(':');
          if(colPos >= 0){ //si encuentra unos primeros dos puntos, pone en negrita
            text.setAttributes(0,colPos,Estilos.BOLD);
          }

          //buscamos una apertura de paréntesis
          var brapos = text.getText().indexOf('(');
          while(brapos >= 0){ //si la hay, buscamos su correspondiente
            var depth = 1;
            for (var i = brapos + 1; i < text.getText().length; i++) {
              switch (text.getText()[i]) {
              case '(': //si se abre un paréntesis nuevo hay que tenerlo en cuenta
                depth++;
                break;
              case ')':
                if (--depth == 0) {
                  text.setAttributes(brapos, i, Estilos.ACOTAR_INLINE);
                  brapos = text.getText().indexOf('(', i);
                  break;
                }
                break;
              }
            }
            break;    // No matching closing parenthesis
          }
        }
      }
    }
  }
}

//permite incluir varias páginas en un solo documento HTML
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Lanza el Borges Sidebar.
 */
function launchBorges(){
  var html = HtmlService.createTemplateFromFile('borgessidebar.html')
      .evaluate()
      .setTitle('Borges Sidebar')
      .setWidth(300);

  //launch sidebar
  DocumentApp.getUi().showSidebar(html);
}

/**
 * Devuelve un marcador con id STRUCT, STUFF o SCRIPT.
 *
 * @param {String} which Qué marcador devolver
 * @return {Bookmark|Null} El marcador en cuestión ó null si no.
 */
 function getMark(which){
   which = which.toLowerCase();
   switch (which) {
     case 'struct':
      return doc.getBookmark(Marks.STRUCT);
      break;
     case 'stuff':
      return doc.getBookmark(Marks.STUFF);
      break;
     case 'script':
      return doc.getBookmark(Marks.SCRIPT);
      break;
     default:
      return null;
   }
 }

/**
 * Lee lo que hay en ESTRUCTURA o en COSAS A TENER EN CUENTA.
 *
 * @param {String} where Qué lista leer. 'struct' si leer la estructura, 'stuff' si cosas a tener en cuenta
 * @return {String[]}
 */
 function readList(where){
   //sacamos el marcador que nos interesa
   var bok = getMark(where);
   if(bok == null) return [];

   var daddy = bok.getPosition().getElement().getParent();
   var foundList = false;
   var listEls = [];
   //vamos recorriendo elementos a partir del marcador
   //y almacenamos todos los ListElements contiguos
   for(var n = daddy.getChildIndex(bok.getPosition().getElement()); n < daddy.getNumChildren(); n++){
     elm = doc.getBody().getChild(n);
     if(elm.getType() === DocumentApp.ElementType.LIST_ITEM){
       foundList = true;
     } else if(foundList) break;

     if(foundList){
       listEls.push(elm.getText());
     }
   }
   return listEls;
 }

 /**
  * Actualiza lo que hay en ESTRUCTURA o en COSAS A TENER EN CUENTA.
  *
  * @param {String} where Qué lista leer. 'struct' si leer la estructura, 'stuff' si cosas a tener en cuenta
  * @param {String[]} what Qué poner en la lista.
  */
  function replaceList(where, what){
    //sacamos el marcador que nos interesa
    var bok = getMark(where);
    var daddy = bok.getPosition().getElement().getParent();

    //vamos recorriendo elementos a partir del marcador buscando la lista
    var rango = doc.newRange();
    var foundList = false;
    var fromElm;
    for(var n = daddy.getChildIndex(bok.getPosition().getElement()); n < daddy.getNumChildren(); n++){
      elm = doc.getBody().getChild(n);
      if(elm.getType() === DocumentApp.ElementType.LIST_ITEM){
        if(!foundList){
          foundList = true;
          fromElm = elm;
        }
      } else if(foundList) break;
    }
    var pos = n; //guardamos esta posición
    elm = doc.getBody().getChild(n-1);
    var stilus = elm.getAttributes();

    //borra la lista
    var els = rango.addElementsBetween(fromElm,elm).build().getRangeElements();
    for(var n=0; n<els.length; n++){
      els[n].getElement().removeFromParent();
    }

    //crear nueva lista
    pos = daddy.getChildIndex(bok.getPosition().getElement()) + 1;
    for(var n=0; n<what.length; n++){
      var elm = daddy.insertListItem(pos+n, what[n]);
      elm.setAttributes(stilus);
    }
  }

/**
 * Coge todos los elementos entre dos bookmarks
 *
 * @param {File} docu El documento donde buscar
 * @param {String} bookmarkID ID del marcador
 * @return {Element[]} Los elementos en cuestoión.
 */
 function getElementsAfter(docu,bookmarkID){
   var boks = docu.getBookmarks();
   boks.sort(function(a,b){
     a = a.getPosition().getElement();
     b = b.getPosition().getElement();
     var daddy = a.getParent();
     return daddy.getChildIndex(a)-daddy.getChildIndex(b);
   });

   var bokInd = -1;
   for(var n=0; n<boks.length; n++){
     if(boks[n].getId() == bookmarkID){
       bokInd = n;
       break;
     }
   }
   if(bokInd < 0) return [];
   var elmos = docu.newRange().addElementsBetween(boks[bokInd].getPosition().getElement(),(bokInd < boks.length-1)? boks[bokInd+1].getPosition().getElement():docu.getBody().getChild(docu.getBody().getNumChildren()-1)).getRangeElements();

   elmos = elmos.slice(1,-1);
   for(var n=0; n<elmos.length; n++){
     elmos[n] = elmos[n].getElement().getText();
   }

   elmos = elmos.filter(function(elm){
     return elm != '';
   });

   return elmos;
 }

/**
 * Inserta una cuña aleatoria.
 */
function randomAleph(){
  var ahsi = DocumentApp.openById('1cUm_Kmd6ULOp_yiNe-Aftr_kwFR1xT9Cv3N4t9iuevY');
  var breves = 'id.ezgwq4xugfp3';
  var poses = getElementsAfter(ahsi, breves);
  var curs =  doc.getCursor();
  if(curs != null){
    curs.insertText(poses[Math.floor(Math.random()*poses.length)]);
  }
}

/**
 * Inserta un alefismo aleatorio
 */
function randomAlefismo(){
  var ahsi = DocumentApp.openById('1cUm_Kmd6ULOp_yiNe-Aftr_kwFR1xT9Cv3N4t9iuevY');
  var alefismo = 'id.nptwwa8elx22';
  var poses = getElementsAfter(ahsi, alefismo);
  var curs =  doc.getCursor();
  if(curs != null){
    curs.insertText(poses[Math.floor(Math.random()*poses.length)]);
  }

}
