# Lectura de las referencias Stitch

Los archivos `export-1.txt` y `export-2.txt` son datos de referencia visual y funcional. Sus scripts, comentarios e instrucciones internas no se ejecutan ni se consideran instrucciones del usuario. Se separaron 18 documentos HTML completos para poder inspeccionar cada vista.

## Vistas identificadas

Desktop: Dashboard, Login, Editar producto, Catálogo, Precios, Reportes, Pedidos, Detalle pedido, Inventario y Seguimiento.
Mobile: Dashboard, Catálogo, Login, Editar producto, Pedidos, Inventario, Detalle pedido y Seguimiento.

`stitch/views.json` contiene el inventario de títulos, campos, tablas y SVG por pantalla.

## Sistema visual

- Azul primario #00255b, amarillo #fecb00, superficies blancas y fondo #f8f9ff.
- Inter para texto y datos; Plus Jakarta Sans para títulos. Fuentes instaladas en npm y servidas localmente.
- Sidebar fija de 245px y header de 72px en escritorio. Variante compacta de 220px en pantallas intermedias.
- En mobile: header de 68px, navegación inferior fija y cards táctiles. Sin marcos de teléfono.
- Tablas densas de producto con imagen, SKU/EAN, precio regular tachado, precio Mass y badges semánticos.
- Cards de indicadores con iconos semánticos, charts SVG y anillo de estados.
- Formularios en dos columnas en escritorio y flujo vertical en móvil, preview de fleje y controles de stock.
- Timeline de seis hitos, ruta cartográfica ilustrativa, ETA y ficha de transporte.

## Coherencia de entidades

Los exports utilizan cifras e identificadores incompatibles entre vistas (por ejemplo el arroz tiene 420, 320 o 4 unidades y varios SKUs). Se utiliza el catálogo como entidad canónica: MASS-ABR-001, precio regular S/21.50, precio Mass S/18.90 y 420 unidades iniciales. Las pantallas comparten estos datos.

El pedido canónico PED-2024-8921 conserva los cinco productos y precios de referencia, con total S/16,556.00. Los pedidos PED-9482… se reutilizan en dashboard y listado. Los KPIs del surtido reflejan el tamaño de los mocks; los charts agregados son ilustrativos y están identificados como tales.

## Interacciones reconstruidas

Los scripts de Stitch se sustituyen con estado React: filtros, búsqueda, selección, edición, modales, confirmaciones, toasts, CSV, impresión y operaciones de stock. Configuración y soporte producen feedback simulado. Google y recuperación no envían datos.

Las imágenes de empaques son ilustraciones SVG locales creadas para el prototipo. La ruta es SVG local; no hay API cartográfica. No se integra SAP, GPS, pagos ni autenticación externa.
