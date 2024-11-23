FROM nginx:latest

# Copiar todos los archivos estáticos del frontend (de /dist) al contenedor de Nginx
COPY ./dist/ /usr/share/nginx/html

# Copiar el archivo de configuración de Nginx (default.conf)
COPY ./nginx/default.conf /etc/nginx/conf.d/

# Exponer el puerto 80 de Nginx
EXPOSE 80