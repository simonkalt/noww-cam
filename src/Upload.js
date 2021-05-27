import React from 'react';
import S3FileUpload from 'react-s3';

const config = {
    bucketName: 'Noww',
    dirName: '', /* optional */
    region: 'us-west-1',
    accessKeyId: 'AKIAQJQBNKSSQAQNWLVJ',
    secretAccessKey: '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'
}

const upload=(e)=> {
    S3FileUpload.uploadFile(e.target.fiels[0], config)
    .then((data)=> {
        console.log(data.location)
    })
    .catch( (err)=>{
        alert(err)
    })
}