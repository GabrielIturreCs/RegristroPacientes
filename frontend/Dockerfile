# Usa la imagen oficial de Nginx
FROM nginx:latest

# Copia los archivos del frontend al contenedor (asegúrate de que los archivos estén en el directorio correcto)
COPY ./dist/ /usr/share/nginx/html

# Exponer el puerto 80 para poder acceder al frontend
EXPOSE 80

# Ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]