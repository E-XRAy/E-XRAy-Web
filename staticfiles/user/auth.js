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
    const address = signupForm['signup-address'].value;


    if (passwd1 == passwd2) {
        auth.createUserWithEmailAndPassword(email, passwd2).then(cred => {
            return db.collection('users').doc(cred.user.uid).set({
                UserType: usrtype,
                EmailId: email,
                PhoneNumber: phno,
                UserName: usrname,
                DesId: desid,
                Address:address
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
        PatientFileListGen();
        RadioFileListGen();
        DoctorFileListGen();
        console.log('user logged in :', user.uid);
        //getting data
        setupNav(user);
        db.collection('users').doc(user.uid).get().then((snapshot) => {
            setupProfile(snapshot.data());
            setupHome(snapshot.data().UserType);
        });
        db.collection('file').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.doc.data().RadiologistId == user.uid) {
                    if (change.type == 'added') {
                        console.log(change.doc.data());
                        RadioFileListGen(change.doc);
                    }
                }else if (change.doc.data().PatientId == user.uid) {
                    if (change.type == 'added') {
                        console.log(change.doc.data());
                        PatientFileListGen(change.doc);
                    }
                }else if (change.doc.data().DocList.includes(auth.currentUser.uid)) {
                    if (change.type == 'added') {
                        DoctorFileListGen(change.doc);
                    }
                }
        
            })
        }),function (error) {
            console.log(error.message);
        };
    } else {
        setupHome();
        setupNav();
        setupProfile();
    }
});
