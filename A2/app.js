const AWS = require('aws-sdk');
const grpc = require("@grpc/grpc-js");
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('computeandstorage.proto');
const computeAndStorageProto = grpc.loadPackageDefinition(packageDefinition).computeandstorage;

const server = new grpc.Server();

// AWS Configuration
const s3 = new AWS.S3({
  accessKeyId: 'AKIA34LNE4NGWDAZTQN6',
  secretAccessKey: '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'
});

// Function to generate unique key name
function generateRandomKeyName() {
    const timestamp = Date.now(); // Get current timestamp
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random alphanumeric string
  
    return `${timestamp}_${randomString}`;
  }
  
  // Unique Key name for the file generated
const keyName = generateRandomKeyName();

// Storing the data in the file
function StoreData(call, callback){
    console.log(call);
    const params = {
        Bucket: 's3a2bucket5409',
        Key: keyName,
        Body: call.request.data
    }
    var response = {};
    s3.upload(params, (err, data) => {
        if (err) {
          callback()
        }
        response = {
            s3uri: data.Location,
          };
        callback(null, response);
      });
      
}

// Appending the data in the file generated
function AppendData(call, callback){
    console.log(call);
    const params = {
        Bucket: 's3a2bucket5409',
        Key: keyName
    }
    var existingData = "";
    var updatedData = "";

    s3.getObject(params, (err, data) => {
        if(err){
            callback(null, err);
        }
        else{
            existingData = Buffer.from(data.Body).toString();
            console.log("Existing Data: " + existingData);
            updatedData = existingData + " " + call.request.data;
            console.log("Updated Data: " + updatedData);

            const updatedParams = {
                Bucket: 's3a2bucket5409',
                Key: keyName,
                Body: updatedData
            }

            s3.upload(updatedParams, (err, data) => {
                if(err){
                    callback(null, err);
                }
                else{
                    const response = {};
                    callback(null, response);
                }
            })
        }
    })
}

// DeleteFile
function DeleteFile(call, callback){
    const params = {
        Bucket: 's3a2bucket5409',
        Key: keyName,
    }
    s3.deleteObject(params, (err, data) => {
        if(err){
            callback(null, err);
        }
        else{
            const response = {};
            callback(null, response);
        }
    })
}

server.addService(computeAndStorageProto.EC2Operations.service, {
    StoreData: StoreData,
    AppendData: AppendData,
    DeleteFile: DeleteFile
  });
 
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});
