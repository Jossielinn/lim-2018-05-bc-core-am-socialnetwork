// "no-unused-vars": "off",
//     "no-use-before-define": "off",
//         "no-undef": "off"
/* global firebase */
window.getDataUserSessionActiveLogin = () => { // observer()
  firebase.auth().onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
      window.directionalUrl('../src/view/wall.html');
    }
  });
};
window.renderModalEmailVerified = (containerModal) => {
  containerModal.innerHTML =
    `
	        <div id="modal-welcome" class="modal">
            <div class="modal-content">
            <div class="modal-header">
                <span id="close-modal-welcome"  class="close">&times;</span>
                <h2> Bienvenido a EDU TIC </h2>
             </div>
           <p class="welcomeUser">¡Hola !</p>
             <div class="modal-body">
             <p>hoola </p>
             </div>
            
        </div>
    </div>`, document.getElementById('close-modal-welcome').addEventListener('click', () => containerModal.innerHTML = '');
};
window.renderModalEmailRepeated = (containerModal) => {
  containerModal.innerHTML =
    `
	        <div id="modal-welcome" class="modal">
            <div class="modal-content">
            <div class="modal-header">
                <span id="close-modal-welcome"  class="close">&times;</span>
                <h2> Bienvenido a EDU TIC </h2>
             </div>
           <p class="welcomeUser">¡Hola !</p>
             <div class="modal-body">
             <p>este correo ya está registrado </p>
             </div>
            
        </div>
    </div>`, document.getElementById('close-modal-welcome').addEventListener('click', () => containerModal.innerHTML = '');
};
/* *******************************************REGISTRO ORDINARIO DEL USUARIO****************************** */
window.registerUserFirebase = (email, password, name, errorName, errorEmail, errorPassword) => {
  // let elmet = ''; // register()
  // let modal = document.getElementById('mi-modal');
  // modal.classList.add('modalView');
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {
      window.sendEmailVerification();
      createUserInBd(result, name);
      window.renderModalEmailVerified(document.getElementById('container-modal'));
      errorName.innerHTML = '';
      errorEmail.innerHTML = '';
      errorPassword.innerHTML = '';
      document.getElementById('form-registro').reset();
    }).catch(() => {
      window.renderModalEmailRepeated(document.getElementById('container-modal'));
      // alert(errorCode, errorMessage);
      // elmet = window.modalView('REGISTRO','La dirección de correo electrónico ya está registrada.','Aceptar','Aceptar')
      // modal.innerHTML = elmet;
      // console.log(elmet);
      // let register = document.getElementById('accept');
      // register.style.display = 'none';
    });
};
/* ***********************************************************Envia correo de confirmación****************************************************************************/
window.sendEmailVerification = () => {
  var actionCodeSettings = {
    url: 'http://127.0.0.1:8887/src/view/wall.html',
    handleCodeInApp: false
  };
  const user = firebase.auth().currentUser;
  user.sendEmailVerification(actionCodeSettings).then(() => {
  }).catch((error) => {
    alert('error', error);
  });
};

/* *******************************FUNCIÓN QUE INVOCA A TODAS LAS VALIDACIONES ANTERIORES******************* */

window.validatorFormRegister = (email, password, name) => {
  const msjErrorName = document.getElementById('msj-error-name');
  const msjErrorEmail = document.getElementById('msj-error-email');
  const msjErrorPassword = document.getElementById('msj-error-password');
  msjErrorName.innerHTML = '';
  msjErrorEmail.innerHTML = '';
  msjErrorPassword.innerHTML = '';
  const validatedPassword = window.validatorPassword(password);
  const validatedEmail = window.validatorEmail(email);
  const validateNameUser = window.validatorNameUser(name);
  if (validatedPassword && validatedEmail && validateNameUser) {
    window.registerUserFirebase(email, password, name, msjErrorName, msjErrorEmail, msjErrorPassword);
    return true;
  } else if (!validateNameUser) {
    msjErrorName.innerHTML = '<em>El nombre de usuario debería tener más de 8 dígitos y solo puede contener letras, números y espacios en blanco</em>';
    return false;
  } else if (!validatedEmail) {
    msjErrorEmail.innerHTML = '<em>Correo invalido</em>';
    return false;
  } else if (!validatedPassword) {
    msjErrorPassword.innerHTML = '<em>La contraseña debe tener más de 8 dígitos y solo puede contener letras y números</em></em>';
    return false;
  }
};
/* *************************************************Registro de datos en BD****************************************************************************/

const createUserInBd = (objectUser, name) => {
  if (!objectUser.user.displayName) {
    firebase.database().ref('users/' + objectUser.user.uid).set({
      userId: objectUser.user.uid,
      userName: name,
      userEmail: objectUser.user.email,
      isNewUser: objectUser.additionalUserInfo.isNewUser,
      providerId: objectUser.additionalUserInfo.providerId,
      emailVerified: objectUser.user.emailVerified
    });
  } else {
    firebase.database().ref('users/' + objectUser.user.uid).set({
      userId: objectUser.user.uid,
      userName: objectUser.user.displayName,
      userEmail: objectUser.user.email,
      isNewUser: objectUser.additionalUserInfo.isNewUser,
      userPhotoUrl: objectUser.user.photoURL,
      providerId: objectUser.additionalUserInfo.providerId
    }).then(() => {
      window.directionalUrl('../src/view/wall.html');
    });
  }
  return objectUser;
};
/* *********************************************Registro con Facebook******************************** */
window.registerUserFacebook = () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then((result) => {
    if (result.additionalUserInfo.isNewUser) {
      createUserInBd(result, name);
    } else {
      window.directionalUrl('../src/view/wall.html');
    }
  }).catch((error) => {
    alert(error);
  });
};
/* ****************************************Registro con Gmail******************************* */
window.registerUserGmail = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then((result) => {
    if (result.additionalUserInfo.isNewUser) {
      createUserInBd(result, name);
    } else {
      alert('condicional');
      window.directionalUrl('../src/view/wall.html');
    }
  }).catch((error) => {
    alert('error', error);
  });
};
window.initSessionFirebase = (emailLogin, passwordLogin) => {
  firebase.auth().signInWithEmailAndPassword(emailLogin.value, passwordLogin.value).then(() => {
    document.getElementById('form-sesion').reset();
    document.getElementById('div-label-msj-error-password-login').innerHTML = '';
  }).catch(() => {
    document.getElementById('div-label-msj-error-password-login').innerHTML = '<em>Asegurate que el correo y contraseña sean correctos.</em>';
  });
};

/* ViewModal*/
window.modalView = (reftexto, text, btn1, btn2) => {
  return `
    <div class="modal-contentView">
      <a href="#modal-close" title="Cerrar" id="close" class="modal-close">Cerrar</a>
      <h2 id="txtTitle">${reftexto}</h2>
      <p>${text}</p>
        <button id="accept" class="btnmodal">${btn1}</button>
        <a href="#modal-close" title="${btn2}"><button class="btnmodal" id="close">${btn2}</button></a>
    </div>
  `;
};

/* Recuperar contraseña */
window.recoverPassword = () => {
  const auth = firebase.auth();
  const emailAddress = document.getElementById('email-session').value;
  let modal = document.getElementById('mi-modal');
  let elmet = '';
  modal.classList.add('modalView');
  auth.sendPasswordResetEmail(emailAddress)
    .then(() => {
      elmet = window.modalView('Recuperar Contraseña', 'Se ha enviado un correo a su cuenta. SIGA LOS PASOS', 'Aceptar', 'Cerrar');
      modal.innerHTML = elmet;
      let accept = document.getElementById('accept');
      accept.addEventListener('click', () => {
        window.location.href = 'https://outlook.live.com/owa/#';
      });
    }).catch(() =>{
      elmet = window.modalView('Recuperar Contraseña', 'No se encuentra en nuestros registros', 'Registrarse', 'Cerrar');
      modal.innerHTML = elmet;
      let register = document.getElementById('accept');
      register.style.display = 'none';
    });
};
