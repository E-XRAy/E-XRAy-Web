
const searchPatientSuccess = document.querySelector('#searchPatientSuccess');
const searchPatient = document.querySelector('#search-patient');
const fileForm = document.querySelector('#radio-files-form');
const radiofileList = document.querySelector('#radiofileList');
const radioFilePreview = document.querySelector('#radioFilePreview');

fileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const FileName = fileForm['FileName'].value;
    const FileType = fileForm['FileType'].value;
    const Notes = fileForm['Notes'].value;
    const PatientId = searchPatient.getAttribute('data-id');
    const DicomUrl = document.getElementsByTagName('canvas')[0].getAttribute('data-id');
    console.log(DicomUrl.length);
    var docId
    db.collection('file').add({
        FileName: FileName,
        FileType: FileType,
        Radio_Notes: Notes,
        PatientId: PatientId,
        RadiologistId: auth.currentUser.uid,
        DocList: [],
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        FileUrl: document.getElementById('output').src,
        DicomUrl: DicomUrl,
    }).then(function (docRef) {
        docId = docRef.id;
        console.log("Document written with ID: ", docRef.id);
    });
    if (DicomUrl.length > 0) {
        var canvas = document.getElementsByTagName('canvas')[0];
        canvas.toBlob(function (blob) {
            url = URL.createObjectURL(blob);
            storageRef.child(FileName).put(blob).then(function (snapshot) {
                console.log('Uploaded a blob or file!');
                snapshot.ref.getDownloadURL().then(function (url) {
                    console.log('File available at', url);
                    db.collection('file').doc(docId).update({
                        FileUrl: url
                    })
                });
            });
        });
    }
})
//image handling

// Add the following code if you want the name of the file appear on select
$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});
var file_to_upload;
var loadFile = function (event) {
    var image = document.getElementById('output');
    console.log(event.target.files[0]);
    var file_to_upload = event.target.files[0];
    //image.src = URL.createObjectURL(event.target.files[0]);
    var metadata = {
        'contentType': file_to_upload.type
    };
    if (metadata.contentType.length > 0) {
        console.log('image');
        storageRef.child('images/' + file_to_upload.name).put(file_to_upload, metadata).then(function (snapshot) {
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log('File metadata:', snapshot.metadata);
            // Let's get a download URL for the file.
            snapshot.ref.getDownloadURL().then(function (url) {
                document.getElementById('output').setAttribute('src', url);
                document.getElementsByTagName('canvas')[0].setAttribute('data-id', "");

                document.getElementById('output').style.display = 'block';
                document.getElementsByTagName('canvas')[0].style.display = 'none';

                // [END_EXCLUDE]
            });
        }).catch(function (error) {
            // [START onfailure]
            console.error('Upload failed:', error);
            // [END onfailure]
        });
        // [END oncomplete]
    } else {
        console.log('dicom');
        storageRef.child('dicom/' + file_to_upload.name).put(file_to_upload, metadata).then(function (snapshot) {
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log('File metadata:', snapshot.metadata);
            // Let's get a download URL for the file.
            snapshot.ref.getDownloadURL().then(function (url) {
                console.log('File available at', url);
                url = "wadouri:" + url;
                // image enable the dicomImage element and activate a few tools
                loadAndViewImage(url);
                var canvas = document.getElementsByTagName('canvas')[0];
                canvas.setAttribute('data-id', url);
                //document.getElementById('output').style.display = 'none';
                document.getElementsByTagName('canvas')[0].style.display = 'block';
                /*canvas.toBlob(function(blob) {
                        url = URL.createObjectURL(blob);
                  storageRef.child('DICOM2').put(blob).then(function(snapshot) {
                    console.log('Uploaded a blob or file!');
                  });
                  document.getElementById('output').setAttribute('src',url);
                    //document.body.appendChild(newImg);
                  });*/
                // [END_EXCLUDE]
            });
        }).catch(function (error) {
            // [START onfailure]
            console.error('Upload failed:', error);
            // [END onfailure]
        });
        // [END oncomplete]
    }


};

searchPatient.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchPatientName = searchPatient['search-patient-name'].value;
    console.log(searchPatientName);
    db.collection('users').where('EmailId', '==', searchPatientName).where('UserType', '==', 'Patient').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            searchPatient.setAttribute('data-id', doc.id);
            console.log(doc.data().UserName)
            fileForm['searchedPatientName'].value = doc.data().UserName;
            fileForm['searchedPatientName'].disabled = 'true';
            searchPatientSuccess.style.display = 'block';
        });

    })
});


//realtime listener of files collection
/*db.collection('file').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.doc.data().RadiologistId == auth.currentUser.uid) {
            if (change.type == 'added') {
                RadioFileListGen(change.doc);
            }
        }

    })
})*/


const RadioFileListGen = (docu) => {
    if (docu) {
        db.collection('users').doc(docu.data().PatientId).get().then(doc => {
            var PatName = doc.data().UserName;
            const html =
                `<div class="card mt-1" style="border-radius: 10px;">
                <div class="card-title pl-5 pt-1" aria-expanded="true" aria-controls="demo"
                                    data-target="#${docu.id}" data-toggle="collapse">${docu.data().FileName},${PatName}
                    </div>
                <div id="${docu.id}" class="collapse card-body">${docu.data().FileName}<br>${docu.data().FileType}<div
                                        class="float-right btn btn-primary ${docu.id}" onclick="radselectFile(this,${docu.id})">view</div>
                                        <div class="btn btn-primary" onclick="radselectdicomFile(this,${docu.id})">view(DICOM)</div>
                </div>
            </div>`
            console.log(doc.data());
            radiofileList.innerHTML = radiofileList.innerHTML + html;
        })

    } else {
        radiofileList.innerHTML = '';
    }
}
function radselectdicomFile(self, id) {
    db.collection('file').doc(id.getAttribute('id')).get().then(doc => {
        console.log(doc.data());
        loadAndViewImage(doc.data().DicomUrl);
        document.getElementById('output').style.display = 'none';
        document.getElementsByTagName('canvas')[0].style.display = 'block';

    })
}






function radselectFile(self, id) {
    console.log(id.getAttribute('id'));
    db.collection('file').doc(id.getAttribute('id')).get().then(doc => {
        console.log(doc.data());
        
        document.querySelectorAll('#output').forEach(item => {
            item.setAttribute('src', doc.data().FileUrl);
            item.style.display = 'block';
        });
    })
}