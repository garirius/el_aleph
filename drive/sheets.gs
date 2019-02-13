// Enumerador para acceder a las distintas columnas
// NUM = 0, TEMA = 1... etc;
var Campo = {NUM: 0, TEMA: 1, SCRIPT: 2, LINK: 3, DATE: 4};

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

  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  // Contar cuántas filas tienen datos y añadir más si hace falta de forma
  // que siempre haya 5 filas vacías.
  var extraRows = hoja.getMaxRows() - hoja.getLastRow();
  if (extraRows < 5) hoja.insertRows(hoja.getMaxRows(), (extraRows < 5)? (5-extraRows ):0);
}

/**
 * Crea un guión para un programa si éste aún no existe.
 * Si no se especifica qué programa, busca un tema del documento #AhSí
 */
function createScript(){

}
