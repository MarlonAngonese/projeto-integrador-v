const fs = require('fs')
const { google } = require('googleapis')

const GOOGLE_API_FOLDER_ID = '15qzobUzpVFw6g-OZqkksS325SoPaTVE4'

const uploadFile = async (imgs) => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './src/api/googledrive/key.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        })

        const driveService = google.drive({
            version: 'v3',
            auth
        })

        ids = []

        for (const img of imgs) {
            const fileMetaData = {
                'name': img.filename,
                'parents': [GOOGLE_API_FOLDER_ID]
            }
    
            const media = {
                mimeType: img.mimetype,
                body: fs.createReadStream(img.path),
            }
    
            const response = await driveService.files.create({
                resource: fileMetaData,
                media: media,
                fields: 'id'
            })
    
            ids.push("https://drive.google.com/uc?export=view&id=" + response.data.id)

            //Apagar a imagem do TMP
            fs.unlinkSync(img.path)
        }

        return ids

    } catch (err) {
        return false
    }
}

module.exports = uploadFile