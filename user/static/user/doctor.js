const doctorfileList = document.querySelector('#doctorfileList')
const doctorFilePreview = document.querySelector('#doctorFilePreview')

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
searchanotherDoctor.addEventListener('submit',(e)=>{
    var anotherdoctorEmail=document.getElementById('anotherdoctorEmail').value;
    console.log(anotherdoctorEmail);
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
                var doctuserfiles = db.collection('Files').doc(anotherdoctorEmail);
                doctuserfiles.collection('files').add({
                    filename: filename,
                    fileType: fileType,
                    content: content,
                    url: url,
                    DicomUrl: DicomUrl,
                })
            })
})