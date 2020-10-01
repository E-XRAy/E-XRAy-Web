const doctorfileList = document.querySelector('#doctorfileList')
const doctorFilePreview = document.querySelector('#doctorFilePreview')


//realtime listener of files collection
/*db.collection('file').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.doc.data().DocList.includes(auth.currentUser.uid)) {
            if (change.type == 'added') {
                DoctorFileListGen(change.doc);
            }
        }

    })
})*/



function docselectdicomFile(self, id) {
    db.collection('file').doc(id.getAttribute('id')).get().then(doc => {
        console.log(doc.data());
        loadAndViewImage3(doc.data().DicomUrl);
        document.getElementById('output').style.display = 'none';
        document.getElementsByTagName('canvas')[1].style.display = 'block';
    })

}



//Preview files
/*function docselectFile(self, id) {
    console.log(id.getAttribute('id'));
    doctorFilePreview.setAttribute('data-id', id.getAttribute('id'))
    db.collection('file').doc(id.getAttribute('id')).get().then(doc => {
        console.log(doc.data());
        document.querySelectorAll('#output').forEach(item => {
            item.setAttribute('src', doc.data().FileUrl);
            item.style.display = 'block';
        });
    })
}*/