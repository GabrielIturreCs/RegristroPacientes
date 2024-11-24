# Usa una imagen oficial de Node.js como base
FROM node:16

# Crea y establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias (package.json y package-lock.json)
COPY package*.json ./

# Instala las dependencias del backend
RUN npm install

# Copia todo el código fuente del backend al contenedor
COPY . .

# Exponer el puerto 3000 (o el puerto que uses para el backend)
EXPOSE 3000

# Ejecutar un retraso para esperar que la base de datos esté disponible
CMD sleep 15 && node index.js