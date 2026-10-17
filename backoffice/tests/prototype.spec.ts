import { test, expect, type Page } from "@playwright/test";
async function login(page: Page) {
  await page.goto("/login");
  await page
    .getByLabel("Correo electrónico corporativo", { exact: true })
    .fill("admin@mass.pe");
  await page.getByLabel("Contraseña", { exact: true }).fill("123456");
  await page
    .getByRole("button", { name: "Ingresar al Sistema", exact: true })
    .click();
  await expect(page).toHaveURL(/dashboard/);
}
async function go(page: Page, path: string) {
  await page.evaluate((path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, path);
  await page.waitForTimeout(100);
}
test("flujo completo: precio, stock, pedido y reinicio sin persistencia", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await login(page);
  await go(page, "/catalogo");
  await page
    .getByRole("textbox", {
      name: "Buscar por nombre, SKU o EAN…",
      exact: true,
    })
    .fill("Arroz");
  await page
    .getByRole("link", {
      name: "Editar Arroz Extra Añejo Mass 5kg",
      exact: true,
    })
    .click();
  await page.getByLabel("Precio Mass (PVP final)").fill("17.80");
  await page
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/catalogo$/);
  await expect(page.locator(".mass-price").first()).toContainText("17.80");
  await go(page, "/precios");
  await expect(page.locator(".price-comparison").first()).toContainText(
    "17.80",
  );
  await go(page, "/inventario");
  await page
    .getByRole("button", { name: "Actualizar stock", exact: true })
    .click();
  await page.getByLabel("Nuevo stock actual").fill("450");
  await page
    .getByLabel("Motivo / observación")
    .fill("Conteo físico de demostración");
  await page.getByRole("button", { name: "Guardar movimiento" }).click();
  await expect(page.locator("tbody tr").first()).toContainText("450 uds");
  await expect(page.locator(".movement-list").first()).toContainText(
    "Conteo físico de demostración",
  );
  await go(page, "/pedidos");
  await page
    .getByRole("textbox", {
      name: "Buscar pedido, origen o destino…",
      exact: true,
    })
    .fill("8921");
  await page.getByRole("link", { name: "#PED-2024-8921", exact: true }).click();
  await expect(page.locator(".total-box")).toContainText("16,556.00");
  await page
    .getByRole("link", { name: "Ver seguimiento", exact: true })
    .click();
  await expect(page).toHaveURL(/seguimiento/);
  await expect(
    page.getByRole("img", { name: /Ruta visual simulada/ }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reportar incidencia", exact: true })
    .click();
  await page
    .getByLabel("Descripción", { exact: true })
    .fill("Demora de prueba en peaje");
  await page.getByRole("button", { name: "Registrar incidencia" }).click();
  await expect(page.locator(".incident-list")).toContainText(
    "Demora de prueba en peaje",
  );
  await page
    .getByRole("link", { name: /Volver al pedido PED-2024-8921/ })
    .click();
  await page
    .getByRole("button", { name: "Cancelar pedido", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirmar cancelación" }).click();
  await expect(page.locator(".order-status-line")).toContainText("Cancelado");
  await go(page, "/pedidos");
  await page.getByRole("button", { name: "Cancelado 1", exact: true }).click();
  await expect(page.locator("tbody")).toContainText("PED-2024-8921");
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  await page.reload();
  await expect(page).toHaveURL(/login/);
  await login(page);
  await go(page, "/catalogo");
  await expect(page.locator(".mass-price").first()).toContainText("18.90");
  expect(errors).toEqual([]);
});
test("crear producto, crear pedido y validaciones", async ({ page }) => {
  await login(page);
  await go(page, "/catalogo/nuevo");
  await page
    .getByLabel("Nombre comercial del producto")
    .fill("Agua Mass Demo 625ml");
  await page.getByLabel("SKU interno SPSA").fill("MASS-BEB-DEMO");
  await page.getByLabel("Código de barras (EAN-13)").fill("7751234567890");
  await page.getByLabel("Precio regular (mercado)").fill("2");
  await page.getByLabel("Precio Mass (PVP final)").fill("1.50");
  await page
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .first()
    .click();
  await expect(
    page
      .getByRole("link", { name: "Agua Mass Demo 625ml", exact: true })
      .first(),
  ).toBeVisible();
  await go(page, "/pedidos");
  await page.getByRole("button", { name: "Crear pedido", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("combobox", { name: "Producto", exact: true })
    .selectOption({ label: "Agua Mass Demo 625ml" });
  await page.getByLabel("Cantidad", { exact: true }).fill("12");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Crear pedido", exact: true })
    .click();
  await page
    .getByRole("textbox", {
      name: "Buscar pedido, origen o destino…",
      exact: true,
    })
    .fill("DEMO");
  await expect(page.locator("tbody")).toContainText("18.00");
  await expect(page.locator("tbody")).toContainText("Pendiente");
});
for (const viewport of [
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 1024 },
]) {
  test(`rutas y responsive ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await login(page);
    for (const path of [
      "/dashboard",
      "/catalogo",
      "/catalogo/p1/editar",
      "/catalogo/nuevo",
      "/precios",
      "/inventario",
      "/pedidos",
      "/pedidos/PED-2024-8921",
      "/pedidos/PED-2024-8921/seguimiento",
      "/reportes",
    ]) {
      await go(page, path);
      await expect(page.locator("h1")).toBeVisible();
      const size = await page.evaluate(() => ({
        viewport: window.innerWidth,
        width: document.documentElement.scrollWidth,
      }));
      expect(size.width, `overflow on ${path}`).toBeLessThanOrEqual(
        size.viewport,
      );
      if (viewport.width < 1024) {
        await expect(page.locator(".desktop-sidebar")).toBeHidden();
        await expect(page.locator(".mobile-bottom-nav")).toBeVisible();
      } else {
        await expect(page.locator(".mobile-bottom-nav")).toBeHidden();
        await expect(page.locator(".desktop-sidebar")).toBeVisible();
      }
    }
    await go(page, "/dashboard");
    await page.screenshot({
      path: `test-results/dashboard-${viewport.width}.png`,
      fullPage: true,
    });
    await go(page, "/catalogo");
    await page.screenshot({
      path: `test-results/catalog-${viewport.width}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}

test("demo móvil con navegación real y formulario compartido", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await login(page);
  await page
    .locator(".mobile-bottom-nav")
    .getByRole("link", { name: "Catálogo", exact: true })
    .click();
  await page
    .getByRole("textbox", {
      name: "Buscar por nombre, SKU o EAN…",
      exact: true,
    })
    .fill("Arroz");
  await page
    .getByRole("link", {
      name: "Editar Arroz Extra Añejo Mass 5kg",
      exact: true,
    })
    .click();
  await page.getByLabel("Precio Mass (PVP final)").fill("17.25");
  await page
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .first()
    .click();
  await expect(page.locator(".product-card").first()).toContainText("17.25");
  await page
    .locator(".mobile-bottom-nav")
    .getByRole("link", { name: "Kardex", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Ajustar stock", exact: true })
    .first()
    .click();
  await page.getByLabel("Nuevo stock actual").fill("499");
  await page.getByLabel("Motivo / observación").fill("Conteo desde móvil");
  await page.getByRole("button", { name: "Guardar movimiento" }).click();
  await expect(page.locator(".inventory-numbers").first()).toContainText("499");
  await page
    .locator(".mobile-bottom-nav")
    .getByRole("link", { name: "Pedidos", exact: true })
    .click();
  await page.locator(".order-card").first().click();
  await page
    .getByRole("link", { name: "Ver seguimiento", exact: true })
    .click();
  await expect(
    page.getByRole("img", { name: /Ruta visual simulada/ }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /Volver al pedido PED-2024-8921/ })
    .click();
  await page
    .getByRole("button", { name: "Cancelar pedido", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirmar cancelación" }).click();
  await page
    .locator(".mobile-bottom-nav")
    .getByRole("link", { name: "Pedidos", exact: true })
    .click();
  await page.getByRole("button", { name: "Cancelado 1", exact: true }).click();
  await expect(page.locator(".order-card")).toHaveCount(1);
  await expect(page.locator(".order-card")).toContainText("Cancelado");
  expect(errors).toEqual([]);
});

test("login, rutas inexistentes, descarga CSV y accesibilidad del modal", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/login/);
  await page
    .getByRole("button", { name: "Ingresar al Sistema", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("correo válido");
  await page.getByRole("button", { name: "Mostrar contraseña" }).click();
  await expect(page.locator("#password")).toHaveAttribute("type", "text");
  await login(page);
  await page
    .getByRole("button", { name: "Configuración", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Funcionalidad no incluida",
  );
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Descargar reporte", exact: true })
    .click();
  await expect((await download).suggestedFilename()).toBe(
    "reporte-ejecutivo.csv",
  );
  await page
    .getByRole("button", { name: "Notificaciones", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await go(page, "/catalogo/no-existe/editar");
  await expect(
    page.getByRole("heading", { name: "Producto no encontrado" }),
  ).toBeVisible();
  await go(page, "/pedidos/no-existe");
  await expect(
    page.getByRole("heading", { name: "Pedido no encontrado" }),
  ).toBeVisible();
});
