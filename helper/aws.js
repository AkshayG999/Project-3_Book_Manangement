const aws = require('aws-sdk')



aws.config.update({
    accessKeyId: "AKIATICKC6Y7DKUMEZ53",//AKIAY3L35MCRZNIRGT6N
    secretAccessKey: "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",// 9f+YFBVcSjZWM6DG9R4TUN8k8TGe4X+lXmO4jPiU
    region: "ap-south-1"

})
let uploadFile = async (req, res) => {
    try {
        let files = req.files
        if (files && files.length > 0) {
            const file = files[0];

            return new Promise(function (resolve, reject) {
                let s3 = new aws.S3({ apiVersion: '2006-03-01' });

                var uploadParams = {
                    // ACL: "public-read",
                    Bucket: "ask-akshay",
                    Key: "akshay/" + file.originalname,
                    Body: file.buffer
                }
                s3.upload(uploadParams, function (err, data) {
                    if (err) {
                        return reject({ "error": err })
                    }
                    console.log(data)
                    console.log("file uploaded succesfully")
                    return res.status(201).send({ msg: "file uploaded succesfully", data: data })
                })

            })
        }
        else {
            res.status(400).send({ msg: "No file found" })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }


}

module.exports = { uploadFile }

