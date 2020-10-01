//Login
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    console.log(email);
    const password = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        console.log(cred.user);
        const modal = document.querySelector('#modal-login');
        loginForm.reset();
        $('#loginModal').modal('hide');
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
})

//Sign Up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm['signup-email'].value;
    const passwd1 = signupForm['signup-password'].value;
    const passwd2 = signupForm['signup-password2'].value;
    const desid = signupForm['signup-designid'].value;
    const phno = signupForm['signup-phoneno'].value;
    const usrname = signupForm['signup-username'].value;
    const usrtype = signupForm['signup-usertype'].value;
    


    if (passwd1 == passwd2) {
        auth.createUserWithEmailAndPassword(email, passwd2).then(cred => {
            return db.collection('Users').doc(cred.user.email).set({
                UserType: usrtype,
                Email: email,
                Phone: phno,
                Name: usrname,
                userId: desid,
            });
        }).then(() => {
            signupForm.reset();
            $('#signupModal').modal('hide');
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    } else {
        alert("Passwords don't match");
    }
})

//Log Out
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(function () {
        console.log("user signed out");
    }).catch(function (error) {
        console.log("error during sign out");
    });
})


///listen to auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in :', user.uid);
        //getting data
        setupNav(user);
        db.collection('Users').doc(auth.currentUser.email).get().then((snapshot) => {
            console.log(snapshot.data());
            setupProfile(snapshot.data());
            setupHome(snapshot.data().UserType);
            
        });
        document.querySelectorAll('#output').forEach(item => {
            item.setAttribute('src', '');
            item.setAttribute('data-id', '');
            item.style.display = 'none';
        });
        var userfiles = db.collection('Files').doc(auth.currentUser.email);
        userfiles.collection('files').onSnapshot((snapshot) => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added') {
                    //console.log(change.doc.data());
                   FileListGen(change.doc);
                   // PatientFileListGen(change.doc.data());
                    // RadioFileListGen(change.doc.data());
                }
            });
        })

    } else {
        setupHome();
        setupNav();
        setupProfile();
    }
});
const FileListGen = (doc) => {
    if (doc.data()) {
        console.log(doc.data());
        const html =
            `<div class="card mt-1" style="border-radius: 10px;">
                <div class="card-title pl-5 pt-1" aria-expanded="true" aria-controls="demo"
                                    data-target="#${doc.id}" data-toggle="collapse">${doc.data().filename}
                    </div>
                <div id="${doc.id}" class="collapse card-body">${doc.data().content}
                <button class="float-right btn btn-primary" onclick="docselectFile(this,'${doc.id}')">view</button>
                <div class="btn btn-primary" onclick="docselectdicomFile(this,${doc.id})">view(DICOM)</div>
                </div>
            </div>`
        db.collection('Users').doc(auth.currentUser.email).get().then((snapshot) => {
            if (snapshot.data().UserType == 'Radiologist') {
                radiofileList.innerHTML = radiofileList.innerHTML + html;
            } else if (snapshot.data().UserType == 'Patient') {
                patientfileList.innerHTML = patientfileList.innerHTML + html;
            } else if (snapshot.data().UserType == 'Doctor') {
                doctorfileList.innerHTML = doctorfileList.innerHTML + html;
            }
        });
        
    } else {
        doctorfileList.innerHTML = '';
        patientfileList.innerHTML = '';
        radiofileList.innerHTML = '';
    }
}

function docselectFile(self, id) {
    console.log(id);
    var userfiles = db.collection('Files').doc(auth.currentUser.email);
        userfiles.collection('files').doc(id).get().then(doc=>{
            console.log(doc.data());
            document.querySelectorAll('#output').forEach(item => {
                item.setAttribute('src', doc.data().url);
                item.setAttribute('data-id', id);
                item.style.display = 'block';
            });
        })
}