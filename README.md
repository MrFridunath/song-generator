# SongGenerator

Web app desarrollada para el Hackathon de Vercel y MiduDev de Julio de 2024

## PRE REQUISITOS
1. [Node 20+][1]
2. Clonar y ejecutar el repositorio en local: [suno-api][2]
3. Tener un certificado (cert.pem) y clave (key.pem) SSL en el directorio /back/server/certificates, para ejecutar el servidor con HTTPS
4. Renombrar el fichero .env.example a .env, poniendo las variables de entorno respectivas a las API Keys de: [ChatGPT][3], [Gemini][4], [Llama (Perplexity)][5] y [Claude (Anthropic)][6]

## INSTALACIÓN Y COMPILACIÓN
```
npm install
ng build
````

## EJECUCIÓN EN LOCAL
```
node --env-file=.env back/server.js
````

[1]:https://nodejs.org/en/ "Node.js"
[2]:https://github.com/gcui-art/suno-api "suno-api"
[3]:https://platform.openai.com/organization/api-keys "ChatGPT API Key"
[4]:https://aistudio.google.com/app/apikey?hl=es-419 "Gemini API Key"
[5]:https://www.perplexity.ai/settings/api "Llama (Perplexity) API Key"
[6]:https://console.anthropic.com/settings/keys "Claude (Anthropic) API Key"
