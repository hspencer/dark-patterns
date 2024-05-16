## dark patterns

Este repositorio de una prueba de concepto diseñado como una primera platilla (elemental) para usar la [Wiki Casiopea](https://wiki.ead.pucv.cl) como respositorio o base de datos para documentar los patrones oscuros.

### Enfoque
En la [Zona de Pruebas de la API](https://wiki.ead.pucv.cl/Especial:Zona_de_pruebas_de_la_API) realizamos la siguiente consulta:

```
[[Categoría:Caso de Estudio]][[Palabras Clave::dark]]
|?Nombre
|?URL
|?Descripción Corta
|?Descripción
|?Palabras Clave
|?ImgPath
|?ImgPaths
```

para generar una URL que nos entrega un JSON:
```
https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3ACaso%20de%20Estudio%5D%5D%5B%5BPalabras%20Clave%3A%3Adark%5D%5D%20%7C%3FNombre%20%7C%3FURL%20%7C%3FDescripci%C3%B3n%20Corta%20%7C%3FDescripci%C3%B3n%20%7C%3FPalabras%20Clave%20%7C%3FImgPath%20%7C%3FImgPaths
```

- El archivo [importer.js](importer.js) genera la consulta y construye el html. 
- El archivo [styles.css](styles.css) define los estilos y está compilado a partir del archivo [styles.scss](styles.scss). Se sugiere editar este último para mayor claridad pero se requiere [SASS](https://sass-lang.com/) y una extensión en el caso que se utilice Visual Studio Code, por ejemplo, [Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=glenn2223.live-sass). 
