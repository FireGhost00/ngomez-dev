---
title: 'De formato fijo a free-format sin romper el cierre mensual'
description: 'Cómo convertir programas de 4.000 líneas por partes, con una prueba de regresión que cabe en un CL.'
pubDate: '2026-07-02'
tema: 'RPG'
---

El programa tenía 4.100 líneas en RPG de formato fijo, lo habían tocado once personas desde 2004 y calculaba las provisiones del cierre mensual. Nadie quería abrirlo. También era el que más consultas de mantenimiento generaba al año.

La conversión completa en un solo paso no era opción: si el cierre de mes salía mal, el error se descubre cinco días después y con contabilidad de por medio. Así que lo hicimos por partes, y la parte importante no fue la conversión sino la red de seguridad.

## Primero la prueba, después el cambio

Antes de convertir una sola línea, dejamos el programa original corriendo contra un juego de datos congelado y guardamos su salida completa. Cada versión convertida tenía que producir un archivo idéntico, byte por byte. La comparación es un `CMPPFM` dentro de un CL, y corre en menos de un minuto:

<pre><b>/* Regresión de cierre: original vs convertido */</b>
CALL PGM(CIERREOLD) PARM(&amp;PERIODO)
RNMOBJ OBJ(QTEMP/SALIDA) OBJTYPE(*FILE) NEWOBJ(BASE)
CALL PGM(CIERRENEW) PARM(&amp;PERIODO)
CMPPFM NEWFILE(QTEMP/SALIDA) OLDFILE(QTEMP/BASE) +
       OUTPUT(*PRINT) RPTTYPE(*CHANGES)
MONMSG MSGID(CPF0000) EXEC(SNDPGMMSG MSG('Diferencias'))</pre>

## Convertir por subrutina, no por programa

Usamos **ARCAD**/`RDi` para la conversión mecánica, pero solo de una subrutina a la vez. Cada bloque convertido se promueve, se prueba con el CL de arriba y se deja correr un ciclo antes de tocar el siguiente. Doce semanas en total. Cero incidencias en producción.

> La conversión automática resuelve la sintaxis. Lo que no resuelve son los indicadores globales que alguien dejó activos entre subrutinas hace quince años.

Ese fue el hallazgo real: tres indicadores numerados que cruzaban subrutinas y llevaban estado implícito. En formato fijo pasaban desapercibidos; al pasar a free-format con variables nombradas se volvieron visibles y documentables.

## Lo que me llevo

- La conversión no es el objetivo. El objetivo es que el próximo cambio cueste horas y no días.
- Sin una regresión automatizada, modernizar es apostar. Con ella, es rutina.
- El código viejo no es malo por viejo: sobrevivió veinte años de negocio real y eso es información.
