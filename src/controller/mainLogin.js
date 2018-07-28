const buttonRegister = document.getElementById('button-register');
const email = document.getElementById('email');
const nameUser = document.getElementById('nombre');
const password = document.getElementById('password');
const btnFacebook = document.getElementById("facebook");
const btnGoogle = document.getElementById('google');
const registro = document.getElementById('registro');
const buttonSesion = document.getElementById('button-sesion');
const sesion = document.getElementById('sesion');
const formRegistro = document.getElementById('form-registro');
const formSesion = document.getElementById('form-sesion');
const formFooter = document.getElementById('formFooter');

window.onload = () => {
    getDataUserSessionActiveLogin();
    let modal = document.getElementById('miModal');
    modal.classList.remove('modalView');
};

buttonRegister.addEventListener('click', (e) => {
    e.preventDefault();
    validatorEmailAndPassword(email.value, password.value, nameUser.value)
});

btnFacebook.addEventListener('click', () => {
    registerUserFacebook();

});

btnGoogle.addEventListener('click', () => {
    registerUserGmail();
});

registro.addEventListener('click', () => {
    formSesion.style.display = "none";
    formRegistro.style.display = "block";
    formFooter.style.display = "none";
    registro.classList.remove("inactive");
    registro.classList.add("active");
    sesion.classList.remove("active");
    sesion.classList.add("inactive");
});

sesion.addEventListener('click', () => {
    formSesion.style.display = "block";
    formRegistro.style.display = "none";
    formFooter.style.display = "block";
    sesion.classList.remove("inactive");
    sesion.classList.add("active");
    registro.classList.remove("active");
    registro.classList.add("inactive");
});

const recoverPass = () => {
    const auth = firebase.auth();
    const emailAddress = document.getElementById('correo-sesion').value;
    let modal = document.getElementById('miModal');
    let elmet = '';
    modal.classList.add('modalView');
    auth.sendPasswordResetEmail(emailAddress)
        .then((result) => {
            elmet = modalView('Recuperar Contraseña', 'Se ha enviado un correo a su cuenta. SIGA LOS PASOS', 'Aceptar', 'Cerrar');
            modal.innerHTML = elmet;
            let accept = document.getElementById('accept');
            accept.addEventListener('click', () => {
                window.location.href = "https://outlook.live.com/owa/#";
            })
        }).catch(function (error) {
            elmet = modalView('Recuperar Contraseña', 'No se encuentra en nuestros registros', 'Registrarse','Cerrar');
            modal.innerHTML = elmet;
            let register = document.getElementById('accept');
            register.style.display = 'none';
          
        })
};

buttonSesion.addEventListener('click', () => {
    const emailLogin = document.getElementById('correo-sesion');
    const passwordLogin = document.getElementById('password-sesion');
    initSessionFirebase(emailLogin, passwordLogin);
});

document.getElementById('forgot-passw').addEventListener('click', () => {
    recoverPass();
});
