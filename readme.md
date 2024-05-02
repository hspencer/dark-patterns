## dark patterns

Este repositorio de una prueba de concepto diseñado como una primera platilla (elemental) para usar la [Wiki Casiopea](https://wiki.ead.pucv.cl) como respositorio o base de datos para documentar los patrones oscuros.

### Enfoque
En la [Zona de Pruebas de la API](https://wiki.ead.pucv.cl/Especial:Zona_de_pruebas_de_la_API) realizamos la siguiente consulta:

```
[[Categoría:Caso de Estudio]][[Palabras Clave::dark]]
|?Nombre
|?Descripción
|?URL
|?ImgPath
```

para generar una URL que nos entrega un JSON:
```
https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3ACaso%20de%20Estudio%5D%5D%5B%5BPalabras%20Clave%3A%3Adark%5D%5D%7C%3FNombre%7C%3FDescripci%C3%B3n%7C%3FURL%7C%3FImgPath&utf8=1
```