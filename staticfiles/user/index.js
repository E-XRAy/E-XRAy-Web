///NAVBAR UPDATE
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
//Usser Information
const accountDetails = document.querySelector('.account-details');
const setupNav = (user) => {
    if (user) {
        /*db.collection('users').doc(user.uid).get().then(doc => {
          const html = `
          <div>Logged In as ${user.email}</div>
          <div>${doc.data().bio}</div>
          `;
          accountDetails.innerHTML = html;
    
        }).catch(function (error) {
          console.log("scene");
        });
        */
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
    } else if (UserType == 'Patient') {
        radiologist.style.display = 'none';
        general.style.display = 'none';
        doctor.style.display = 'none';
        patient.style.display = 'block';
    } else if (UserType == 'Doctor') {
        radiologist.style.display = 'none';
        general.style.display = 'none';
        doctor.style.display = 'block';
        patient.style.display = 'none';
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
        <div>User Name:${data.UserName}</div>
        <div><small>Phone:${data.PhoneNumber}</small></div>
        <div><small>Email Id:${data.EmailId}</small></div>
        <div><small>Designation Id:${data.DesId}</small></div>
        <div><small>Address:${data.Address}</small></div>
        `;
        userDetails.innerHTML = html;
      }else{
        userDetails.innerHTML = '';
      }
    }