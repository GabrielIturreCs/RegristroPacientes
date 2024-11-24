# Usa la imagen oficial de Nginx
FROM nginx:latest

# Copia los archivos del frontend desde el directorio dist a la carpeta de Nginx dentro del contenedor
COPY dist/ /usr/share/nginx/html/

# Exponer el puerto 80 para acceder al frontend
EXPOSE 80

# Ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]