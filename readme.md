# DeepSeek Test 1

This project is a web application that integrates with OpenAI's API to provide AI-powered responses. It includes a backend server built with Express.js and a frontend interface for user interaction.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/deepseek-test-1.git
    cd deepseek-test-1
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```env
    OPENAI_1=your_openai_api_key
    DEEPSEEK_1=your_deepseek_api_key
    OPEN_ROUTER_1=your_openrouter_api_key
    ```

## Usage

1. Start the backend server:
    ```sh
    npm start
    ```

2. Open your browser and navigate to `http://localhost:5000`.

## Project Structure
deepseek-test-1/ ├── backend/ │ ├── routes/ │ │ ├── openai.js │ │ ├── deepseek.js │ │ └── openRouter.js │ ├── users.json │ ├── info.js │ └── server.js ├── frontend/ │ ├── index.html │ ├── index.js │ └── styles/ │ └── style.css └── .env

## API Endpoints

### OpenAI Endpoint

- **POST** `/openai/4o`
    - Description: Handles requests to the OpenAI API.
    - Request Body:
        ```json
        {
            "message": "Your message here"
        }
        ```
    - Response:
        ```json
        {
            "response": "AI response here"
        }
        ```

### DeepSeek Endpoint

- **POST** `/deepseek/v3`
    - Description: Handles requests to the DeepSeek API.
    - Request Body:
        ```json
        {
            "message": "Your message here"
        }
        ```
    - Response:
        ```json
        {
            "response": "AI response here"
        }
        ```

### OpenRouter Endpoint

- **POST** `/openrouter/deepseek/v3`
    - Description: Handles requests to the OpenRouter API.
    - Request Body:
        ```json
        {
            "message": "Your message here"
        }
        ```
    - Response:
        ```json
        {
            "response": "AI response here"
        }
        ```

## Environment Variables

- `OPENAI_1`: Your OpenAI API key.
- `DEEPSEEK_1`: Your DeepSeek API key.
- `OPEN_ROUTER_1`: Your OpenRouter API key.

## License

This project is licensed under the MIT License.