
const searchPatientSuccess = document.querySelector('#searchPatientSuccess');
const searchPatient = document.querySelector('#search-patient');
const fileForm = document.querySelector('#radio-files-form');
const radiofileList = document.querySelector('#radiofileList');
const radioFilePreview = document.querySelector('#radioFilePreview');

fileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const filename = fileForm['FileName'].value;
    const fileType = fileForm['FileType'].value;
    const content = fileForm['Notes'].value;
    const url = document.getElementById('output').src;
    console.log(filename,fileType,content,url);
    var userfiles = db.collection('Files').doc(auth.currentUser.email);
    userfiles.collection('files').add({
        filename:filename,
        fileType:fileType,
        content:content,
        url:url,
        })
    //const DicomUrl = document.getElementsByTagName('canvas')[0].getAttribute('data-id');
    /*console.log(DicomUrl.length);
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
    }*/
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
    /*db.collection('users').where('EmailId', '==', searchPatientName).where('UserType', '==', 'Patient').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            searchPatient.setAttribute('data-id', doc.id);
            console.log(doc.data().UserName)
            fileForm['searchedPatientName'].value = doc.data().UserName;
            fileForm['searchedPatientName'].disabled = 'true';
            searchPatientSuccess.style.display = 'block';
        });

    })*/
});


function radselectdicomFile(self, id) {
    db.collection('file').doc(id.getAttribute('id')).get().then(doc => {
        console.log(doc.data());
        loadAndViewImage(doc.data().DicomUrl);
        document.getElementById('output').style.display = 'none';
        document.getElementsByTagName('canvas')[0].style.display = 'block';

    })
}






