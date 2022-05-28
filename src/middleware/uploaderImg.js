const multer = require('multer')
var crypto = require('crypto')
var base64url = require('base64url')

module.exports = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './tmp/upload')
        },
        filename: (req, file, cb) => {
            const randomStringAsBase64Url = (size) => {
                return base64url(crypto.randomBytes(size))
            }

            cb(null, randomStringAsBase64Url(30) + '_' + file.originalname)
        }
    }),
    fileFilter: (req, file, cb) => {
        const imgExtension = ['image/png', 'image/jpg', 'image/jpeg'].find(
            acceptedFormat => acceptedFormat == file.mimetype
        )

        if (imgExtension) {
            return cb(null, true)
        }

        return cb(null, false)
    }
}))