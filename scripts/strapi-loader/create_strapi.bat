@echo off
cd /d c:\Users\Zizar\Desktop\Scripts\fablab-web
curl.exe -X PUT "http://localhost:1337/api/proyecto" -H "Authorization: Bearer 637661dabf77f703e221beb92eee5c929aa782d7c823959acbcca1894716d50f3f9e9ccb45052a80edbf4c9435983a10063791f8a2a7873e8f8cad3944bc2c8f95b360060cb78f6084d6d4e46cf20a2bc8d7d7f3a3d5a555998f5b69b9b7265a66b522962959aaf48b60ea4fbb1a54d222d241f6feb07e43c0ac966f4f5c298a" -H "Content-Type: application/json" -d @proyecto.json
pause