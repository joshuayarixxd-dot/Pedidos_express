let tipoActualWa = 'pedidos';

function iniciarTutorialWhatsApp(tipo) {
    tipoActualWa = tipo;
    cambiarPasoWa(1);
    document.getElementById('modal-tutorial-wa').style.display = 'block';
}
function cambiarPasoWa(numPaso) {
    document.getElementById('paso-wa-1').style.display = numPaso === 1 ? 'block' : 'none';
    document.getElementById('paso-wa-2').style.display = numPaso === 2 ? 'block' : 'none';
    document.getElementById('paso-wa-3').style.display = numPaso === 3 ? 'block' : 'none';
    document.getElementById('paso-wa-4').style.display = numPaso === 4 ? 'block' : 'none';
}
function cerrarTutorialWa() { document.getElementById('modal-tutorial-wa').style.display = 'none'; }
function ejecutarEnvioRealWhatsApp() {
    cerrarTutorialWa();
    procesarImagen(tipoActualWa, 'compartir');
}

/* --- FUNCIONES DE HISTORIAL --- */
function abrirHistorial() { renderizarHistorialEnModal(); document.getElementById('modal-historial').style.display = 'block'; }
function cerrarHistorial() { document.getElementById('modal-historial').style.display = 'none'; }
function cerrarHistorialFuera(event) { if (event.target.id === 'modal-historial') cerrarHistorial(); }

function guardarEnHistorial(tipo, totalCajas, totalDinero) {
    let historial = JSON.parse(localStorage.getItem('coyotes_historial')) || [];
    let nuevoRegistro = {
        fecha: new Date().toLocaleString(),
        tipo: tipo.toUpperCase(),
        cajas: totalCajas,
        total: totalDinero
    };
    historial.unshift(nuevoRegistro);
    localStorage.setItem('coyotes_historial', JSON.stringify(historial));
}

function renderizarHistorialEnModal() {
    const contenedor = document.getElementById('lista-historial-contenido');
    let historial = JSON.parse(localStorage.getItem('coyotes_historial')) || [];
    if (historial.length === 0) {
        contenedor.innerHTML = "<p style='text-align:center; color:#777;'>No hay registros guardados todavía.</p>";
        return;
    }
    let html = "";
    historial.forEach((item, index) => {
        html += `<div style="border-bottom: 1px dashed #ccc; padding: 8px 0;">
            <b>#${index + 1} - ${item.tipo}</b><br>
            📅 Fecha: ${item.fecha}<br>
            📦 Unidades/Cajas: ${item.cajas} | 💰 Total: $${item.total}
        </div>`;
    });
    contenedor.innerHTML = html;
}

function limpiarHistorial() {
    if (confirm("¿Deseas vaciar todo el historial de respaldos?")) {
        localStorage.removeItem('coyotes_historial');
        renderizarHistorialEnModal();
    }
}

/* --- SISTEMA DE LICENCIAS --- */
function obtenerIdDispositivo() {
    let idUnico = localStorage.getItem('coyote_device_id');
    if (!idUnico) { idUnico = 'CYT-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000); localStorage.setItem('coyote_device_id', idUnico); }
    return idUnico;
}
function generarLlaveMaestraParaId(idDev) { return "KEY-" + idDev.replace(/\D/g, '').split('').reverse().join('') + "-2026"; }
window.onload = function() { document.getElementById('lbl-id-equipo').innerText = obtenerIdDispositivo(); };
function toggleContrasena() { const i = document.getElementById("password"); i.type = i.type === "password" ? "text" : "password"; }

function activarDispositivoCliente() {
    if (document.getElementById('input-clave-activacion').value.trim() === generarLlaveMaestraParaId(obtenerIdDispositivo())) {
        localStorage.setItem('licencia_coyotes_activa', 'true'); alert("🎉 ¡DISPOSITIVO ACTIVADO CON ÉXITO!");
        document.getElementById('input-clave-activacion').value = "";
    } else { alert("❌ Llave incorrecta."); }
}

let intentosFallidos = 0;
function verificarLogin() {
    const user = document.getElementById('username').value.trim().toLowerCase();
    const pass = document.getElementById('password').value.trim().toLowerCase();
    const estaActivado = localStorage.getItem('licencia_coyotes_activa');

    if (user === "administrador" && pass === "azul123") {
        alert(`Llave de activación:\n👉 ${generarLlaveMaestraParaId(obtenerIdDispositivo())}`);
        localStorage.setItem('licencia_coyotes_activa', 'true');
        ingresarApp(); return;
    }
    if (estaActivado !== 'true') { alert("⛔ DISPOSITIVO NO ACTIVADO ⛔"); return; }
    if (user === "juan" && pass === "coyotes juan") { ingresarApp(); } 
    else {
        intentosFallidos++;
        if (intentosFallidos >= 3) { alert("Demasiados intentos. 3113740597 solo whatsapp."); } 
        else { alert("❌ Usuario o contraseña incorrecta."); }
    }
}
function ingresarApp(nombrePersonalizado) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
    
    let nombreMostrar = nombrePersonalizado || "JUAN CHÁVEZ ROBLES";
    if (document.getElementById('lbl-usuario-ped')) document.getElementById('lbl-usuario-ped').innerText = nombreMostrar;
    if (document.getElementById('lbl-usuario-dev')) document.getElementById('lbl-usuario-dev').innerText = nombreMostrar;

    renderizarTabla('pedidos'); renderizarTabla('devoluciones');
}

function cambiarPestana(tab) {
    document.getElementById('seccion-pedidos').classList.remove('activa'); document.getElementById('seccion-devoluciones').classList.remove('activa');
    document.getElementById('btn-tab-pedidos').classList.remove('activa'); document.getElementById('btn-tab-devoluciones').classList.remove('activa');
    document.getElementById('seccion-' + tab).classList.add('activa'); document.getElementById('btn-tab-' + tab).classList.add('activa');
    window.scrollTo(0, 0);
}

function filtrarTabla(inputId, tbodyId) {
    const texto = document.getElementById(inputId).value.toLowerCase();
    const filas = document.getElementById(tbodyId).getElementsByTagName('tr');
    for (let i = 0; i < filas.length; i++) {
        const nombreProducto = filas[i].getElementsByTagName('td')[1].innerText.toLowerCase();
        filas[i].style.display = (nombreProducto.indexOf(texto) > -1) ? "" : "none";
    }
}

/* --- BASES DE DATOS --- */
let datosPedidos = [
    { id: 1, nombre: "ADOBADA 80", precio: 800 }, { id: 2, nombre: "RAYADA 80", precio: 800 },
    { id: 3, nombre: "FUEGO 80", precio: 800 }, { id: 4, nombre: "HABANERA 80", precio: 800 },
    { id: 5, nombre: "PAPA TUBO 80G - SAL", precio: 800 }, { id: 6, nombre: "PAPATUBO JALAPENO 80", precio: 800 },
    { id: 7, nombre: "PAPA TAPATIA 55", precio: 720 }, { id: 8, nombre: "PAPA ADOBADA 55G", precio: 720 },
    { id: 9, nombre: "PAPA RAYADITA 55", precio: 720 }, { id: 10, nombre: "FUEGO 55G", precio: 720 },
    { id: 11, nombre: "PAPA HABANERA 55", precio: 720 }, { id: 12, nombre: "PAPA TAPATIA 30G", precio: 640 },
    { id: 13, nombre: "PAPA ADOBADA 30G", precio: 640 }, { id: 14, nombre: "PAPA PAPATIAS FUEGO 30G", precio: 640 },
    { id: 15, nombre: "PAPA RAYADITA 30G", precio: 640 }, { id: 16, nombre: "PAPA HABANERA 30G", precio: 640 },
    { id: 17, nombre: "PAPA SALSA NEGRA 30G", precio: 640 }, { id: 18, nombre: "BOTANAZO XTREMO 75G", precio: 300 },
    { id: 19, nombre: "RELINCHIDOS 75G", precio: 300 }, { id: 20, nombre: "BOTANAZO 75G", precio: 300 },
    { id: 21, nombre: "BOTANONON FUEGO 60G", precio: 300 }, { id: 22, nombre: "RELINCHIDOS 400G", precio: 225 },
    { id: 23, nombre: "CARRETONES 400G", precio: 225 }, { id: 24, nombre: "CARRETONES 75G", precio: 300 },
    { id: 25, nombre: "NACHO DE 80", precio: 720 }, { id: 26, nombre: "VAQUERITOS 80", precio: 720 },
    { id: 27, nombre: "CHAPETONES FULMINANTES 50G", precio: 640 }, { id: 28, nombre: "CHAPETONES QUESO 50G", precio: 640 },
    { id: 29, nombre: "CHAPETONES JALAPENOS 50G", precio: 640 }, { id: 30, nombre: "NACHO EL REPARO 40G", precio: 640 },
    { id: 31, nombre: "TROTECITO SALSA VERDE 40G", precio: 640 }, { id: 32, nombre: "VAQUERITOS 40G", precio: 640 },
    { id: 33, nombre: "TRONKIS MOLCAJETEADO 60G", precio: 640 }, { id: 34, nombre: "TRONKIS ARREBATADO 60G", precio: 640 },
    { id: 35, nombre: "CACHORRITOS 60G", precio: 640 }, { id: 36, nombre: "ESPUEJITAS 60G", precio: 640 },
    { id: 37, nombre: "CORREONES 60G", precio: 640 }, { id: 38, nombre: "TRONKIS AREBATADOS 30G", precio: 560 },
    { id: 39, nombre: "TROTECITO 32G", precio: 400 }, { id: 40, nombre: "CACHORRITOS 35", precio: 560 },
    { id: 42, nombre: "PALOMITAS CHILE Y LIMON 29G", precio: 1120 }, { id: 43, nombre: "PALOMITAS DE QUESO 29G", precio: 1120 },
    { id: 44, nombre: "PAPA ADOBADA 500G", precio: 960 }, { id: 45, nombre: "PAPA TAPATIA 500G", precio: 960 },
    { id: 46, nombre: "BUFALO", precio: 640 }, { id: 47, nombre: "NACHO DE 32", precio: 400 },
    { id: 48, nombre: "CHICHARRON DE CERDO 58G", precio: 560 }, { id: 49, nombre: "SALSA NEGRA 55G", precio: 720 },
    { id: 50, nombre: "TROTECITO SALSA VERDE 80G", precio: 720 }, { id: 51, nombre: "AROS DE CEBOLLA", precio: 560 },
    { id: 52, nombre: "BALONAZOO BALON", precio: 160 }, { id: 53, nombre: "BALONAZOO CUADRO", precio: 160 },
    { id: 54, nombre: "BALONAZOO CANCHA", precio: 160 }, { id: 56, nombre: "PAPA QUEMADITA 80G", precio: 200 },
    { id: 57, nombre: "PALOMITAS DE QUESO 18G", precio: 640 }, { id: 58, nombre: "PALOMITAS CHILE Y LIMON 18G", precio: 640 }
];

let datosDevoluciones = [
    { id: 1, nombre: "PAPA TAPATIA 1/2 Kilo", precio: 80 }, { id: 2, nombre: "PAPA ADOBADA 1/2 Kilo", precio: 80 },
    { id: 3, nombre: "PAPA RAYADITA QUESO 1/2 Kilo", precio: 80 }, { id: 4, nombre: "PAPA RAYADITA 80 gr", precio: 16 },
    { id: 5, nombre: "PAPA ADOBADA 80 gr", precio: 16 }, { id: 6, nombre: "PAPA CASERA JALAPENO 80 gr", precio: 16 },
    { id: 7, nombre: "PAPA CASERA NATURAL 80 gr", precio: 16 }, { id: 8, nombre: "PAPA CASERA FUEGO 80 gr", precio: 16 },
    { id: 9, nombre: "PAPA HABANERA 80 gr", precio: 16 }, { id: 10, nombre: "PAPA TAPATIAS 55 gr", precio: 12 },
    { id: 11, nombre: "PAPA ADOBADAS 55 gr", precio: 12 }, { id: 12, nombre: "PAPA RAYADITAS 55 gr", precio: 12 },
    { id: 13, nombre: "PAPA HABANERAS 55 gr", precio: 12 }, { id: 14, nombre: "PAPA PAPATIAS FUEGO 55 gr", precio: 12 },
    { id: 15, nombre: "PAPA SALSA NEGRA 55 gr", precio: 12 }, { id: 16, nombre: "PAPA TAPATIA 30 gr", precio: 8 },
    { id: 17, nombre: "PAPA ADOBADA 30 gr", precio: 8 }, { id: 18, nombre: "PAPA RAYADITA 30 gr", precio: 8 },
    { id: 19, nombre: "PAPA BUFFALO 30 gr", precio: 8 }, { id: 20, nombre: "PAPA HABANERA 30 gr", precio: 8 },
    { id: 21, nombre: "PAPA PAPATIAS 30 gr", precio: 8 }, { id: 22, nombre: "PAPA SALSA NEGRA 30 gr", precio: 8 },
    { id: 23, nombre: "CHICHARRON DE CERDO 100 GR", precio: 22 }, { id: 24, nombre: "CHICHARRON DE CERDO 58 GR", precio: 16 },
    { id: 25, nombre: "RELIN-CHIDOS 400 GR", precio: 25 }, { id: 26, nombre: "CARRETONES 400 GR", precio: 25 },
    { id: 27, nombre: "RELIN-CHIDOS 75 GR", precio: 12 }, { id: 28, nombre: "BOTANAZO 75", precio: 12 },
    { id: 29, nombre: "BOTANONON 60 GR", precio: 12 }, { id: 30, nombre: "CARRETONES 75 GR", precio: 12 },
    { id: 31, nombre: "BOTANONON 42 GR", precio: 12 }, { id: 32, nombre: "SOGUITAS 30 GR", precio: 8 },
    { id: 33, nombre: "LAGRIMITAS 30 GR.", precio: 8 }, { id: 34, nombre: "TOSTADAS ARANDENAS 300 GR", precio: 20 },
    { id: 35, nombre: "NACHOS 500 GR", precio: 80 }, { id: 36, nombre: "NACHOS 80 GR", precio: 12 },
    { id: 37, nombre: "TROTITOS SALSA VERDE 80 GR", precio: 12 }, { id: 38, nombre: "VAQUERITOS 80 GR", precio: 12 },
    { id: 39, nombre: "CHAPETONES FULMINANTES 50 GR", precio: 8 }, { id: 40, nombre: "CHAPETONES QUESO 50 GR", precio: 8 },
    { id: 41, nombre: "CHAPETONES JALAPENO 50 GR", precio: 8 }, { id: 42, nombre: "NACHOS EL REPARO 40 GR", precio: 8 },
    { id: 43, nombre: "TROTITOS SALSA VERDE 40 GR", precio: 8 }, { id: 44, nombre: "VAQUERITOS 40 GR", precio: 8 },
    { id: 45, nombre: "CACHORRITOS 60 GR", precio: 8 }, { id: 46, nombre: "ESPUELITAS 60 GR", precio: 8 },
    { id: 47, nombre: "CORREONES 60 GR", precio: 8 }, { id: 48, nombre: "TRONKIS ARREBATADO 60 GR", precio: 8 },
    { id: 49, nombre: "TRONKIS MOLCAJETEADO 60 GR", precio: 8 }, { id: 50, nombre: "PALOMITAS DE MAIZ QUESO CHEDDAR 29 GR", precio: 8 },
    { id: 51, nombre: "PALOMITAS DE MAIZ CHILE Y LIMON 29 GR", precio: 8 }, { id: 52, nombre: "CACHORRITOS 35 GR", precio: 4 },
    { id: 53, nombre: "COYOTITOS AROS DE CEBOLLA 20 GR", precio: 4 }, { id: 54, nombre: "TRONKIS ARREBATADO 30 GR", precio: 4 },
    { id: 55, nombre: "TROTECITOS SALSA VERDE 32 GR", precio: 4 }, { id: 56, nombre: "NACHOS EL REPARO 32 GR", precio: 4 },
    { id: 57, nombre: "BOLIBOYS EL COYOTIN COMBINADO", precio: 4 }
];

const formatearDinero = (cantidad) => {
    return cantidad % 1 === 0 ? cantidad.toLocaleString('en-US') : cantidad.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
};

function renderizarTabla(tipo) {
    const arrDatos = tipo === 'pedidos' ? datosPedidos : datosDevoluciones;
    const tbodyId = tipo === 'pedidos' ? 'list-pedidos' : 'list-devoluciones';
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = ''; 

    arrDatos.forEach((producto) => {
        const tr = document.createElement('tr');
        tr.id = `fila-${tipo}-${producto.id}`;
        tr.innerHTML = `
            <td class="col-num">${producto.id}</td>
            <td class="col-prod">${producto.nombre}</td>
            <td class="col-cajas"><input type="number" id="cant-${tipo}-${producto.id}" min="0" value="" oninput="calcularFila('${tipo}', ${producto.id}, ${producto.precio})"></td>
            <td class="col-precio">${producto.precio}</td>
            <td class="col-total" id="totalFila-${tipo}-${producto.id}"></td>
        `;
        tbody.appendChild(tr);
    });
}

function agregarNuevoProducto(tipo) {
    const arrDatos = tipo === 'pedidos' ? datosPedidos : datosDevoluciones;
    const tituloTipo = tipo === 'pedidos' ? 'PEDIDOS' : 'DEVOLUCIONES';
    
    const nombreNuevo = prompt(`🟢 AGREGAR PRODUCTO A ${tituloTipo}\n\nNombre del producto:`);
    if(!nombreNuevo) return;
    const precioNuevo = prompt(`🟢 PRECIO\n\nIngresa el PRECIO (solo números):`);
    if(!precioNuevo || isNaN(precioNuevo)) { alert("❌ Precio inválido."); return; }

    const nuevoId = arrDatos.length > 0 ? arrDatos[arrDatos.length - 1].id + 1 : 1;
    arrDatos.push({ id: nuevoId, nombre: nombreNuevo.toUpperCase(), precio: parseFloat(precioNuevo) });
    renderizarTabla(tipo); 
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function calcularFila(tipo, idProducto, precio) {
    const input = document.getElementById(`cant-${tipo}-${idProducto}`);
    const cantidad = parseInt(input.value);
    const fila = document.getElementById(`fila-${tipo}-${idProducto}`);
    const tdTotal = document.getElementById(`totalFila-${tipo}-${idProducto}`);

    if (!isNaN(cantidad) && cantidad > 0) {
        tdTotal.innerText = formatearDinero(cantidad * precio);
        fila.classList.add('fila-seleccionada');
    } else {
        tdTotal.innerText = "";
        fila.classList.remove('fila-seleccionada');
    }
    calcularTotales(tipo);
}

function calcularTotales(tipo) {
    const arrDatos = tipo === 'pedidos' ? datosPedidos : datosDevoluciones;
    let totalDinero = 0, totalCant = 0;
    
    arrDatos.forEach(producto => {
        const cantidad = parseInt(document.getElementById(`cant-${tipo}-${producto.id}`).value);
        if(!isNaN(cantidad) && cantidad > 0) {
            totalCant += cantidad;
            totalDinero += cantidad * producto.precio;
        }
    });

    if (tipo === 'pedidos') {
        document.getElementById('tot-cajas-ped').innerText = totalCant;
        document.getElementById('tot-dinero-ped').innerText = formatearDinero(totalDinero);
        if(document.getElementById('tot-cajas-ped-arriba')) {
            document.getElementById('tot-cajas-ped-arriba').innerText = totalCant;
            document.getElementById('tot-dinero-ped-arriba').innerText = formatearDinero(totalDinero);
        }
        if(document.getElementById('tot-cajas-ped-abajo')) {
            document.getElementById('tot-cajas-ped-abajo').innerText = totalCant;
            document.getElementById('tot-dinero-ped-abajo').innerText = formatearDinero(totalDinero);
        }
    } else {
        document.getElementById('tot-cajas-dev').innerText = totalCant;
        document.getElementById('tot-dinero-dev').innerText = formatearDinero(totalDinero);
        if(document.getElementById('tot-cajas-dev-abajo')) {
            document.getElementById('tot-cajas-dev-abajo').innerText = totalCant;
            document.getElementById('tot-dinero-dev-abajo').innerText = formatearDinero(totalDinero);
        }
    }
}

/* =======================================================
   MOTOR DE IMAGEN (480PX TICKET EN PEDIDOS / 850PX EN DEVOLUCIONES)
======================================================== */
function procesarImagen(tipo, accion) {
    const divId = tipo === 'pedidos' ? 'hoja-pedidos' : 'hoja-devoluciones';
    const elemento = document.getElementById(divId);

    const totalCajas = document.getElementById(tipo === 'pedidos' ? 'tot-cajas-ped' : 'tot-cajas-dev').innerText;
    const totalDinero = document.getElementById(tipo === 'pedidos' ? 'tot-dinero-ped' : 'tot-dinero-dev').innerText;
    guardarEnHistorial(tipo, totalCajas, totalDinero);

    const inputSemanaId = tipo === 'pedidos' ? 'input-semana-ped' : 'input-semana-dev';
    let inputSemanaOriginal = document.getElementById(inputSemanaId);
    let semanaParent = null;
    let semanaVal = "";

    if (inputSemanaOriginal) {
        semanaVal = inputSemanaOriginal.value;
        semanaParent = inputSemanaOriginal.parentElement;
        semanaParent.innerHTML = `<span style="margin-right: 6px; font-size: 11px; font-weight: 900; color: #000;">SEMANA:</span><div style="display:inline-block; min-width:100px; padding:3px 6px; border:2px solid #000; border-radius:4px; background-color:#fffde7; font-size:11px; font-weight:900; text-align:center; color:#000;">${semanaVal || '&nbsp;'}</div>`;
    }

    const inputs = elemento.querySelectorAll('input[type="number"]');
    const originalesInputs = [];
    const fontSizeDato = tipo === 'pedidos' ? '11.5px' : '13px';
    
    inputs.forEach(input => {
        const val = input.value;
        const parent = input.parentElement;
        originalesInputs.push({ el: input, val: val, parent: parent });
        
        if(val && parseInt(val) > 0) {
            parent.innerHTML = `<div style="font-size:${fontSizeDato}; font-weight:900; text-align:center; color:#000;">${val}</div>`;
        } else {
            parent.innerHTML = `<div style="font-size:${fontSizeDato}; font-weight:900; text-align:center; color:transparent;">-</div>`;
        }
    });

    const notasArea = elemento.querySelector('.notas-area');
    const textarea = notasArea.querySelector('textarea');
    const valorNotas = textarea.value;
    const contenidoOriginalNotas = notasArea.innerHTML;
    
    if (valorNotas.trim() !== '') {
        notasArea.innerHTML = `<div class="notas-renderizadas">${valorNotas}</div>`;
    } else {
        notasArea.style.display = 'none';
    }

    const originalWidth = elemento.style.width;
    const originalMaxWidth = elemento.style.maxWidth;
    const originalMargin = elemento.style.margin;

    // Ancho tipo ticket (480px) solo para Pedidos; Devoluciones intacto (850px)
    const anchoCaptura = tipo === 'pedidos' ? 480 : 850;
    if (tipo === 'pedidos') {
        elemento.classList.add('modo-ticket');
    }
    elemento.style.width = anchoCaptura + 'px';
    elemento.style.maxWidth = anchoCaptura + 'px';
    elemento.style.margin = '0';
    elemento.style.fontFamily = 'Arial, Helvetica, sans-serif';

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const nombreArchivo = tipo === 'pedidos' ? `Pedido_Coyotes_${dia}-${mes}.png` : `Devoluciones_Coyotes_${dia}-${mes}.png`;

    const restaurar = () => {
        elemento.classList.remove('modo-ticket');
        elemento.style.width = originalWidth;
        elemento.style.maxWidth = originalMaxWidth;
        elemento.style.margin = originalMargin;
        
        if (semanaParent && inputSemanaOriginal) {
            semanaParent.innerHTML = '';
            inputSemanaOriginal.value = semanaVal;
            const lbl = document.createElement('span');
            lbl.style.cssText = 'margin-right: 6px; font-size: 11px; font-weight: 900; color: #000;';
            lbl.innerText = 'SEMANA:';
            semanaParent.appendChild(lbl);
            semanaParent.appendChild(inputSemanaOriginal);
        }

        originalesInputs.forEach(item => {
            item.parent.innerHTML = '';
            item.el.value = item.val;
            item.parent.appendChild(item.el);
        });

        notasArea.style.display = '';
        notasArea.innerHTML = contenidoOriginalNotas;
        notasArea.querySelector('textarea').value = valorNotas;
    };

    html2canvas(elemento, { 
        scale: 3, 
        useCORS: true, 
        scrollX: 0,
        scrollY: 0, 
        backgroundColor: '#ffffff',
        width: anchoCaptura,
        windowWidth: anchoCaptura,
        logging: false
    }).then(canvas => {
        canvas.toBlob(function(blob) {
            restaurar();
            const archivoImg = new File([blob], nombreArchivo, { type: 'image/png' });

            if (accion === 'compartir' && navigator.canShare && navigator.canShare({ files: [archivoImg] })) {
                navigator.share({
                    title: `Sistema Coyotes - ${tipo.toUpperCase()}`,
                    text: 'Adjunto el formato generado:',
                    files: [archivoImg]
                }).catch(e => console.log('Error al compartir', e));
            } else {
                const enlace = document.createElement('a');
                enlace.href = URL.createObjectURL(blob);
                enlace.download = nombreArchivo;
                enlace.click();
            }
        }, 'image/png', 1.0);
    }).catch(err => {
        restaurar();
        alert("Hubo un error al generar la imagen.");
        console.log(err);
    });
}

/* =======================================================
   MOTOR DE PDF (850PX)
======================================================== */
function procesarPDF(tipo, accion) {
    const divId = tipo === 'pedidos' ? 'hoja-pedidos' : 'hoja-devoluciones';
    const elemento = document.getElementById(divId);
    
    const totalCajas = document.getElementById(tipo === 'pedidos' ? 'tot-cajas-ped' : 'tot-cajas-dev').innerText;
    const totalDinero = document.getElementById(tipo === 'pedidos' ? 'tot-dinero-ped' : 'tot-dinero-dev').innerText;
    guardarEnHistorial(tipo, totalCajas, totalDinero);

    const inputs = elemento.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        if(input.value && parseInt(input.value) > 0) {
            input.setAttribute('value', input.value);
            input.style.border = 'none';
            input.style.backgroundColor = 'transparent';
            input.style.color = '#000';
        }
    });

    const notasArea = elemento.querySelector('.notas-area');
    const textarea = notasArea.querySelector('textarea');
    const valorNotas = textarea.value;
    const contenidoOriginalNotas = notasArea.innerHTML;
    
    if (valorNotas.trim() !== '') {
        notasArea.innerHTML = `<div class="notas-renderizadas">${valorNotas}</div>`;
    } else {
        notasArea.style.display = 'none';
    }

    const originalWidth = elemento.style.width;
    const originalMaxWidth = elemento.style.maxWidth;
    elemento.style.width = '850px';
    elemento.style.maxWidth = '850px';

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const nombreArchivo = tipo === 'pedidos' ? `Pedido_Completo_${dia}-${mes}.pdf` : `Devoluciones_Completo_${dia}-${mes}.pdf`;

    const altoTotalPx = elemento.offsetHeight;
    const altoPulgadas = (altoTotalPx + 40) / 96;

    const opciones = {
        margin: 0.1,
        filename: nombreArchivo,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'in', format: [10, altoPulgadas > 14 ? altoPulgadas : 14], orientation: 'portrait' }
    };

    const restaurar = () => {
        elemento.style.width = originalWidth;
        elemento.style.maxWidth = originalMaxWidth;

        inputs.forEach(input => {
            input.style.border = '1px solid transparent';
            input.style.backgroundColor = 'transparent';
        });

        notasArea.style.display = '';
        notasArea.innerHTML = contenidoOriginalNotas;
        notasArea.querySelector('textarea').value = valorNotas;
    };

    html2pdf().set(opciones).from(elemento).save().then(restaurar).catch(restaurar);
}