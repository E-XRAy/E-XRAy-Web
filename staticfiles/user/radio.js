
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
    console.log(PatientId);
    db.collection('file').add({
        FileName: FileName,
        FileType: FileType,
        Radio_Notes: Notes,
        PatientId: PatientId,
        RadiologistId: auth.currentUser.uid,
        DocList: [],
    });
})

searchPatient.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchPatientName = searchPatient['search-patient-name'].value;
    console.log(searchPatientName);
    db.collection('users').where('EmailId', '==', searchPatientName).get().then((snapshot) => {
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
                </div>
            </div>`
            console.log(doc.data());
            radiofileList.innerHTML = radiofileList.innerHTML + html;
        })

    } else {
        radiofileList.innerHTML = '';
    }
}
function radselectFile(self, id) {
    console.log(id.getAttribute('id'));
    radioFilePreview.setAttribute('data-id', id.getAttribute('id'))
    db.collection('file').doc(id.getAttribute('id')).get().then(doc => {
        console.log(doc.data());
        let radPreview =
            `<h4>filename:${doc.data().FileName}</h4>
            `
            radioFilePreview.innerHTML = radPreview;
    })
}