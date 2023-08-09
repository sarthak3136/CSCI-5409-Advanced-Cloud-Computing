const crypto = require('crypto');
const axios = require('axios');

exports.handler = async (event) => {
  try {
    console.log(event);
    const data = event.value;
    
    const hashedData = sha256Hash(data);
    console.log('Hashed data:', hashedData);
    
    const endData = {
      "banner": "B00919946",
      "result": hashedData,
      "arn": "arn:aws:lambda:us-east-1:430910936224:function:SHA256Encryption",
      "action": "sha256",
      "value": data
      }
      
    axios.post("https://v7qaxwoyrb.execute-api.us-east-1.amazonaws.com/default/end", endData);

    return {
      statusCode: 200,
      message: "SHA256 Encryption",
      body: hashedData,
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: event.body.input,
    };
  }
};

function sha256Hash(inputData) {
  const hash = crypto.createHash('sha256');
  hash.update(inputData, 'utf8');
  return hash.digest('hex');
}

