const patientfileList = document.querySelector('#patientfileList')
const searchDoctor = document.querySelector('#searchDoctor')
const searchedDoctor = document.querySelector('#searchedDoctor')
const patientFilePreview = document.querySelector('#patientFilePreview')
//search doctor and get doctorname to sent
searchDoctor.addEventListener('submit', (e) => {
    e.preventDefault();
    const doctorEmailorPhone = searchDoctor['doctorEmailorPhone'].value;
    db.collection('users').where('EmailId', '==', doctorEmailorPhone).where('UserType', '==', 'Doctor').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            console.log(doc.data().UserName);
            searchedDoctor['searchedDoctorName'].value = doc.data().UserName;
            searchedDoctor['searchedDoctorName'].setAttribute('data-id',doc.id);
            searchedDoctor.style.display = 'block';
        });

    })
})

//sent to doctor
searchedDoctor.addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log(searchedDoctor['searchedDoctorName'].getAttribute('data-id'));
    console.log(patientFilePreview.getAttribute('data-id'));
    db.collection('file').doc(patientFilePreview.getAttribute('data-id')).get().then(doc => {
        doc_list = doc.data().DocList;
        if (doc_list.includes(searchedDoctor['searchedDoctorName'].getAttribute('data-id'))) {
            alert('already shared');
        } else {
            doc_list=doc_list.concat([searchedDoctor['searchedDoctorName'].getAttribute('data-id')]);
            console.log(doc_list);
            db.collection('file').doc(patientFilePreview.getAttribute('data-id')).update({DocList:doc_list});
            alert('shared successfully');
        }
    })
})



//realtime listener of files collection
/*db.collection('file').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.doc.data().PatientId == auth.currentUser.uid) {
            if (change.type == 'added') {
                PatientFileListGen(change.doc);
            }
        }

    })
})*/


const PatientFileListGen = (docu) => {
    if (docu) {
        db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
            var PatName = doc.data().UserName;
            const html =
                `<div class="card mt-1" style="border-radius: 10px;">
                <div class="card-title pl-5 pt-1" aria-expanded="true" aria-controls="demo"
                                    data-target="#${docu.id}" data-toggle="collapse">${docu.data().FileName},${PatName}
                    </div>
                <div id="${docu.id}" class="collapse card-body">${docu.data().FileName}<br>${docu.data().FileType}<button
                                        class="float-right btn btn-primary ${docu.id}" onclick="patselectFile(this,${docu.id})">view</button>
                </div>
            </div>`
            console.log(doc.data());
            patientfileList.innerHTML = patientfileList.innerHTML + html;
        })

    } else {
        patientfileList.innerHTML = '';
    }
}
function patselectFile(self, id) {
    console.log(id.getAttribute('id'));
    patientFilePreview.setAttribute('data-id',id.getAttribute('id'))
    db.collection('file').doc(id.getAttribute('id')).get().then(doc => {
        console.log(doc.data());
        let patPreview =
        `<img src=${doc.data().img} style="width:300px;">
        `
        patientFilePreview.innerHTML=patPreview;
    })
}

