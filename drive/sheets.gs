// Enumerador para acceder a las distintas columnas
// NUM = 0, TEMA = 1... etc;
var Campo = {NUM: 1, TEMA: 2, SCRIPT: 3, LINK: 4, DATE: 5};
var doc = SpreadsheetApp.getActiveSpreadsheet();
var hoja = doc.getSheets()[0];

/**
 * Esta función se ejecuta al abrir el archivo. Oculta automáticamente filas
 * que correspondan a programas de hace más de un año. También añade filas si
 * estamos empezando a quedarnos sin.
 *
 * @param {object} e Parámetro de evento para un trigger onOpen.
 */
function onOpen(e) {
  //Ocultar filas que correspondan a programas de hace más de un año.

  //añadir el menú
  SpreadsheetApp.getUi().createMenu('El Aleph')
      .addItem('Crear guión', 'createScript')
      .addToUi();


  // Contar cuántas filas tienen datos y añadir más si hace falta de forma
  // que siempre haya 5 filas vacías.
  var extraRows = hoja.getMaxRows() - hoja.getLastRow();
  if (extraRows < 5) hoja.insertRows(hoja.getMaxRows(), (extraRows < 5)? (5-extraRows ):0);
}

/**
 * Duplica una carpeta, con sus archivos y subcarpetas.
 *
 * @param {Folder} source Carpeta que copiar.
 * @param {Folder} target Carpeta a la que copiar.
 */
function copyFolder(source, target) {

  var folders = source.getFolders();
  var files   = source.getFiles();

  while(files.hasNext()) {
    var file = files.next();
    file.makeCopy(file.getName(), target);
  }

  while(folders.hasNext()) {
    var subFolder = folders.next();
    var folderName = subFolder.getName();
    var targetFolder = target.createFolder(folderName);
    copyFolder(subFolder, targetFolder);
  }

}

/**
 * Crea un guión para un programa si éste aún no existe.
 * Si no se especifica qué programa, busca un tema del documento #AhSí
 */
function createScript(){
  var sel = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getCurrentCell();
  var scriptCell = hoja.getRange(sel.getRow(),Campo.SCRIPT);

  if(scriptCell.getValue() == ''){ //si la celda está vacía, crear archivo etc etc
    var tit = hoja.getRange(sel.getRow(),Campo.TEMA).getValue();
    var num = hoja.getRange(sel.getRow(),Campo.NUM).getValue();

    if(tit!='' && num != ''){
      //pillamos la carpeta plantilla y la duplicamos
      var temp = DriveApp.getFolderById('1LBCytpK9JIpuDIR1MvZYYeKyqqegDAYW');
      var targ = DriveApp.getFileById(doc.getId()).getParents().next().createFolder('Aleph-' + num);

      copyFolder(temp, targ);
      var scrip = targ.getFilesByName('script').next().setName('Aleph-' + num + ' | ' + tit);

      scriptCell.setValue(scrip.getUrl());
    }
  }
}
