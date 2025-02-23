# DeepSeek Test 1

Preliminary failed DeekSeek API experiment for 10X Hub. Includes a interface and server.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
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

3. Create a `.env` file in the `backend` directory and add API keys:
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

2. Open `index.html` in a browser (any method)

## API Endpoints

### OpenAI Endpoint

- **POST** `/openai/4o`
    - Handles requests to the OpenAI API.
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
    - Handles requests to the DeepSeek API.
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
    - Handles requests to the OpenRouter API.
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

This project is licensed under the GPL-3.0 License.