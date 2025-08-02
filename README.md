TaskMaster AI: To-Do Manager with AI Assistant
TaskMaster AI is a simple yet powerful to-do list application built with a modern tech stack. It allows users to manage their daily tasks efficiently and includes an integrated AI assistant to help with questions and brainstorming.

This project was built to demonstrate proficiency in frontend development, API integration, and modern web technologies.

Features
Create, Edit, & Delete Tasks: Full CRUD functionality for managing your to-do list.

Mark Tasks as Complete: Easily toggle the completion status of any task.

Task Filtering: View all tasks, or filter to see only 'Active' or 'Completed' items.

Persistent Storage: Your to-do list is automatically saved in the browser's local storage, so your tasks are there when you return.

AI Assistant: Ask any question to an integrated Google Gemini assistant and get an instant answer.

Sleek Dark Mode UI: A professional and clean "Midnight Slate" dark theme built with Tailwind CSS.

Responsive Design: The layout is fully responsive and works beautifully on desktop, tablets, and mobile devices.

Smart UI Elements: The "Clear Completed" button only appears when there are tasks to clear, creating a cleaner user experience.

Tech Stack
Frontend: Next.js (React Framework)

Styling: Tailwind CSS

AI Integration: Google Gemini API

Setup and How to Run Locally
Follow these steps to get the project running on your local machine.

Prerequisites
Node.js (v18 or later)

npm or yarn

1. Clone the Repository
First, clone your project from GitHub to your local machine.

git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
cd your-repository-name

2. Install Dependencies
Install all the necessary packages for the project.

npm install

3. Add Your API Key (Crucial Step!)
The AI Assistant will not work without a valid API key.

Get your key: Visit Google AI Studio to get your free Gemini API key.

Add the key to the code:

Open the file located at pages/index.js (or pages/index.tsx).

Find the getAiResponse function.

Locate the following line:

const apiKey = "YOUR_API_KEY_HERE";

Replace "YOUR_API_KEY_HERE" with the actual API key you copied from Google AI Studio.

**Warning
