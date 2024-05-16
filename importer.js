/**
 * dark patterns - taller de diseño de interacción e[ad] 2024
 * Este código está diseñado para cargar y mostrar casos de estudio sobre patrones oscuros en diseño de interacción desde una API.
 */

// URL de la API para obtener los casos de estudio específicos sobre patrones oscuros.
let queryUrl =
  "https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3ACaso%20de%20Estudio%5D%5D%5B%5BPalabras%20Clave%3A%3Adark%5D%5D%20%7C%3FNombre%20%7C%3FURL%20%7C%3FDescripci%C3%B3n%20Corta%20%7C%3FDescripci%C3%B3n%20%7C%3FPalabras%20Clave%20%7C%3FImgPath%20%7C%3FImgPaths";
let data; // Variable para almacenar los datos obtenidos de la API.
let casos = []; // Arreglo para almacenar los objetos de cada caso de estudio.

// Función para cargar los datos JSON de la API utilizando JSONP para solicitudes de dominio cruzado.
function preload() {
  data = loadJSON(queryUrl, gotData, "jsonp");
}

// Función llamada automáticamente después de que los datos JSON son cargados.
function gotData() {
  console.log(data); // Imprimir datos para depuración.
  constructObjects(); // Construir objetos con los datos obtenidos.
}

// Configuración inicial para p5.js, llamada una vez, configura la página sin un canvas.
function setup() {
  noCanvas();
  displayAll(); // Mostrar todos los casos de estudio.
}

// Crear objetos de casos de estudio basados en los datos cargados.
function constructObjects() {
  for (let key in data.query.results) {
    let caso = data.query.results[key];
    let name = caso.printouts["Nombre"]?.join(", ") ?? "Nombre no disponible";
    let shortDesc =
      caso.printouts["Descripción Corta"]?.join(", ") ??
      "Descripción corta no disponible";
    let desc =
      caso.printouts["Descripción"]?.join(", ") ?? "Descripción no disponible";
    let keywords =
      caso.printouts["Palabras Clave"]?.join(", ") ??
      "Palabras clave no disponibles";
    let img =
      caso.printouts["ImgPath"]?.join(", ") ??
      "https://loremflickr.com/640/360";
    let imgs =
      caso.printouts["ImgPaths"]?.join(", ") ??
      "https://loremflickr.com/640/360";
    let url = caso.printouts["URL"]?.join(", ") ?? "URL no disponible";
    let id = toCanonical(name); // Convertir nombre a formato canónico.
    let casoNuevo = new Caso(
      name,
      id,
      shortDesc,
      desc,
      keywords,
      url,
      caso.fullurl,
      img,
      imgs
    );
    casos.push(casoNuevo);
  }
  constructSelector(); // Construir el selector después de mostrar todos los casos.
}

// Clase para representar un caso de estudio.
class Caso {
  constructor(
    name,
    id,
    shortDesc,
    desc,
    keywords,
    url,
    casiopeaUrl,
    img,
    imgs
  ) {
    this.name = name;
    this.id = id;
    this.shortDesc = shortDesc;
    this.desc = desc;
    this.keywords = keywords;
    this.img = img;
    this.imgs = imgs;
    this.casiopeaURL = casiopeaUrl;
    this.url = url;
  }

  // Método para mostrar un caso en formato reducido.
  displaySmall() {
    let currentUrl = window.location.href.split("?")[0];
    let urlWithParam = `${currentUrl}?id=${this.id}`;
    let casoContainer = createDiv(
      "<a href='#' onclick='event.preventDefault(); goToURL(\"" +
        urlWithParam +
        '", "' +
        this.id +
        "\");'>" +
        "<img src='" +
        this.img +
        "' title='" +
        this.name +
        "' />" +
        "<div class='overlay'>" +
        "<h4>" +
        this.name +
        "</h4>" +
        "<div class='desc'>" +
        this.shortDesc +
        "</div></div></a>"
    );
    casoContainer.class("caso");
    casoContainer.parent("main");
  }

  // Método para mostrar detalles completos de un caso.
  display() {
    clearAll(); // Limpia todos los contenidos antes de mostrar nuevos datos.

    // Agregar el título
    let htmlTitle = document.getElementById("title");
    htmlTitle.innerHTML = this.name;

    // Comienza a construir el contenido HTML (en este caso, son 2 columnas)
    let htmlContent =
      `<img src='${this.img}' title='${this.name}' />` +
      `<div class='desc'>${this.desc}<br><br><strong>Palabras Clave</strong>: ${this.keywords}<br><br>`;

    // Agregar enlaces de URLs
    const urls = this.url.split(", "); // Divide las URLs independientemente de si hay una o varias
    let urlsHtml = "<strong>Este patrón se usa en:</strong><br>"; // Inicializa un string vacío para construir el HTML de enlaces.

    urls.forEach((url) => {
      urlsHtml += `<a href='${url.trim()}'>${url.trim()}</a><br>`; // Agrega cada URL como un enlace.
    });

    htmlContent += urlsHtml; // le sumo las URL al HTML que estoy componientdo

    // Agregar imágenes extra dentro de un div.gallery si hay imágenes disponibles
    let imgsHtml = ""; // Inicializa un string vacío para construir el HTML de imágenes.

    if (this.imgs && this.imgs.trim() !== "") {
      // Verifica que la variable imgs contiene algo antes de proceder
      const imgsArray = this.imgs.split(", "); // Divide las imágenes en un array
      imgsArray.forEach((img) => {
        imgsHtml += `<img src='${img.trim()}' alt='Imagen adicional para ${
          this.name
        }' />`;
      });

      // Si imgsHtml tiene contenido después de procesar las imágenes, envolver en div.gallery
      if (imgsHtml) {
        imgsHtml = `<div class='gallery'>${imgsHtml}</div>`; // Envuelve las imágenes en un contenedor gallery si hay alguna imagen
      }
    }
    // Agregar el HTML de imágenes al contenido principal, solo si imgsHtml no está vacío
    if (imgsHtml) {
      htmlContent += imgsHtml; // Agrega el contenedor gallery solo si hay imágenes
    }

    // Continuar construyendo el contenido HTML
    htmlContent += `<a class='wiki-link' href='${this.casiopeaURL}'>Link a Casiopea</a></div>`;

    // Asignar el contenido HTML al contenedor y ajustar la clase
    let singleContainer = createDiv(htmlContent);
    singleContainer.class("single");
    singleContainer.parent(document.getElementById("single"));
  }
}

// Función para generar un selector y permitir la navegación entre casos.
function constructSelector() {
  let sel = createSelect();
  sel.option("Selecciona un patrón oscuro");
  casos.forEach((caso) => {
    sel.option(caso.name, caso.id);
  });
  sel.parent("footerSelect");
  sel.changed(() => {
    let selectedId = sel.value();
    goToURL(
      window.location.href.split("?")[0] + "?id=" + selectedId,
      selectedId
    );
  });
}

// Función para mostrar todos los casos en formato pequeño.
function displayAll() {
  clearAll();
  let htmlTitle = document.getElementById("title");
  htmlTitle.innerHTML = "Patrones Oscuros del Diseño de Interacción";
  for (let caso of casos) {
    caso.displaySmall();
  }
}

// Funciones adicionales para manejar la visualización y navegación de casos.
function displayCase(id) {
  let mainContainer = document.querySelector("main");
  mainContainer.innerHTML = "";
  let selectedCaso = casos.find((caso) => caso.id === id);
  if (selectedCaso) {
    document.title = selectedCaso.name + " - Dark Patterns";
    selectedCaso.display();
  }
}

function goToURL(url, id = null) {
  if (id) {
    history.pushState({ id: id }, "", url);
    displayCase(id);
  } else {
    const selectedId = sel.value();
    const newUrl = window.location.href.split("?")[0] + "?id=" + selectedId;
    history.pushState({ id: selectedId }, "", newUrl);
    displayCase(selectedId);
  }
}

// Convertir nombres a permalinks, facilitando URLs amigables.
function toCanonical(name) {
  let canonical = name.toLowerCase();
  const accentMap = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u", ñ: "n" };
  canonical = canonical.replace(/[áéíóúüñ]/g, (match) => accentMap[match]);
  canonical = canonical.replace(/\s+/g, "-");
  canonical = canonical.replace(/[^a-z0-9-]/g, "");
  return canonical;
}

// Limpiar todos los contenidos antes de cargar nuevos casos.
function clearAll() {
  let htmlTitle = document.getElementById("title");
  htmlTitle.innerHTML = ""; // Limpiar el título del caso en la página.
  let articleContainer = document.getElementById("single");
  articleContainer.innerHTML = ""; // Limpiar el contenido del artículo antes de añadir nuevo contenido.
}
