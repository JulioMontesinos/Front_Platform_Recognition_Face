# 🎭 Análisis de Emociones Faciales en Tiempo Real

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![DeepFace](https://img.shields.io/badge/DeepFace-4A4A4A?style=for-the-badge&logo=tensorflow&logoColor=FF6F00)

Este proyecto es una aplicación web full-stack diseñada para analizar emociones faciales a partir de imágenes estáticas o de una transmisión de video en tiempo real desde la webcam del usuario.

---

Dado que la arquitectura de este proyecto es compleja para un despliegue público (Las librerías de deep-face son extremadamente grandes), he publicado todo el código para que podáis instalarlo en vuestro sistema y probarlo


#### Análisis de Imagen Subida

![4](https://github.com/user-attachments/assets/c9bcb02c-097b-47c9-bbed-a1b53505efef)


#### Análisis en Tiempo Real con Webcam

![2](https://github.com/user-attachments/assets/8f023de9-c516-4ca7-b31a-e317390c87c7)

---

### ✨ Características Principales

* **Sistema de Autenticación Completo**: Registro e inicio de sesión de usuarios con tokens JWT para proteger las rutas.
* **Análisis de Imágenes**: Sube un archivo de imagen (JPG, PNG) y la aplicación detectará la emoción facial predominante y un ranking de las más probables.
* **Análisis en Tiempo Real**: Activa la webcam para obtener un análisis continuo de tus expresiones faciales, con una superposición que muestra la emoción detectada en cada momento.
* **Interfaz Reactiva**: Construido con React para una experiencia de usuario fluida y dinámica.

---

### 🏗️ Arquitectura del Proyecto

Este proyecto sigue una arquitectura de microservicios, compuesta por tres partes independientes que se comunican entre sí:

1.  **Frontend (Este Repositorio)**: Una aplicación de una sola página (SPA) construida con **React** que gestiona la interfaz de usuario y la interacción.
2.  **Backend de Autenticación**: Un servidor en **Node.js** con **Express** que maneja el registro, login y la validación de usuarios mediante JWT.
    * **[🔗 Ver Repositorio del Backend de Autenticación](https://github.com/JulioMontesinos/Back_Platform_Recognition_Face)**
3.  **Backend de IA (Análisis Facial)**: Un servidor en **Python** con **Flask** que utiliza la librería **DeepFace** y **OpenCV** para realizar todo el procesamiento y análisis de las imágenes.
    * **[🔗 Ver Repositorio del Backend de IA](https://github.com/JulioMontesinos/facial_emotion)**

## Análisis de la Arquitectura y Flujos de Datos

Frontend (Cliente): Una aplicación React que se ejecuta en el navegador del usuario. Es responsable de toda la interfaz y la gestión del estado del lado del cliente (como el token de autenticación).

    Backend de Autenticación (Servidor Node.js): Una API REST construida con Express que gestiona exclusivamente a los usuarios. Su lógica principal incluye:

        Validar credenciales contra la base de datos diseñado para MongoDB.

        Hashear contraseñas con bcrypt.

        Crear y validar JSON Web Tokens (JWT) para las sesiones.

    Backend de IA (Servidor Python): Un servidor Flask dedicado a la computación pesada. Su lógica principal incluye:

        Recibir imágenes y frames de video.

        Usar OpenCV para el pre-procesamiento de imágenes (decodificar, cambiar color, redimensionar).

        Utilizar la librería DeepFace (con TensorFlow por debajo) para ejecutar el modelo de análisis de emociones.

        Servir un stream de video en vivo.

Flujos de Datos Detallados:

1. Flujo de Autenticación:

    Paso 1: El usuario introduce su email y contraseña en el formulario de React.

    Paso 2: El frontend envía una petición POST a /api/auth/login en el servidor Node.js.

    Paso 3: El servidor Node.js busca al usuario por email y compara la contraseña hasheada usando bcrypt.

    Paso 4: Si las credenciales son válidas, genera un JWT y lo devuelve al frontend.

    Paso 5: El frontend de React guarda el JWT en localStorage para autenticar peticiones futuras a rutas protegidas.

2. Flujo de Análisis de Emociones (Imagen y Video):

    Paso 1: Desde una ruta protegida, el usuario sube una imagen o activa la webcam.

    Paso 2 (Imagen): El frontend envía la imagen en un FormData a la ruta /analyze-image del servidor Python/Flask.

    Paso 2 (Webcam): El frontend hace dos cosas en paralelo:

        Establece una conexión GET a /video_feed para recibir el stream de video.

        Periódicamente, captura un frame y lo envía vía POST a /analyze-image.

    Paso 3: El servidor Flask recibe la imagen, OpenCV la pre-procesa, y DeepFace la analiza.

    Paso 4: El servidor Flask devuelve un objeto JSON con la emoción dominante, el porcentaje de confianza y un ranking de emociones.

    Paso 5: El frontend de React recibe este JSON y actualiza la interfaz para mostrar los resultados al usuario.

### 🛠️ Tecnologías Utilizadas

* **Frontend**: React, Vite, Axios, JWT-Decode, React Router.
* **Backend (Autenticación)**: Node.js, Express, bcryptjs, JSON Web Token (JWT), CORS.
* **Backend (IA)**: Python, Flask, DeepFace, TensorFlow, OpenCV, NumPy.

---

### 🚀 Cómo Ejecutar este Proyecto Localmente

Para poner en marcha este proyecto, necesitarás tener los tres servidores funcionando simultáneamente.

#### **Pre-requisitos**
* Node.js (v18 o superior)
* Python (v3.9 o superior)
* Git

#### **1. Clonar los Repositorios**
Abre tu terminal y clona los tres repositorios en una misma carpeta.

```bash
# Clona este repositorio (Frontend)
git clone https://github.com/JulioMontesinos/Front_Platform_Recognition_Face.git

# Clona el Backend de Autenticación
git clone https://github.com/JulioMontesinos/Back_Platform_Recognition_Face.git

# Clona el Backend de IA
git clone https://github.com/JulioMontesinos/facial_emotion.git
```

#### **2. Configurar y Lanzar el Backend de Autenticación (Node.js)**

# Navega a la carpeta del backend de auth
cd Back_Platform_Recognition_Face

# Instala las dependencias
npm install

# El fichero .env del backend sería algo parecido a esto:

![env](https://github.com/user-attachments/assets/7f6123f2-3cf3-4c9c-beee-dcae33fa34b6)

# El fichero .env del front sería algo parecido a esto:

VITE_BACK_URL=http://localhost:5000

# Inicia el servidor
npm run dev

> 🕒 *El servidor de autenticación debería estar corriendo en `http://localhost:5000`.*

#### **3. Configurar y Lanzar el Backend de IA (Python)**

# Abre una NUEVA terminal y navega a la carpeta del backend de IA
cd facial_emotion

# Crea y activa un entorno virtual
python -m venv env
source env/bin/activate  # En Windows: env\Scripts\activate

# Instala las dependencias
pip install -r requirements.txt

# Inicia el servidor Flask
python server.py

    🕒 El servidor de IA puede tardar un poco en arrancar la primera vez mientras carga el modelo. Debería estar corriendo en http://localhost:5001.

Salida Esperada en la Terminal del Servidor de IA

Una vez que inicies el análisis con la webcam, verás en esta terminal un registro de la actividad en tiempo real. Esto confirma que el frontend se está comunicando con el backend y que la librería DeepFace está procesando las imágenes correctamente.

![image](https://github.com/user-attachments/assets/946d0f55-9fe5-4f19-b163-17f8f6b0cc1a)



#### **4. Configurar y Lanzar el Frontend (React)**

# Abre una TERCERA terminal y navega a la carpeta del frontend
cd Front_Platform_Recognition_Face

# Instala las dependencias
npm install

# Inicia la aplicación de desarrollo
npm run dev

> 🚀 ¡Listo! Abre tu navegador y ve a `http://localhost:5173` para usar la aplicación.
