const fs = require('fs')
const { google } = require('googleapis')

const GOOGLE_API_FOLDER_ID = '15qzobUzpVFw6g-OZqkksS325SoPaTVE4'

const uploadFile = async (imgs) => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './samples/api/googledrive/key.json',
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
    
            ids.push(response.data.id)

            //Apagar a imagem do TMP
            fs.unlinkSync(img.path)
        }

        return ids

    } catch (err) {
        console.log('Erro ao fazer upload no Google Drive: ' + err)
        return false
    }
}

module.exports = uploadFile