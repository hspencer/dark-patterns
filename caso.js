/**
 *  
 *  dark patterns importer
 * 
 */


let queryUrl, data;
let casos = [];
let sel;

// Función preload() de p5.js que se ejecuta antes de setup().
// Se utiliza para cargar recursos externos, en este caso, datos JSON.
function preload() {
    queryUrl =
        "https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3ACaso%20de%20Estudio%5D%5D%5B%5BPalabras%20Clave%3A%3Adark%5D%5D%7C%3FNombre%7C%3FDescripci%C3%B3n%7C%3FURL%7C%3FImgPath&utf8=1"
    data = loadJSON(queryUrl, gotData, "jsonp"); // Cargar datos JSON. Cuando esté listo, se llamará a gotData().
}

// Función que se llama después de cargar el JSON.
function gotData() {
    console.log(data); // Mostrar los datos en la consola para depuración.
    constructObjects(); // Construir los objetos HTML a partir de los datos JSON.
    constructSelector();
}


function constructObjects() {
    for (let key in data.query.results) {
        let caso = data.query.results[key];
        let casiopeaUrl = caso.fullurl;
        let name = caso.printouts["Nombre"]?.join(", ") ?? "Este caso no tiene ingresado un nombre en el formulario";
        let desc = caso.printouts["Descripción"]?.join(", ") ?? "No hay una descripción disponible ingresada en el formulario";
        let img = caso.printouts["ImgPath"]?.join(", ") ?? "https://loremflickr.com/640/360";
        let id = toCanonical(name);
        let casoNuevo = new Caso(name, desc, img, id, casiopeaUrl);
        casos.push(casoNuevo);
    }
}

function constructSelector(){
    sel = createSelect();
    sel.option("Selecciona un patrón oscuro");
    for (let caso of casos) {
        sel.option(caso.name, "caso.html?id=" + caso.id);
    }
    sel.parent('nav');
    sel.changed(goToURL); // Aquí estaba el error de comentario
}

function setup() {
    noCanvas();
    let singleName = getQueryParam('id');
    if (singleName) {
        showSingle(singleName);
        //alert(singleName);
    }
}

function goToURL(){
    // Obtiene el valor de la opción seleccionada
    const selectedUrl = sel.value();

    // Si el valor no está vacío, redirige
    if (selectedUrl) {
        window.location.href = selectedUrl;
    }
}

class Caso {
    constructor(name, desc, img, id, casiopeaURL){
      this.name = name;
      this.desc = desc;
      this.img = img;
      this.casiopeaURL = casiopeaURL;
      this.id = id;
    }

    display() {
        let htmlTitle = document.getElementById('title');
        htmlTitle.innerHTML = this.name;

        let singleContainer = createDiv(
            "<img src='"+this.img+"' title='"+this.name+"' />"+
            "<div class='desc'>"+this.desc+"<br><a href='"+this.casiopeaURL+"' >link a Casiopea</a></div>"
        );
        
        // se le asigna la clase 'single' al elemento contenedor
        singleContainer.class('single');

        // define la ubicación en el documento html
        singleContainer.parent('main');
    }
}


function getQueryParam(param) {
  // Obtiene los parámetros de la URL y busca el que corresponde a 'param'.
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function showSingle(id){
  for(caso of casos){
    if(caso.id === id){
      caso.display();
      //sel.value(id);
    }
    
  }
}

// función para convertir nombres a 'permalinks'
function toCanonical(name) {
  // Convertir a minúsculas
  let canonical = name.toLowerCase();

  // Reemplazar letras acentuadas
  const accentMap = {
      á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u',
      ñ: 'n'
  };

  canonical = canonical.replace(/[áéíóúüñ]/g, match => accentMap[match]);

  // Reemplazar espacios con guiones
  canonical = canonical.replace(/\s+/g, '-');

  // Eliminar caracteres especiales no permitidos en URLs
  canonical = canonical.replace(/[^a-z0-9-]/g, '');

  return canonical;
}
