# Tiendas Mass — Backoffice

Prototipo UX académico, responsive y **no oficial** de Tiendas Mass. Reconstruye las referencias Desktop y Mobile exportadas desde Google Stitch en una sola aplicación React.

## Ejecutar

Requiere Node.js 20.19+ y npm. Todos los archivos del proyecto se encuentran en `backoffice/`. Ejecuta los comandos desde esa carpeta. El nombre del paquete se mantiene como `mass-backoffice-prototype`.

```sh
cd backoffice
npm install
npm run dev
```

Abrir http://127.0.0.1:5173. Para compilar y servir el resultado:

```sh
npm run build
npm run preview
```

Credenciales demo: **admin@mass.pe / 123456**. También se admite cualquier correo válido y una contraseña no vacía. Google Workspace y recuperación son simulaciones.

## Tecnologías y estructura

React 19, TypeScript strict, Vite, React Router, Tailwind CSS v4 instalado con npm, Lucide React y fuentes Inter / Plus Jakarta Sans locales.

- `src/app`: rutas, proveedor Context + reducer y sesión mock.
- `src/pages`: las diez pantallas principales y formulario de nuevo producto.
- `src/components/ui`: botones, badges, modal accesible con foco contenido, confirmaciones, búsquedas, paneles y paginación.
- `src/components/layout`: sidebar, header, selector de tienda y navegación inferior.
- `src/components/dashboard` y `orders`: gráficos SVG y timeline reutilizables.
- `src/mocks`: productos, inventario, pedidos, eventos, precios y datos de gráficos.
- `src/types`: entidades TypeScript.
- `src/styles`: tokens y adaptaciones responsive.
- `public/assets`: empaques SVG locales.
- `reference/stitch`: los dos exports originales, las 18 vistas separadas y el inventario de vistas.
- `reference/ANALYSIS.md`: decisiones visuales y resolución de inconsistencias entre referencias.
- `tests`: pruebas de navegador del flujo principal y de responsive.

## Rutas

`/` redirige a `/login`. Las demás rutas requieren la sesión mock en memoria:

- `/login`
- `/dashboard`
- `/catalogo`
- `/catalogo/nuevo`
- `/catalogo/:productId/editar`
- `/precios`
- `/inventario`
- `/pedidos`
- `/pedidos/:orderId`
- `/pedidos/:orderId/seguimiento`
- `/reportes`

Las rutas desconocidas vuelven al login. Los IDs inexistentes muestran un estado vacío. El servidor de producción debe servir index.html como fallback para rutas SPA.

## Demo funcional

1. Iniciar sesión y consultar dashboard por Hoy, 7 días o Mes.
2. Buscar, filtrar, ordenar y paginar el catálogo; crear o editar un producto.
3. Guardar nombre, SKU, EAN, categoría, marca, proveedor, descripción, precios, promoción, stock, estado e imagen local. Ver fleje en vivo.
4. Cambiar precios desde Precios y comprobar la actualización del catálogo.
5. Ajustar stock con motivo y revisar el movimiento en Kardex. Las transferencias descuentan unidades del recinto de origen y se registran en el historial.
6. Filtrar pedidos, crear uno, abrir detalle, editar prioridad/estado, añadir notas y confirmar cancelación.
7. Ver timeline, mapa SVG, ETA y transporte; simular GPS, escaneo, incidencias y aviso de arribo.
8. Filtrar reportes y descargar CSV. Imprimir usa el diálogo del navegador.

## Datos y límites

**No hay backend, base de datos, API ni persistencia. No se usa localStorage ni sessionStorage. Todos los cambios y la sesión se pierden al recargar.** Se guardan únicamente en memoria React mientras la aplicación está abierta.

Se reutilizan los productos, precios y pedidos de Stitch y se unifican IDs y cantidades inconsistentes. El pedido `PED-2024-8921` suma S/16,556.00. Los nueve productos del surtido son compartidos entre módulos. El selector de sucursal cambia el contexto visual; el surtido demo es compartido entre sucursales. Los gráficos y algunas métricas logísticas son ilustrativos; los indicadores del catálogo y pedidos usan el estado de la sesión. Las imágenes de producto son representaciones locales, no fotografías comerciales oficiales.

La carga masiva valida la selección de archivo y simula el resultado; no interpreta Excel. Borrador, campañas y documentos son demostrativos. Exportaciones y documentos mock se descargan como CSV. Configuración muestra “Funcionalidad no incluida en este prototipo”. No se envían correos, notificaciones reales ni llamadas a transportistas.

## Verificación

`npm run build` ejecuta TypeScript strict y genera `dist/`.

Con el servidor de desarrollo iniciado y Google Chrome instalado (canal `chrome` de Playwright):

```sh
npx playwright test
```

Las pruebas cubren precios compartidos, ajustes de stock, creación y cancelación de pedidos, seguimiento, recuperación al recargar, rutas y ausencia de overflow en 390×844, 430×932, 768×1024, 1024×768 y 1440×1024.
