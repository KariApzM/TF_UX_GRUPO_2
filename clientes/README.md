# Tiendas Mass — HTML, CSS y JavaScript

## Archivos 
- `src/index.html`: documento inicial del catálogo.
- `src/css/styles.css`: colores, tipografías y diseño de todas las pantallas.
- `src/js/app.js`: productos, textos, pantallas y navegación; HTML de las pantallas dentro de funciones como `catalog`, `login`, `checkout`, `tracking`.
- `src/js/cart-logic.js`: reglas del carrito, descuentos y validación; conversión a JavaScript de las reglas del proyecto original.
- `src/assets/`: las dos fotografías locales del prototipo.
- Cada carpeta de pantalla contiene su propio `index.html`, con metadatos y un identificador para mostrarla.

## Pantallas
`/`, `/buscar`, `/filtros`, `/filtro`, `/producto/1` a `/producto/4`, `/carrito`, `/ingresar`, `/checkout`, `/checkout/yape`, `/checkout/tarjeta`, `/checkout/efectivo`, `/checkout/recojo`, `/checkout/domicilio`, `/pedido-confirmado`, `/pedido-confirmado/1`, `/pedidos`, `/seguimiento`, `/ofertas`.

## Flujo
Catálogo → detalle → carrito → ingreso/registro/invitado → pago → confirmación → seguimiento. El catálogo enlaza a ofertas y mis pedidos.

La primera vista incluye 1 Arroz extra 5 kg en el carrito. El envío cuesta S/ 5.00; el recojo es gratis. MASS10 descuenta 10% y CASERO20 descuenta 20% del subtotal.
