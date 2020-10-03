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
            searchedDoctor['searchedDoctorName'].setAttribute('data-id', doc.id);
            searchedDoctor.style.display = 'block';
        });

    })
})

//sent to doctor
searchedDoctor.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(searchedDoctor['searchedDoctorName'].getAttribute('data-id'));
    console.log(patientFilePreview.getAttribute('data-id'));
    db.collection('file').doc(patientFilePreview.getAttribute('data-id')).get().then(doc => {
        doc_list = doc.data().DocList;
        if (doc_list.includes(searchedDoctor['searchedDoctorName'].getAttribute('data-id'))) {
            alert('already shared');
        } else {
            doc_list = doc_list.concat([searchedDoctor['searchedDoctorName'].getAttribute('data-id')]);
            console.log(doc_list);
            db.collection('file').doc(patientFilePreview.getAttribute('data-id')).update({ DocList: doc_list });
            alert('shared successfully');
        }
    })
})

function patselectFile(self, id) {
    console.log(id.getAttribute('id'));
    patientFilePreview.setAttribute('data-id', id.getAttribute('id'))
    db.collection('file').doc(id.getAttribute('id')).get().then(doc => {
        console.log(doc.data());
        document.querySelectorAll('#output').forEach(item => {
            item.setAttribute('src', doc.data().FileUrl);
            item.style.display = 'block';
        });
        /*document.getElementById('output').setAttribute('src', doc.data().FileUrl);
        document.getElementById('output').style.display = 'block';
        document.getElementsByTagName('canvas')[0].style.display = 'none';*/
    })
}

