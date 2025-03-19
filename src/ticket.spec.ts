import { LineaTicket, Producto, ResultadoLineaTicket, ResultadoTotalTicket, TicketFinal, TotalPorTipoIva } from "./modelo";
import { obtenerPorcentajeIva, calcularPrecioConIva, obtenerLineasConIVA, calcularTotales, desglosarIva, calculaTicket } from "./ticket";

describe("obtenerPorcentajeIva", () => {
    it("Debería devolver 10", () => {
        // Arrange 
        const tipoIva = "reducido";
        // Act 
        const resultado = obtenerPorcentajeIva(tipoIva);
        // // Assert 
        const resultadoEsperado = 10;
        expect(resultado).toEqual(resultadoEsperado);
    });

    it("Debería devolver 10", () => {
        // Arrange 
        const tipoIva = "superreducidoA";
        // Act 
        const resultado = obtenerPorcentajeIva(tipoIva);
        // // Assert 
        const resultadoEsperado = 5;
        expect(resultado).toEqual(resultadoEsperado);
    });
});


describe("calcularPrecioConIva", () => {
    it("Debería devolver 24.2", () => {
        // Arrange
        const perfume: Producto = {
            nombre: "perfume",
            precio: 20,
            tipoIva: "general",
        };

        // Act
        const resultado = calcularPrecioConIva(perfume);

        // // Assert
        const resultadoEsperado = 24.2;
        expect(resultado).toEqual(resultadoEsperado);
    });

    it("Debería devolver 24.2", () => {
        // Arrange
        const perfume: Producto = {
            nombre: "Lasaña",
            precio: 5,
            tipoIva: "superreducidoA",
        };

        // Act
        const resultado = calcularPrecioConIva(perfume);

        // // Assert
        const resultadoEsperado = 5.25;
        expect(resultado).toEqual(resultadoEsperado);
    });
});

describe("obtenerLineasConIVA", () => {
    it("Debería devolver un array de ResultadoLineaTicket con los precios con IVA calculados", () => {
        // Arrange
        const lineasTicket: LineaTicket[] = [
            {
                producto: {
                    nombre: "Perfume",
                    precio: 20,
                    tipoIva: "general",
                },
                cantidad: 3,
            },
            {
                producto: {
                    nombre: "Lasaña",
                    precio: 5,
                    tipoIva: "superreducidoA",
                },
                cantidad: 1,
            },
        ];

        // Act
        const resultado = obtenerLineasConIVA(lineasTicket);

        // Assert
        const resultadoEsperado: ResultadoLineaTicket[] = [
            {
                nombre: "Perfume",
                cantidad: 3,
                precionSinIva: 20,
                tipoIva: "general",
                precioConIva: 24.2,
            },
            {
                nombre: "Lasaña",
                cantidad: 1,
                precionSinIva: 5,
                tipoIva: "superreducidoA",
                precioConIva: 5.25,
            },
        ];
        expect(resultado).toEqual(resultadoEsperado);
    });

    it("Debería devolver un array vacío si no hay líneas de ticket", () => {
        // Arrange
        const lineasTicket: LineaTicket[] = [];

        // Act
        const resultado = obtenerLineasConIVA(lineasTicket);

        // Assert
        const resultadoEsperado: ResultadoLineaTicket[] = [];
        expect(resultado).toEqual(resultadoEsperado);
    });
});



describe("calcularTotales", () => {
    it("Debería calcular correctamente los totales para un array de líneas con IVA", () => {
        // Arrange
        const lineasConIva: ResultadoLineaTicket[] = [
            {
                nombre: "Perfume",
                cantidad: 3,
                precionSinIva: 20,
                tipoIva: "general",
                precioConIva: 24.2, 
            },
            {
                nombre: "Lasaña",
                cantidad: 1,
                precionSinIva: 5,
                tipoIva: "superreducidoA",
                precioConIva: 5.25, 
            },
        ];

        // Act
        const resultado = calcularTotales(lineasConIva);

        // Assert
        const resultadoEsperado: ResultadoTotalTicket = {
            totalSinIva: 65, 
            totalConIva: 77.85, 
            totalIva: 12.85, 
        };
        expect(resultado).toEqual(resultadoEsperado);
    });

    it("Debería devolver totales en 0 si el array de líneas con IVA está vacío", () => {
        // Arrange
        const lineasConIva: ResultadoLineaTicket[] = [];

        // Act
        const resultado = calcularTotales(lineasConIva);

        // Assert
        const resultadoEsperado: ResultadoTotalTicket = {
            totalSinIva: 0,
            totalConIva: 0,
            totalIva: 0,
        };
        expect(resultado).toEqual(resultadoEsperado);
    });
});


describe("desglosarIva", () => {
    it("Debería devolver el desglose del IVA por tipo correctamente", () => {
        // Arrange
        const lineasConIva: ResultadoLineaTicket[] = [
            {
                nombre: "Perfume",
                cantidad: 3,
                precionSinIva: 20,
                tipoIva: "general",
                precioConIva: 24.2, // IVA: 4.2 por unidad
            },
            {
                nombre: "Lasaña",
                cantidad: 1,
                precionSinIva: 5,
                tipoIva: "superreducidoA",
                precioConIva: 5.25, // IVA: 0.25 por unidad
            },
            {
                nombre: "Leche",
                cantidad: 6,
                precionSinIva: 1,
                tipoIva: "superreducidoC",
                precioConIva: 1, // IVA: 0 por unidad
            },
            {
                nombre: "Legumbres",
                cantidad: 2,
                precionSinIva: 2,
                tipoIva: "general",
                precioConIva: 2.42, // IVA: 0.42 por unidad
            },
        ];

        // Act
        const resultado = desglosarIva(lineasConIva);

        // Assert
        const resultadoEsperado: TotalPorTipoIva[] = [
            {
                tipoIva: "general",
                cuantia: 13.44, 
            },
            {
                tipoIva: "superreducidoA",
                cuantia: 0.25, 
            },
            {
                tipoIva: "superreducidoC",
                cuantia: 0, 
            },
        ];
        expect(resultado).toEqual(resultadoEsperado);
    });

    it("Debería devolver un array vacío si no hay líneas con IVA", () => {
        // Arrange
        const lineasConIva: ResultadoLineaTicket[] = [];

        // Act
        const resultado = desglosarIva(lineasConIva);

        // Assert
        const resultadoEsperado: TotalPorTipoIva[] = [];
        expect(resultado).toEqual(resultadoEsperado);
    });
});




describe("calculaTicket", () => {
    it("Debería devolver el ticket final correctamente", () => {
        // Arrange
        const lineasTicket: LineaTicket[] = [
            {
                producto: {
                    nombre: "Perfume",
                    precio: 20,
                    tipoIva: "general",
                },
                cantidad: 3,
            },
            {
                producto: {
                    nombre: "Lasaña",
                    precio: 5,
                    tipoIva: "superreducidoA",
                },
                cantidad: 1,
            },
            {
                producto: {
                    nombre: "Leche",
                    precio: 1,
                    tipoIva: "superreducidoC",
                },
                cantidad: 6,
            },
            {
                producto: {
                    nombre: "Legumbres",
                    precio: 2,
                    tipoIva: "general",
                },
                cantidad: 2,
            },
        ];

        // Act
        const resultado = calculaTicket(lineasTicket);

        // Assert
        const resultadoEsperado: TicketFinal = {
            lineas: [
                {
                    nombre: "Perfume",
                    cantidad: 3,
                    precionSinIva: 20,
                    tipoIva: "general",
                    precioConIva: 24.2,
                },
                {
                    nombre: "Lasaña",
                    cantidad: 1,
                    precionSinIva: 5,
                    tipoIva: "superreducidoA",
                    precioConIva: 5.25,
                },
                {
                    nombre: "Leche",
                    cantidad: 6,
                    precionSinIva: 1,
                    tipoIva: "superreducidoC",
                    precioConIva: 1,
                },
                {
                    nombre: "Legumbres",
                    cantidad: 2,
                    precionSinIva: 2,
                    tipoIva: "general",
                    precioConIva: 2.42,
                },
            ],
            total: {
                totalSinIva: 75,
                totalConIva: 88.69,
                totalIva: 13.69,
            },
            desgloseIva: [
                {
                    tipoIva: "general",
                    cuantia: 13.44,
                },
                {
                    tipoIva: "superreducidoA",
                    cuantia: 0.25,
                },
                {
                    tipoIva: "superreducidoC",
                    cuantia: 0,
                },
            ],
        };
        expect(resultado).toEqual(resultadoEsperado);
    });

    it("Debería devolver un ticket vacío si no hay líneas de ticket", () => {
        // Arrange
        const lineasTicket: LineaTicket[] = [];

        // Act
        const resultado = calculaTicket(lineasTicket);

        // Assert
        const resultadoEsperado: TicketFinal = {
            lineas: [],
            total: {
                totalSinIva: 0,
                totalConIva: 0,
                totalIva: 0,
            },
            desgloseIva: [],
        };
        expect(resultado).toEqual(resultadoEsperado);
    });
});