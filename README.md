# 🎭 Facial Emotion Analysis in Real Time

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![DeepFace](https://img.shields.io/badge/DeepFace-4A4A4A?style=for-the-badge&logo=tensorflow&logoColor=FF6F00)

This project is a full-stack web application designed to analyze facial emotions from static images or from a real-time video stream from the user's webcam.

---

Given that the architecture of this project is complex for public deployment (The deep-face libraries are extremely large), I have published all the code so you can install it on your system and test it.


#### Uploaded Image Analysis

![4](https://github.com/user-attachments/assets/c9bcb02c-097b-47c9-bbed-a1b53505efef)


#### Real-Time Analysis with Webcam

![2](https://github.com/user-attachments/assets/8f023de9-c516-4ca7-b31a-e317390c87c7)

---

### ✨ Main Features

* **Complete Authentication System**: User registration and login with JWT tokens to protect routes.
* **Image Analysis**: Upload an image file (JPG, PNG) and the application will detect the predominant facial emotion and a ranking of the most probable ones.
* **Real-Time Analysis**: Activate the webcam to get continuous analysis of your facial expressions, with an overlay showing the detected emotion at each moment.
* **Reactive Interface**: Built with React for a smooth and dynamic user experience.

---

### 🏗️ Project Architecture

This project follows a microservices architecture, composed of three independent parts that communicate with each other:

1.  **Frontend (This Repository)**: A single-page application (SPA) built with **React** that manages the user interface and interaction.
2.  **Authentication Backend**: A server in **Node.js** with **Express** that handles user registration, login, and user validation through JWT.
    * **[🔗 View Authentication Backend Repository](https://github.com/JulioMontesinos/Back_Platform_Recognition_Face)**
3.  **AI Backend (Facial Analysis)**: A server in **Python** with **Flask** that uses the **DeepFace** and **OpenCV** libraries to perform all image processing and analysis.
    * **[🔗 View AI Backend Repository](https://github.com/JulioMontesinos/facial_emotion)**

## Architecture Analysis and Data Flows

Frontend (Client): A React application that runs in the user's browser. It is responsible for the entire interface and client-side state management (such as the authentication token).

    Authentication Backend (Node.js Server): A REST API built with Express that manages users exclusively. Its main logic includes:

        Validating credentials against the database designed for MongoDB.

        Hashing passwords with bcrypt.

        Creating and validating JSON Web Tokens (JWT) for sessions.

    AI Backend (Python Server): A Flask server dedicated to heavy computation. Its main logic includes:

        Receiving images and video frames.

        Using OpenCV for image pre-processing (decoding, color conversion, resizing).

        Using the DeepFace library (with TensorFlow underneath) to run the emotion analysis model.

        Serving a live video stream.

Detailed Data Flows:

1. Authentication Flow:

    Step 1: The user enters their email and password in the React form.

    Step 2: The frontend sends a POST request to /api/auth/login on the Node.js server.

    Step 3: The Node.js server searches for the user by email and compares the hashed password using bcrypt.

    Step 4: If the credentials are valid, it generates a JWT and returns it to the frontend.

    Step 5: The React frontend saves the JWT in localStorage to authenticate future requests to protected routes.

2. Emotion Analysis Flow (Image and Video)

    Step 1: From a protected route, the user uploads an image or activates the webcam.

    Step 2 (Image): The frontend sends the image in a FormData to the /analyze-image route on the Python/Flask server.

   Step 2 (Webcam): The frontend does two things in parallel:

        Establishes a GET connection to /video_feed to receive the video stream.

        Periodically, captures a frame and sends it via POST to /analyze-image.

    Step 3: The Flask server receives the image, OpenCV pre-processes it, and DeepFace analyzes it.

    Step 4: The Flask server returns a JSON object with the dominant emotion, confidence percentage, and an emotion ranking.

    Step 5: The React frontend receives this JSON and updates the interface to display the results to the user.

### 🛠️ Technologies Used

* **Frontend**: React, Vite, Axios, JWT-Decode, React Router.
* **Backend (Authentication)**: Node.js, Express, bcryptjs, JSON Web Token (JWT), CORS.
* **Backend (IA)**: Python, Flask, DeepFace, TensorFlow, OpenCV, NumPy.

---

### 🚀 How to Run this Project Locally

To run this project, you will need to have all three servers running simultaneously.

#### **Prerequisites**
* Node.js (v18 o superior)
* Python (v3.9 o superior)
* Git

#### **1. Clone the repositories**
Open your terminal and clone the three repositories in the same folder.

```bash
# Clone the Repository (Frontend)
git clone https://github.com/JulioMontesinos/Front_Platform_Recognition_Face.git

# Clone the Authentication Backend
git clone https://github.com/JulioMontesinos/Back_Platform_Recognition_Face.git

# Clone the AI Backend
git clone https://github.com/JulioMontesinos/facial_emotion.git
```

#### **2. Configure and Launch the Authentication Backend (Node.js)**

# Navigate to the auth backend folder
cd Back_Platform_Recognition_Face

# Install dependencies
npm install

# The .env file of the backend would be something like this:

![env](https://github.com/user-attachments/assets/7f6123f2-3cf3-4c9c-beee-dcae33fa34b6)

# The .env file of the front would be something like this:

VITE_BACK_URL=http://localhost:5000

# Start the server
npm run dev

> 🕒 *The authentication server should be running at `http://localhost:5000`.*

#### **3. Configure and Launch the AI Backend (Python)**

# Open a NEW terminal and navigate to the AI backend folder
cd facial_emotion

# Create and activate a virtual environment
python -m venv env
source env/bin/activate  # En Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python server.py

    🕒 The AI server may take a while to start the first time while loading the model. It should be running at http://localhost:5001.

Once you start the analysis with the webcam, you will see in this terminal a log of the activity in real time. This confirms that the frontend is communicating with the backend and that the DeepFace library is processing the images correctly.

Expected Output in the AI Server Terminal:

![image](https://github.com/user-attachments/assets/946d0f55-9fe5-4f19-b163-17f8f6b0cc1a)


#### **4. Configure and Launch the Frontend (React)**

# Open a THIRD terminal and navigate to the frontend folder
cd Front_Platform_Recognition_Face

# Install dependencies
npm install

# Start the development application
npm run dev

> 🚀 Ready! Open your browser and go to http://localhost:5173 to use the application.
