'use strict';
//Edit this file for appropriate buckets etc.
//TODO: read this readme section.
//Add this file content to the AWS lambda function GUI code editor on AWS console website.
//Then add trigger for the req.

console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });


exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
            console.log(message);
            callback(message);
        } else {
            console.log('uploading ... CONTENT TYPE:', data.ContentType);
    var dst_key = bucket + '/' + key
    var params = {
        Body: data.Body,
        Bucket: "insitu-app-mongodb-backups-cedar",
        Key: dst_key,
        ServerSideEncryption: "AES256",
        Tagging: "key1=value1&key2=value2"
    };
    s3.putObject(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else  {
            console.log(data);
            console.log('successfully uploaded to the backup bucket ......---------*****.....')
            console.log(data);           // successful response
        }
        /*
         data = {
         ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
         ServerSideEncryption: "AES256",
         VersionId: "Ri.vC6qVlA4dEnjgRV4ZHsHoFIjqEMNt"
         }
         */
    });

    callback(null, data.ContentType);
}
});
};
