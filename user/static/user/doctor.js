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

searchDoctor.addEventListener('submit',(e)=>{
    var doctorEmailorPhone=document.getElementById('doctorEmailorPhone').value;
    console.log(doctorEmailorPhone);
    var filename
    var fileType
    var content
    var url
    var DicomUrl
    var userfiles = db.collection('Files').doc(auth.currentUser.email);
    userfiles.collection('files')
        .doc(document.getElementById('output')
            .getAttribute('data-id')).get().then(doc => {
                console.log(doc.data());
                filename = doc.data().filename;
                fileType = doc.data().fileType;
                content = doc.data().content;
                url = doc.data().url;
                DicomUrl = doc.data().DicomUrl;
                var doctuserfiles = db.collection('Files').doc(doctorEmailorPhone);
                doctuserfiles.collection('files').add({
                    filename: filename,
                    fileType: fileType,
                    content: content,
                    url: url,
                    DicomUrl: DicomUrl,
                })
            })
})


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