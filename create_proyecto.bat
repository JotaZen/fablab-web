@echo off
cd /d c:\Users\Zizar\Desktop\Scripts\fablab-web
curl.exe -X PUT http://localhost:3001/api/strapi/proyecto -H "Content-Type: application/json" -d @proyecto.json
