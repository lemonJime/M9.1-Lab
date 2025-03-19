import {
  LineaTicket,
  Producto,
  ResultadoLineaTicket,
  TicketFinal,
  TipoIva,
  TotalPorTipoIva,
  ResultadoTotalTicket,
} from "./modelo";

// Función para obtener el porcentaje de IVA
export const obtenerPorcentajeIva = (tipoIva: TipoIva): number => {
  switch (tipoIva) {
    case "general":
      return 21;
    case "reducido":
      return 10;
    case "superreducidoA":
      return 5;
    case "superreducidoB":
      return 4;
    case "superreducidoC":
      return 0;
    case "sinIva":
      return 0;
    default:
      return 0;
  }
};

// Función para calcular el precio con IVA
export const calcularPrecioConIva = (producto: Producto): number => {
  const porcentajeIva = obtenerPorcentajeIva(producto.tipoIva);
  const precioConIva = producto.precio * (1 + porcentajeIva / 100);
  return parseFloat(precioConIva.toFixed(2));
};

// Función para obtener las líneas con IVA
export const obtenerLineasConIVA = (
  lineasTicket: LineaTicket[]
): ResultadoLineaTicket[] => {
  return lineasTicket.map((linea) => ({
    nombre: linea.producto.nombre,
    cantidad: linea.cantidad,
    precionSinIva: linea.producto.precio,
    tipoIva: linea.producto.tipoIva,
    precioConIva: calcularPrecioConIva(linea.producto),
  }));
};

// Función para calcular los totales
export const calcularTotales = (
  lineasConIva: ResultadoLineaTicket[]
): ResultadoTotalTicket => {
  let totalSinIva = 0;
  let totalConIva = 0;
  let totalIva = 0;

  for (let i = 0; i < lineasConIva.length; i++) {
    const linea = lineasConIva[i];
    totalSinIva += linea.precionSinIva * linea.cantidad;
    totalConIva += linea.precioConIva * linea.cantidad;
    totalIva += (linea.precioConIva - linea.precionSinIva) * linea.cantidad;
  }

  return {
    totalSinIva: parseFloat(totalSinIva.toFixed(2)),
    totalConIva: parseFloat(totalConIva.toFixed(2)),
    totalIva: parseFloat(totalIva.toFixed(2)),
  };
};

// Función para desglosar el IVA
export const desglosarIva = (
  lineasConIva: ResultadoLineaTicket[]
): TotalPorTipoIva[] => {
  const desgloseIva: TotalPorTipoIva[] = [];

  for (let i = 0; i < lineasConIva.length; i++) {
    const linea = lineasConIva[i];
    const tipoIva = linea.tipoIva;
    const ivaLinea = (linea.precioConIva - linea.precionSinIva) * linea.cantidad;

    let encontrado = false;
    for (let j = 0; j < desgloseIva.length; j++) {
      if (desgloseIva[j].tipoIva === tipoIva) {
        desgloseIva[j].cuantia += ivaLinea;
        encontrado = true;
        break;
      }
    }

    // Si no existe, añadirlo al desglose
    if (!encontrado) {
      desgloseIva.push({
        tipoIva: tipoIva,
        cuantia: parseFloat(ivaLinea.toFixed(2)),
      });
    }
  }

  return desgloseIva;
};



// Función principal para calcular el ticket
export const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
  const lineasConIva = obtenerLineasConIVA(lineasTicket);
  const totales = calcularTotales(lineasConIva);
  const desgloseIva = desglosarIva(lineasConIva);

  return {
    lineas: lineasConIva,
    total: totales,
    desgloseIva: desgloseIva,
  };
};
