# ckeditor-image-base64-mysql

## Resources
CKeditor - Online Builder
https://ckeditor.com/ckeditor-5/online-builder/

Remove CKFinder upload adapter to add Base64 upload adapter
Download latest customized ckeditor zip for project reference.

## Installation

1. `npm install`

2. create a `credentials.js` file in the root of the repo

   ```javascript
   module.exports = {
       host     : 'localhost',
       user     : 'me',
       password : 'secret',
       database : 'my_db'
   }
   ```

3. OR pass in MYSQL_HOST, etc as environment variables (eg. from Heroku's Config Vars)

4. Your database needs to be setup with a table called `<>`, feel free to use the included SQL, the only required field for the sake of this demo is the `id` field.

5. `npm run start` to run server

6. Use Postman or your browser to make requests to the api, at `/api/<>/` and `/api/<>/:id`


## References
https://github.com/willbuckingham/node-rest-mysql