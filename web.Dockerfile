FROM ubuntu:22.04

# Actualiza el sistema e instala dependencias necesarias
RUN apt-get update && apt-get install -y \
    curl \
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Establecer directorio de trabajo
WORKDIR /app

# Copiar el código fuente de la aplicación
COPY . .

# Exponer el puerto de la aplicación (3000 por defecto)
EXPOSE 3001

# Ejecutar la aplicación
CMD ["npm", "run", "dev"]