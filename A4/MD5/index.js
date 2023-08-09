const crypto = require('crypto');
const axios = require('axios');

exports.handler = async (event) => {
  try {
    const input = event.value

    const md5Hash = generateMD5(input);
    console.log('MD5 Hash:', md5Hash);
    
     const endData = {
      "banner": "B00919946",
      "result": md5Hash,
      "arn": "arn:aws:lambda:us-east-1:430910936224:function:MD5Encryption",
      "action": "md5",
      "value": input
      }
      
    axios.post("https://v7qaxwoyrb.execute-api.us-east-1.amazonaws.com/default/end", endData);
    

    return {
      statusCode: 200,
      message: 'MD5 Encryption',
      body: md5Hash,
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};

function generateMD5(inputData) {
  const hash = crypto.createHash('md5');
  hash.update(inputData);
  return hash.digest('hex');
}
