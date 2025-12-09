# ===============================================
# Guía de Despliegue - FabLab en VPS
# Con Docker, Nginx y SSL (Let's Encrypt)
# ===============================================

## 📋 Requisitos en VPS

- Ubuntu 22.04 o similar
- Docker y Docker Compose instalados
- Nginx instalado
- Certbot para SSL
- Dominio apuntando al VPS

---

## 🚀 Paso 1: Preparar el Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt install docker-compose-plugin -y

# Instalar Nginx y Certbot
sudo apt install nginx certbot python3-certbot-nginx -y

# Reiniciar sesión para aplicar grupo docker
exit
```

---

## 🚀 Paso 2: Clonar y Configurar

```bash
# Clonar repositorio
cd /opt
sudo git clone https://github.com/tu-usuario/fablab-web.git
sudo chown -R $USER:$USER fablab-web
cd fablab-web

# Crear archivo de variables
cp .env.example .env
nano .env  # Editar con tus valores
```

### Generar secretos:
```bash
# Para APP_KEYS, JWT_SECRET, etc.
openssl rand -base64 32
```

---

## 🚀 Paso 3: Configurar Nginx

### Crear archivo para CMS (puerto 9010):

```bash
sudo nano /etc/nginx/sites-available/cms.tudominio.com
```

```nginx
server {
    listen 80;
    server_name cms.tudominio.com;

    location / {
        proxy_pass http://127.0.0.1:9010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Para uploads grandes en Strapi
        client_max_body_size 100M;
    }
}
```

### Crear archivo para Web (puerto 9011):

```bash
sudo nano /etc/nginx/sites-available/app.tudominio.com
```

```nginx
server {
    listen 80;
    server_name app.tudominio.com;

    location / {
        proxy_pass http://127.0.0.1:9011;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Habilitar sitios:

```bash
sudo ln -s /etc/nginx/sites-available/cms.tudominio.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/app.tudominio.com /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## 🚀 Paso 4: Configurar SSL con Certbot

```bash
# Obtener certificados SSL (Certbot modifica automáticamente Nginx)
sudo certbot --nginx -d cms.tudominio.com -d app.tudominio.com

# Verificar renovación automática
sudo certbot renew --dry-run
```

Certbot automáticamente:
- Genera certificados SSL
- Modifica los archivos de Nginx para HTTPS
- Configura redirección HTTP → HTTPS
- Programa renovación automática

---

## 🚀 Paso 5: Levantar Servicios

```bash
cd /opt/fablab-web

# Opción A: Todo junto
docker compose up -d --build

# Opción B: Por separado
docker compose -f docker-compose.cms.yml up -d --build
docker compose -f docker-compose.web.yml up -d --build

# Ver logs
docker compose logs -f

# Ver estado
docker compose ps
```

---

## 🔧 Comandos Útiles

```bash
# Reiniciar servicios
docker compose restart

# Reconstruir sin cache
docker compose build --no-cache
docker compose up -d

# Ver logs de un servicio específico
docker compose logs -f cms
docker compose logs -f web

# Entrar al contenedor
docker exec -it fablab-cms sh
docker exec -it fablab-web sh

# Backup de base de datos
# (Al usar una BD externa, realiza el backup directamente en tu servidor de base de datos)
# Ejemplo genérico para Postgres externo:
# pg_dump -h tu_host_db -U tu_usuario -d nombre_db > backup.sql

# Restaurar base de datos
# psql -h tu_host_db -U tu_usuario -d nombre_db < backup.sql
```

---

## 📁 Estructura Final

```
/opt/fablab-web/
├── cms/                    # Strapi CMS
│   └── Dockerfile
├── web/                    # Next.js App
│   └── Dockerfile
├── docker-compose.yml      # Todo junto
├── docker-compose.cms.yml  # Solo CMS
├── docker-compose.web.yml  # Solo Web
├── .env                    # Variables (NO git)
└── .env.example           # Ejemplo de variables
```

---

## 🌐 URLs Finales

- **CMS Admin**: https://cms.tudominio.com/admin
- **CMS API**: https://cms.tudominio.com/api
- **Web App**: https://app.tudominio.com

---

## ⚠️ Notas Importantes

1. **Seguridad**:
   - Cambia TODAS las contraseñas en `.env`
   - No subas `.env` a git
   - Configura firewall (ufw)

2. **DNS**:
   - Crea registros A para `cms.tudominio.com` y `app.tudominio.com`
   - Apunta ambos a la IP de tu VPS

3. **Firewall**:
   ```bash
   sudo ufw allow 22/tcp   # SSH
   sudo ufw allow 80/tcp   # HTTP
   sudo ufw allow 443/tcp  # HTTPS
   sudo ufw enable
   ```

4. **Monitoreo**:
   ```bash
   # Instalar htop
   sudo apt install htop
   
   # Ver uso de Docker
   docker stats
   ```
