/**
 *  
 *  dark patterns importer
 * 
 */


let queryUrl, data;
let casos = [];

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
}

// Función setup() de p5.js que se ejecuta una vez al inicio.
function setup() {
    // No hay contenido aquí porque estamos construyendo los objetos en gotData().
}

function constructObjects() {
    // Recorrer cada resultado en data.query.results.
    for (let key in data.query.results) {
      let caso = data.query.results[key]; // 'asig' es una variable temporal que se renueva por cada nodo de data.query.results
  
      // Extraer datos relevantes del objeto actual.
      let casiopeaUrl = caso.fullurl; // link a la página en Casiopea
  
      // Verificar si existe la propiedad y si tiene elementos. De lo contrario, mostrar "No disponible".

      let name =
      caso.printouts["Nombre"] && caso.printouts["Nombre"].length > 0
        ? caso.printouts["Nombre"].join(", ")
        : "Este caso no tiene ingresado un nombre en el formulario";
      
      let desc =
        caso.printouts["Descripción"] && caso.printouts["Descripción"].length > 0
          ? caso.printouts["Descripción"].join(", ")
          : "No hay una descripción disponible ingresada en el formulario";
  
      let img =
        caso.printouts["ImgPath"] &&
        caso.printouts["ImgPath"].length > 0
          ? caso.printouts["ImgPath"].join(", ")
          : "https://loremflickr.com/640/360";
  
  
      // creo un Caso de acuerdo a la clase definida más abajo (el caso está vacío en este minuto)
      let casoNuevo = new Caso();
      
      // Ahora le asigno los calores que tengo copiados desde el JSON
      casoNuevo.name = name;
      casoNuevo.desc = desc;
      casoNuevo.img = img;
      casoNuevo.casiopeaURL = casiopeaUrl;

  
      // agrego la asignatura (temporal) al arreglo de asignaturas
      casos.push(casoNuevo);

      // lo registra en la consola para revisarlo con el inspector
      console.log(casoNuevo); 
  
      // le digo que la despliegue
      casoNuevo.display();
    }
  }

class Caso {
    constructor() {
        // inicializo el objeto con los atributos en blanco
        this.name = "";
        this.desc = "";
        this.img = "";
        this.casiopeaURL = "";
    }

    display() {

        let casoContainer = createDiv(
            "<a href='"+this.casiopeaURL+"' >"+
            "<img src='"+this.img+"' title='"+this.name+"' />"+
            "<div class ='overlay'>"+
            "<h4>"+this.name+"</h4>"+
            "<div class='desc'>"+this.desc+"</div></div></a>"
        );
        // se le asigna la clase 'caso' al elemento contenedor
        casoContainer.class('caso')
        // define la ubicación en el documento html
        casoContainer.parent('main');
    }
}