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
      .addItem('Insertar cuña', 'randomAleph')
      .addToUi();

  launchBorges(); //lanzar el borges sidebar
}

/**
 * Arregla el formato: añade negritas, cursivas y demás formatos según el guión.
 */
function fixFormat(){
  //
}

/**
 * Lanza el Borges Sidebar.
 */
function launchBorges(){

}

/**
 * Inserta una cuña aleatoria.
 */
function randomAleph(){

}
