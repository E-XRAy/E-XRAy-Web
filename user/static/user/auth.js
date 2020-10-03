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
        location.reload();
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
                <div class="btn btn-primary" onclick="selectdicomFile(this,'${doc.id}')">view(DICOM)</div>
                </div>
            </div>`
        db.collection('Users').doc(auth.currentUser.email).get().then((snapshot) => {
            if (snapshot.data().UserType == 'Radiologist') {
                radiofileList.innerHTML = radiofileList.innerHTML + html;
                doctorfileList.innerHTML = '';
                patientfileList.innerHTML = '';
            } else if (snapshot.data().UserType == 'Patient') {
                patientfileList.innerHTML = patientfileList.innerHTML + html;
                radiofileList.innerHTML = '';
                doctorfileList.innerHTML = '';
            } else if (snapshot.data().UserType == 'Doctor') {
                doctorfileList.innerHTML = doctorfileList.innerHTML + html;
                patientfileList.innerHTML = '';
                radiofileList.innerHTML = '';
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
    userfiles.collection('files').doc(id).get().then(doc => {
        console.log(doc.data());
        document.getElementById('notes').innerHTML=doc.data().content;
        document.querySelectorAll('#output').forEach(item => {
            item.setAttribute('src', doc.data().url);
            item.setAttribute('data-id', id);
            item.style.display = 'block';
        });
        document.querySelectorAll('#canvasgenerator').forEach(item => {
            item.style.display = 'none';
        });
        
    })
}

function selectdicomFile(self, id) {
    console.log(id);
    console.log(self.parentNode.parentNode.parentNode.id);
    var userfiles = db.collection('Files').doc(auth.currentUser.email);
    userfiles.collection('files').doc(id).get().then(doc => {
        console.log(doc.data());
        document.getElementById('notes').innerHTML=doc.data().content;
        loadAndViewImage(doc.data().DicomUrl);
        document.querySelectorAll('#canvasgenerator').forEach(item => {
            item.style.display = 'block';
        });
        document.querySelectorAll('#output').forEach(item => {
            item.setAttribute('data-id', doc.id);
            item.style.display = 'none';
        });
    })
}
function patselectdicomFile(self, id) {
    var userfiles = db.collection('Files').doc(auth.currentUser.email);
    userfiles.collection('files').doc(id.getAttribute('id')).get().then(doc => {
        console.log(doc.data());
        patloadAndViewImage(doc.data().DicomUrl);
        document.getElementById('output').style.display = 'none';
    })
}



cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.configure({
    beforeSend: function (xhr) {
        // Add custom headers here (e.g. auth tokens)
        //xhr.setRequestHeader('APIKEY', 'my auth token');
    }
});
var loaded = false;
function loadAndViewImage(imageId) {
    var canvas1 = document.getElementsByTagName('canvas')[0];
    var canvas2 = document.getElementsByTagName('canvas')[1];
    var canvas3 = document.getElementsByTagName('canvas')[2];
    canvas1.width = 300;
    canvas1.height = 300;
    canvas1.style.height = "300px";
    canvas1.style.width = "300px";
    canvas2.width = 300;
    canvas2.height = 300;
    canvas2.style.height = "300px";
    canvas2.style.width = "300px";
    canvas3.width = 300;
    canvas3.height = 300;
    canvas3.style.height = "300px";
    canvas3.style.width = "300px";
    var element1 = document.querySelectorAll('#canvasgenerator')[0];
    var element2 = document.querySelectorAll('#canvasgenerator')[1];
    var element3 = document.querySelectorAll('#canvasgenerator')[2];
    try {
        var start = new Date().getTime();
        console.log(imageId);
        cornerstone.loadAndCacheImage(imageId).then(function (image) {
            console.log(image);
            var viewport1 = cornerstone.getDefaultViewportForImage(element1, image);
            var viewport2 = cornerstone.getDefaultViewportForImage(element2, image);
            var viewport3 = cornerstone.getDefaultViewportForImage(element3, image);
            cornerstone.displayImage(element1, image, viewport1);
            cornerstone.displayImage(element2, image, viewport2);
            cornerstone.displayImage(element3, image, viewport3);
            if (loaded === false) {
                cornerstoneTools.mouseInput.enable(element1);
                cornerstoneTools.mouseInput.enable(element2);
                cornerstoneTools.mouseInput.enable(element3);
                cornerstoneTools.mouseWheelInput.enable(element1);
                cornerstoneTools.mouseWheelInput.enable(element2);
                cornerstoneTools.mouseWheelInput.enable(element3);
                cornerstoneTools.wwwc.activate(element1, 1); // ww/wc is the default tool for left mouse button
                cornerstoneTools.wwwc.activate(element2, 1); // ww/wc is the default tool for left mouse button
                cornerstoneTools.wwwc.activate(element3, 1); // ww/wc is the default tool for left mouse button
                cornerstoneTools.pan.activate(element1, 2); // pan is the default tool for middle mouse button
                cornerstoneTools.pan.activate(element2, 2); // pan is the default tool for middle mouse button
                cornerstoneTools.pan.activate(element3, 2); // pan is the default tool for middle mouse button
                cornerstoneTools.zoom.activate(element1, 4); // zoom is the default tool for right mouse button
                cornerstoneTools.zoom.activate(element2, 4); // zoom is the default tool for right mouse button
                cornerstoneTools.zoom.activate(element3, 4); // zoom is the default tool for right mouse button
                cornerstoneTools.zoomWheel.activate(element1); // zoom is the default tool for middle mouse wheel
                cornerstoneTools.zoomWheel.activate(element2); // zoom is the default tool for middle mouse wheel
                cornerstoneTools.zoomWheel.activate(element3); // zoom is the default tool for middle mouse wheel
                loaded = true;
            }

            function getTransferSyntax() {
                const value = image.data.string('x00020010');
                return value + ' [' + uids[value] + ']';
            }

            function getSopClass() {
                const value = image.data.string('x00080016');
                return value + ' [' + uids[value] + ']';
            }

            function getPixelRepresentation() {
                const value = image.data.uint16('x00280103');
                if (value === undefined) {
                    return;
                }
                return value + (value === 0 ? ' (unsigned)' : ' (signed)');
            }

            function getPlanarConfiguration() {
                const value = image.data.uint16('x00280006');
                if (value === undefined) {
                    return;
                }
                return value + (value === 0 ? ' (pixel)' : ' (plane)');
            }
        }, function (err) {
            alert(err);
        });
    }
    catch (err) {
        alert(err);
    }
}
function getUrlWithoutFrame() {
    var url = document.getElementById('wadoURL').value;
    var frameIndex = url.indexOf('frame=');
    if (frameIndex !== -1) {
        url = url.substr(0, frameIndex - 1);
    }
    return url;
}
var element1 = document.querySelectorAll('#canvasgenerator')[0];
var element2 = document.querySelectorAll('#canvasgenerator')[1];
var element3 = document.querySelectorAll('#canvasgenerator')[2];
cornerstone.enable(element1);
cornerstone.enable(element2);
cornerstone.enable(element3);

