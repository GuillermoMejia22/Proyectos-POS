function validarFormulario() {
    let nombre = document.getElementById("nombre").value;
    let apellidos = document.getElementById("apellidos").value;
    let direccion = document.getElementById("direccion").value;
    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;

    if (nombre === '' || apellidos === '' || direccion === '' || correo === '' || telefono === '') {
        alert('Por favor, complete todos los campos del formulario.');
        return false;
    }
    return true;
}

async function eliminarCliente() {
    const formulario = document.getElementById("Formulario")
    const id = formulario.querySelector('[name="id"]').value;
    if (id.trim() === '') {
        alert('Por favor, complete el campo ID');
    } else {
        const resultado = await fetch("/eliminarCliente", {
            body: new URLSearchParams(new FormData(formulario)),
            method: "delete"
        })
        window.location.href = "/listaClientes"
    }
}

async function actualizarCliente() {
    const formulario = document.getElementById("FormularioActualizar")
    const resultado = await fetch("/actualizarCliente", {
        body: new URLSearchParams(new FormData(formulario)),
        method: "post"
    })
    window.location.href = "/listaClientes"
}
