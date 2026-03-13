# 🧠 Guía de Contribución: Quizzes de BRAIN BOX FTC

Este directorio centraliza todos los cuestionarios (quizzes) de la plataforma. Para mantener el orden y permitir que el sistema cargue las preguntas automáticamente, seguimos una estructura de **Carpeta por Curso** y **Archivo por Lección**.

---

## 📂 Estructura de Archivos

Cada curso debe tener su propia carpeta. El nombre de la carpeta debe coincidir con el `slug` o `ID` del curso.

```text
src/data/quizzes/
├── es/
│   └──ftc-robotics-101/         <-- Carpeta del curso
│       ├── lesson-1.json         <-- Quiz de la lección 1
│       └──lesson-2.json         <-- Quiz de la lección 2
└── en/
    └──ftc-robotics-101/         <-- Carpeta del curso
        ├── lesson-1.json         <-- Quiz de la lección 1
        └──lesson-2.json         <-- Quiz de la lección 2
```
---

## 🛠️ Plantilla del Quiz (JSON)
Crea un archivo .json y utiliza el siguiente formato:

```json
{
  "quizTitle": "Título del Cuestionario",
  "quizSynopsis": "Breve descripción de lo que el estudiante aprenderá o validará en este quiz.",
  "questions": [
    {
      "question": "¿Cuál es la pregunta?",
      "answers": [
        "Opción índice 0",
        "Opción índice 1",
        "Opción índice 2",
        "Opción índice 3"
      ],
      "correctAnswer": 1
    }
  ]
}
```
---

## 📝 Especificaciones de los Campos

| Campo | Descripción |
| :--- | :--- |
| **`quizTitle`** | Nombre que aparecerá en la cabecera del cuestionario. |
| **`quizSynopsis`** | Breve descripción del objetivo o contenido del quiz. |
| **`question`** | El texto de la pregunta a realizar. |
| **`answers`** | Lista (Array) de opciones posibles para responder. |
| **`correctAnswer`** | **Importante**: Es el índice numérico (empezando en 0) de la respuesta correcta, representado como string (ej: "1"). |
