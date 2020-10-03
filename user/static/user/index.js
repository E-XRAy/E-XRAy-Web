///NAVBAR UPDATE
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
//Usser Information
const accountDetails = document.querySelector('.account-details');
const setupNav = (user) => {
    if (user) {
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        // accountDetails.innerHTML = "";
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}

//Home Update
const patient = document.querySelector('#patient');
const doctor = document.querySelector('#doctor');
const radiologist = document.querySelector('#radiologist');
const general = document.querySelector('#general');
const setupHome = (UserType) => {
    if (UserType == 'Radiologist') {
        radiologist.style.display = 'block';
        general.style.display = 'none';
        doctor.style.display = 'none';
        patient.style.display = 'none';
        document.querySelector('#sitehome').innerHTML=UserType+`'s Home`;
    } else if (UserType == 'Patient') {
        radiologist.style.display = 'none';
        general.style.display = 'none';
        doctor.style.display = 'none';
        patient.style.display = 'block';
        document.querySelector('#sitehome').innerHTML=UserType+`'s Home`;
    } else if (UserType == 'Doctor') {
        radiologist.style.display = 'none';
        general.style.display = 'none';
        doctor.style.display = 'block';
        patient.style.display = 'none';
        document.querySelector('#sitehome').innerHTML=UserType+`'s Home`;
    } else{
        radiologist.style.display = 'none';
        general.style.display = 'block';
        doctor.style.display = 'none';
        patient.style.display = 'none';
    }
}
//User Profile

const userDetails = document.querySelector('#userDetails');
const setupProfile = (data) => {
    if (data) {
        const html = `
        <div>User Name: ${data.Name}</div>
        <section id='currentusername' data-id=${data.Name}><section>
        <div><small>Phone: ${data.Phone}</small></div>
        <div><small>Email Id: ${data.Email}</small></div>
        `;
        userDetails.innerHTML = html;
      }else{
        userDetails.innerHTML = '';
      }
    }