# 10X-AI

Experimental LLM chatbot integration for 10X Hub. Includes a interface and server.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/deepseek-test-1.git
    ```

2. Install the dependencies:
    ```sh
    cd backend
    npm install
    ```

3. Create a `.env` file in the `backend` directory and add API keys, server ports, VPS addresses, API endpoints as needed:
    ```env
    OPENAI_1=your_openai_api_key
    DEEPSEEK_1=your_deepseek_api_key
    OPEN_ROUTER_1=your_openrouter_api_key
    PORT=5000
    ```
    Additional variables may be needed for running models via Ollama:
    ```env
    ADDRESS=VPS_ADDRESS
    WSL=OPTIONAL_WSL_ADDRESS
    POINTER_IP=OPTIONAL_LOCALHOST_POINTER_PORT
    OLLAMA_PORT=11434
    ```

## Usage

1. Start the backend server:
    ```sh
    npm start
    ```

2. Open `index.html` in a browser (any method)

## API Endpoints

### Ollama Endpoint

- **POST** `/ollama/deepseek/r1`
    - Handles requests to the  Ollama.

### OpenAI Endpoint

- **POST** `/openai/4o`
    - Handles requests to the OpenAI API.

### DeepSeek Endpoint

- **POST** `/deepseek/v3`
    - Handles requests to the DeepSeek API.

### OpenRouter Endpoint

- **POST** `/openrouter/deepseek/v3`
    - Handles requests to the OpenRouter API.

## License

This project is licensed under the GPL-3.0 License.