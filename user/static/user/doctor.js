const doctorfileList = document.querySelector('#doctorfileList')
const doctorFilePreview = document.querySelector('#doctorFilePreview')


//realtime listener of files collection
db.collection('file').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.doc.data().DocList.includes(auth.currentUser.uid)) {
            if (change.type == 'added') {
                DoctorFileListGen(change.doc);
            }
        }

    })
})


const DoctorFileListGen = (docu) => {
    if (docu) {
        db.collection('users').doc(docu.data().PatientId).get().then(doc => {
            var PatName = doc.data().UserName;
            const html =
                `<div class="card mt-1" style="border-radius: 10px;">
                <div class="card-title pl-5 pt-1" aria-expanded="true" aria-controls="demo"
                                    data-target="#${docu.id}" data-toggle="collapse">${docu.data().FileName},${PatName}
                    </div>
                <div id="${docu.id}" class="collapse card-body">${docu.data().FileName}<br>${docu.data().FileType}<button
                                        class="float-right btn btn-primary ${docu.id}" onclick="docselectFile(this,${docu.id})">view</button>
                </div>
            </div>`
            console.log(docu.data());
            doctorfileList.innerHTML = doctorfileList.innerHTML + html;
        })

    } else {
        doctorfileList.innerHTML = '';
    }
}
//Preview files
function docselectFile(self, id) {
    console.log(id.getAttribute('id'));
    doctorFilePreview.setAttribute('data-id',id.getAttribute('id'))
    db.collection('file').doc(id.getAttribute('id')).get().then(doc => {
        console.log(doc.data());
        let docPreview =
        `<h4>filename:${doc.data().FileName}</h4>
        `
        doctorFilePreview.innerHTML=docPreview;
    })
}