const fs = require('fs');
const url = require('url');
const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');

if (!process.env.LOCAL_OPENAI_KEY) {
    console.log('No LOCAL_OPENAI_KEY env');
    return;
}

if (!process.env.LOCAL_GOOGLE_KEY) {
    console.log('No LOCAL_GOOGLE_KEY env');
    return;
}

if (!process.env.LOCAL_PERPLEXITY_KEY) {
    console.log('No LOCAL_PERPLEXITY_KEY env');
    return;
}

if (!process.env.LOCAL_ANTHROPIC_KEY) {
    console.log('No LOCAL_ANTHROPIC_KEY env');
    return;
}

async function generateTitleOpenAI(apiKey, language, genre, lyrics) {
    const { generateText } = await import('ai');
    const { createOpenAI } = await import('@ai-sdk/openai');

    var openai;
    
    if(apiKey) {
        openai = createOpenAI({ apiKey: apiKey});
    } else {
        openai = createOpenAI({ apiKey: process.env.LOCAL_OPENAI_KEY});
    }

    let result;
    let prompt;

    if (genre && lyrics) {
        console.log("TRAZA_1");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción de este género: ' + genre + ' y esta letra:' + lyrics;
        } else {
            prompt = 'Give me just a 3-5 word title for a song in this genre: ' + genre + ' and these lyrics:' + lyrics;
        }
        const { text } = await generateText({
            model: openai('gpt-3.5-turbo-0125'),
            prompt: prompt
        });
        result = text;
    } else if (genre && !lyrics) {
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción de este género: ' + genre;
        } else {
            prompt = 'Give me just a 3-5 word title for a song in this genre: ' + genre;
        }
        console.log("TRAZA_2");
        const { text } = await generateText({
            model: openai('gpt-3.5-turbo-0125'),
            prompt: prompt,
        });
        result = text;
    } else if (!genre && lyrics) {
        console.log("TRAZA_3");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción con esta letra: ' + lyrics;
        } else {
            prompt = 'Give me just a 3-5 word title for a song with these lyrics:' + lyrics;
        }
        const { text } = await generateText({
            model: openai('gpt-3.5-turbo-0125'),
            prompt: prompt,
        });
        result = text;
    } else if (!genre && !lyrics) {
        console.log("TRAZA_4");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción única';
        } else {
            prompt = 'Give me just a 3-5 word title for a song';
        }
        const { text } = await generateText({
            model: openai('gpt-3.5-turbo-0125'),
            prompt: prompt,
        });
        result = text;
    }

    return result;
}

async function generateTitleGemini(apiKey, language, genre, lyrics) {
    const { generateText } = await import('ai');
    const { createGoogleGenerativeAI } = await import('@ai-sdk/google');

    var google;
    
    if(apiKey) {
        google = createGoogleGenerativeAI({ apiKey: apiKey});
    } else {
        google = createGoogleGenerativeAI({ apiKey: process.env.LOCAL_GOOGLE_KEY });
    }

    let result;
    let prompt;

    if (genre && lyrics) {
        console.log("TRAZA_1");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción de este género: ' + genre + ' y esta letra:' + lyrics;
        } else {
            prompt = 'Give me just a 3-5 word title for a song in this genre: ' + genre + ' and these lyrics: ' + lyrics;
        }
        const { text } = await generateText({
            model: google('models/gemini-1.5-pro-latest'),
            prompt: prompt
        });
        result = text;
    } else if (genre && !lyrics) {
        console.log("TRAZA_2");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción de este género: ' + genre;
        } else {
            prompt = 'Just give me a 3-5 word title for a song in this genre: ' + genre;
        }
        const { text } = await generateText({
            model: google('models/gemini-1.5-pro-latest'),
            prompt: prompt
        });
        result = text;
    } else if (!genre && lyrics) {
        console.log("TRAZA_3");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción con esta letra: ' + lyrics;
        } else {
            prompt = 'Just give me a 3-5 word title for a song with these lyrics: ' + lyrics;
        }
        const { text } = await generateText({
            model: google('models/gemini-1.5-pro-latest'),
            prompt: prompt,
        });
        result = text;
    } else if (!genre && !lyrics) {
        console.log("TRAZA_4");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción única';
        } else {
            prompt = 'Just give me a 3-5 word title for a single song';
        }
        const { text } = await generateText({
            model: google('models/gemini-1.5-pro-latest'),
            prompt: prompt,
        });
        result = text;
    }

    return result;
}

async function generateTitleLlama(apiKey, language, genre, lyrics) {
    const { generateText } = await import('ai');
    const { createOpenAI } = await import('@ai-sdk/openai');

    var perplexity;
    
    if(apiKey) {
        perplexity = createOpenAI({ 
            apiKey: apiKey,
            baseURL: 'https://api.perplexity.ai'
        });
    } else {
        perplexity = createOpenAI({ 
            apiKey: process.env.LOCAL_PERPLEXITY_KEY,
            baseURL: 'https://api.perplexity.ai'
        });
    }

    let result;
    let prompt;

    if (genre && lyrics) {
        console.log("TRAZA_1");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción de este género: ' + genre + ' y esta letra:' + lyrics;
        } else {
            prompt = 'Give me just a 3-5 word title for a song in this genre: ' + genre + ' and these lyrics: ' + lyrics;
        }
        const { text } = await generateText({
            model: perplexity('llama-3-70b-instruct'),
            prompt: prompt,
        });
        result = text;
    } else if (genre && !lyrics) {
        console.log("TRAZA_2");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción de este género: ' + genre;
        } else {
            prompt = 'Just give me a 3-5 word title for a song in this genre: ' + genre;
        }
        const { text } = await generateText({
            model: perplexity('llama-3-70b-instruct'),
            prompt: prompt,
        });
        result = text;
    } else if (!genre && lyrics) {
        console.log("TRAZA_3");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción con esta letra: ' + lyrics;
        } else {
            prompt = 'Just give me a 3-5 word title for a song with these lyrics: ' + lyrics;
        }
        const { text } = await generateText({
            model: perplexity('llama-3-70b-instruct'),
            prompt: prompt,
        });
        result = text;
    } else if (!genre && !lyrics) {
        console.log("TRAZA_4");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción única';
        } else {
            prompt = 'Just give me a 3-5 word title for a single song';
        }
        const { text } = await generateText({
            model: perplexity('llama-3-70b-instruct'),
            prompt: prompt,
        });
        result = text;
    }

    return result;
}

async function generateTitleClaude(apiKey, language, genre, lyrics) {
    const { generateText } = await import('ai');
    const { createAnthropic } = await import('@ai-sdk/anthropic');

    var anthropic;

    if(apiKey) {
        anthropic = createAnthropic({ 
            apiKey: apiKey
        });
    } else {
        anthropic = createAnthropic({ 
            apiKey: process.env.LOCAL_ANTHROPIC_KEY
        });
    }

    let result;
    let prompt;

    if (genre && lyrics) {
        console.log("TRAZA_1");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción de este género: ' + genre + ' y esta letra:' + lyrics + ', sin comentarios, solo el título';
        } else {
            prompt = 'Give me just a 3-5 word title for a song in this genre: ' + genre + ' and these lyrics: ' + lyrics + ', no comments, just the title';
        }
        const { text } = await generateText({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt,
        });
        result = text;
    } else if (genre && !lyrics) {
        console.log("TRAZA_2");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción de este género: ' + genre + ', sin comentarios, solo el título';
        } else {
            prompt = 'Just give me a 3-5 word title for a song in this genre: ' + genre + ', no comments, just the title';
        }
        const { text } = await generateText({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt
        });
        result = text;
    } else if (!genre && lyrics) {
        console.log("TRAZA_3");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción con esta letra: ' + lyrics + ', sin comentarios, solo el título';
        } else {
            prompt = 'Just give me a 3-5 word title for a song with these lyrics: ' + lyrics + ', no comments, just the title';
        }
        const { text } = await generateText({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt
        });
        result = text;
    } else if (!genre && !lyrics) {
        console.log("TRAZA_4");
        if (language === 'es') {
            prompt = 'Dame solo un título de 3 a 5 palabras para una canción única, sin comentarios, solo el título';
        } else {
            prompt = 'Give me just a 3-5 word title for a single song, no comments, just the title';
        }
        const { text } = await generateText({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt,
        });
        result = text;
    }

    return result;
}

async function generateLyricsOpenAI(apiKey, language, title, genre) {

    const { generateText } = await import('ai');
    const { createOpenAI } = await import('@ai-sdk/openai');

    var openai;
    
    if(apiKey) {
        openai = createOpenAI({ apiKey: apiKey});
    } else {
        openai = createOpenAI({ apiKey: process.env.LOCAL_OPENAI_KEY});
    }

    let result;
    let prompt;

    if (genre && title) {
        console.log("TRAZA_1");
        if (language === 'es') {
            prompt = 'Escribe la letra para una canción única de este género: ' + genre + ' y con este título:' + title;
        } else {
            prompt = 'Write the lyrics for a unique song of this genre: ' + genre + ' and with this title: ' + title;
        }
        const { text } = await generateText({
            model: openai('gpt-3.5-turbo-0125'),
            prompt: prompt
        });
        result = text;
    } else if (genre && !title) {
        console.log("TRAZA_2");
        if (language === 'es') {
            prompt = 'Escribe la letra para una canción única de este género: ' + genre;
        } else {
            prompt = 'Write lyrics for a unique song in this genre: ' + genre;
        }
        const { text } = await generateText({
            model: openai('gpt-3.5-turbo-0125'),
            prompt: prompt,
        });
        result = text;
    } else if (!genre && title) {
        console.log("TRAZA_3");
        if (language === 'es') {
            prompt = 'Escribe la letra para una canción única con este título: ' + title;
        } else {
            prompt = 'Write lyrics for a single song with this title: ' + title;
        }
        const { text } = await generateText({
            model: openai('gpt-3.5-turbo-0125'),
            prompt: prompt
        });
        result = text;
    } else if (!genre && !title) {
        console.log("TRAZA_4");
        if (language === 'es') {
            prompt = 'Escribe la letra para una canción única';
        } else {
            prompt = 'Write lyrics for a unique song';
        }
        const { text } = await generateText({
            model: openai('gpt-3.5-turbo-0125'),
            prompt: prompt,
        });
        result = text;
    }

    return result;
}

async function generateLyricsGemini(apiKey, language, title, genre) {

    const { generateText } = await import('ai');
    const { createGoogleGenerativeAI } = await import('@ai-sdk/google');

    var google;
    
    if(apiKey) {
        google = createGoogleGenerativeAI({ apiKey: apiKey});
    } else {
        google = createGoogleGenerativeAI({ apiKey: process.env.LOCAL_GOOGLE_KEY });
    }

    let result;
    let prompt;

    if (genre && title) {
        console.log("TRAZA_1");
        if (language === 'es') {
            prompt = 'Escribe la letra para una canción única de este género: ' + genre + ' y con este título:' + title;
        } else {
            prompt = 'Write the lyrics for a unique song of this genre: ' + genre + ' and with this title: ' + title;
        }
        const { text } = await generateText({
            model: google('models/gemini-1.5-pro-latest'),
            prompt: prompt,
        });
        result = text;
    } else if (genre && !title) {
        console.log("TRAZA_2");
        if (language === 'es') {
            prompt = 'Escribe la letra para una canción única de este género: ' + genre;
        } else {
            prompt = 'Write lyrics for a unique song in this genre: ' + genre;
        }
        const { text } = await generateText({
            model: google('models/gemini-1.5-pro-latest'),
            prompt: prompt,
        });
        result = text;
    } else if (!genre && title) {
        console.log("TRAZA_3");
        if (language === 'es') {
            prompt = 'Escribe la letra para una canción única con este título: ' + title;
        } else {
            prompt = 'Write lyrics for a single song with this title: ' + title;
        }
        const { text } = await generateText({
            model: google('models/gemini-1.5-pro-latest'),
            prompt: prompt,
        });
        result = text;
    } else if (!genre && !title) {
        console.log("TRAZA_4");
        if (language === 'es') {
            prompt = 'Escribe la letra para una canción única';
        } else {
            prompt = 'Write lyrics for a unique song';
        }
        const { text } = await generateText({
            model: google('models/gemini-1.5-pro-latest'),
            prompt: prompt,
        });
        result = text;
    }

    return result;
}

async function generateLyricsLlama(apiKey, language, title, genre) {

    const { generateText } = await import('ai');
    const { createOpenAI } = await import('@ai-sdk/openai');

    var perplexity;
    
    if(apiKey) {
        perplexity = createOpenAI({ 
            apiKey: apiKey,
            baseURL: 'https://api.perplexity.ai'
        });
    } else {
        perplexity = createOpenAI({ 
            apiKey: process.env.LOCAL_PERPLEXITY_KEY,
            baseURL: 'https://api.perplexity.ai'
        });
    }
    
    let result;
    let prompt;

    if (genre && title) {
        console.log("TRAZA_1");
        if (language === 'es') {
            prompt = 'Escribe solo la letra, sin comentarios, para una canción única de este género: ' + genre + ' y con este título:' + title;
        } else {
            prompt = 'Write only the lyrics, without comments, for a single song of this genre: ' + genre + ' and with this title: ' + title;
        }
        const { text } = await generateText({
            model: perplexity('llama-3-70b-instruct'),
            prompt: prompt,
        });
        result = text;
    } else if (genre && !title) {
        console.log("TRAZA_2");
        if (language === 'es') {
            prompt = 'Escribe solo la letra, sin comentarios, para una canción única de este género: ' + genre;
        } else {
            prompt = 'Write just the lyrics, without comments, for a single song in this genre: ' + genre;
        }
        const { text } = await generateText({
            model: perplexity('llama-3-70b-instruct'),
            prompt: prompt,
        });
        result = text;
    } else if (!genre && title) {
        console.log("TRAZA_3");
        if (language === 'es') {
            prompt = 'Escribe solo la letra, sin comentarios, para una canción única con este título: ' + title;
        } else {
            prompt = 'Write just the lyrics, without comments, for a single song with this title: ' + title;
        }
        const { text } = await generateText({
            model: perplexity('llama-3-70b-instruct'),
            prompt: prompt,
        });
        result = text;
    } else if (!genre && !title) {
        console.log("TRAZA_4");
        if (language === 'es') {
            prompt = 'Escribe solo la letra, sin comentarios, para una canción única';
        } else {
            prompt = 'Write just the lyrics, without comments, for a unique song';
        }
        const { text } = await generateText({
            model: perplexity('llama-3-70b-instruct'),
            prompt: prompt,
        });
        result = text;
    }

    return result;
}

async function generateLyricsClaude(apiKey, language, title, genre) {

    const { generateText } = await import('ai');
    const { createAnthropic } = await import('@ai-sdk/anthropic');

    var anthropic;

    if(apiKey) {
        anthropic = createAnthropic({ 
            apiKey: apiKey
        });
    } else {
        anthropic = createAnthropic({ 
            apiKey: process.env.LOCAL_ANTHROPIC_KEY
        });
    }
    
    let result;
    let prompt;

    if (genre && title) {
        console.log("TRAZA_1");
        if (language === 'es') {
            prompt = 'Escribe unos versos, sin comentarios, para una canción única de este género: ' + genre + ' y con este título:' + title;
        } else {
            prompt = 'Write some verses, without comments, for a unique song of this genre: ' + genre + ' and with this title: ' + title;
        }
        const { text } = await generateText({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt,
        });
        result = text;
    } else if (genre && !title) {
        console.log("TRAZA_2");
        if (language === 'es') {
            prompt = 'Escribe unos versos, sin comentarios, para una canción única de este género: ' + genre;
        } else {
            prompt = 'Write some verses, without comments, for a unique song of this genre: ' + genre;
        }
        const { text } = await generateText({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt,
        });
        result = text;
    } else if (!genre && title) {
        console.log("TRAZA_3");
        if (language === 'es') {
            prompt = 'Escribe unos versos, sin comentarios, para una canción única con este título: ' + title;
        } else {
            prompt = 'Write some verses, without comments, for a unique song with this title: ' + title;
        }
        const { text } = await generateText({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt,
        });
        result = text;
    } else if (!genre && !title) {
        console.log("TRAZA_4");
        if (language === 'es') {
            prompt = 'Escribe unos versos, sin comentarios, para una canción única';
        } else {
            prompt = 'Write some verses, without comments, for a unique song';
        }
        const { text } = await generateText({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt,
        });
        result = text;
    }

    return result;
}

async function generateDescriptionOpenAI(apiKey, language) {

    const { generateText } = await import('ai');
    const { createOpenAI } = await import('@ai-sdk/openai');

    var openai;
    
    if(apiKey) {
        openai = createOpenAI({ apiKey: apiKey});
    } else {
        openai = createOpenAI({ apiKey: process.env.LOCAL_OPENAI_KEY});
    }

    let result;
    let prompt;

    if (language === 'es') {
        prompt = 'Describe la melodia y el género para una cancion que aun no se ha creado, en dos frases o menos';
    } else {
        prompt = 'Describe the melody and genre for a song that has not yet been created, in two sentences or less';
    }

    const { text } = await generateText({
        model: openai('gpt-3.5-turbo-0125'),
        prompt: prompt,
    });

    result = text;

    return result;
}

async function generateDescriptionGemini(apiKey, language) {

    const { generateText } = await import('ai');
    const { createGoogleGenerativeAI } = await import('@ai-sdk/google');

    var google;
    
    if(apiKey) {
        google = createGoogleGenerativeAI({ apiKey: apiKey});
    } else {
        google = createGoogleGenerativeAI({ apiKey: process.env.LOCAL_GOOGLE_KEY });
    }

    let result;
    let prompt;

    if (language === 'es') {
        prompt = 'Describe la melodia y el género para una cancion que aun no se ha creado, en dos frases o menos';
    } else {
        prompt = 'Describe the melody and genre for a song that has not yet been created, in two sentences or less';
    }

    const { text } = await generateText({
        model: google('models/gemini-1.5-pro-latest'),
        prompt: prompt,
    });

    result = text;

    return result;
}

async function generateDescriptionLlama(apiKey, language) {

    const { generateText } = await import('ai');
    const { createOpenAI } = await import('@ai-sdk/openai');

    var perplexity;
    
    if(apiKey) {
        perplexity = createOpenAI({ 
            apiKey: apiKey,
            baseURL: 'https://api.perplexity.ai'
        });
    } else {
        perplexity = createOpenAI({ 
            apiKey: process.env.LOCAL_PERPLEXITY_KEY,
            baseURL: 'https://api.perplexity.ai'
        });
    }
    

    let result;
    let prompt;

    if (language === 'es') {
        prompt = 'Describe la melodia y el género para una cancion que aun no se ha creado, en una frase o menos';
    } else {
        console.log('TRAZA_CA');
        prompt = 'Describe the melody and genre for a song that has not yet been created, in one sentence or less';
    }

    const { text } = await generateText({
        model: perplexity('llama-3-70b-instruct'),
        prompt: prompt,
    });

    result = text;

    return result;
}

async function generateDescriptionClaude(apiKey, language) {

    const { generateText } = await import('ai');
    const { createAnthropic } = await import('@ai-sdk/anthropic');

    var anthropic;

    if(apiKey) {
        anthropic = createAnthropic({ 
            apiKey: apiKey
        });
    } else {
        anthropic = createAnthropic({ 
            apiKey: process.env.LOCAL_ANTHROPIC_KEY
        });
    }

    let result;
    let prompt;

    if (language === 'es') {
        prompt = 'Describe la melodia y el género para una cancion que aun no se ha creado, en una frase o menos';
    } else {
        prompt = 'Describe the melody and genre for a song that has not yet been created, in one sentence or less';
    }

    const { text } = await generateText({
        model: anthropic('claude-3-5-sonnet-20240620'),
        prompt: prompt,
    });

    result = text;

    return result;
}

const hostnameSuno = 'localhost';

const app = express();

const credentials = {
	key: fs.readFileSync('back/server/certificates/key.pem'),
	cert: fs.readFileSync('back/server/certificates/cert.pem')
};

const server = http.createServer(function (req, res) {
	res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
	res.end();
});
const secureServer = https.createServer(credentials, app);

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use('/', express.static(path.join(__dirname, '../front/dist/song-generator/browser')));

app.get('/api/v1/tokens', function (req, res) {
	req.on('error', () => {
		res.status(400).end();
		return;
	});
    
	const options = {
        hostname: hostnameSuno,
		port: 3000,
		path: '/api/get_limit',
		method: 'GET',
		headers: {
            'Accept': 'application/json',
		}
	};
  
	let data = '';
    
    const reqSuno = http.request(options, resSuno => {
        
        resSuno.on('data', d => {
            data += d;
			return;
		});
        
		resSuno.on('end', function () {
            try {
                let jsonData = JSON.parse(data);
                let tokens = jsonData.credits_left;
                res.status(200).send(JSON.stringify(tokens));
            } catch(e) {
                console.error(e);
				res.status(500).end();
            }
			return;
		});
		return;
    });
    
    reqSuno.on('error', error => {
        res.status(400).end();
		return;
    });
    
  	reqSuno.end();

	return;
});

var songData;
var error;

const getSongStatus = (uid) => {

    return new Promise((resolve, reject) => {
        
        const options = {
            hostname: hostnameSuno,
            port: 3000,
            path: '/api/get?ids=' + uid,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        };
    
        let data = '';
    
        const reqSuno = http.request(options, resSuno => {
    
            resSuno.on('data', d => {
                data += d;
                return;
            });
    
            resSuno.on('end', function () {
                try {
                    let jsonData = JSON.parse(data);
    
                    if(jsonData[0].status === 'error') {
                        songData = null;
                        error = jsonData[0].error_message;
                        resolve(true);
                        return;
                    }
    
                    if(jsonData[0].status !== 'complete') {
                        resolve(false);
                        return;
                    }
                    
                    let song = {
                        UID: jsonData[0].id,
                        title: jsonData[0].title,
                        image: jsonData[0].image_url,
                        audioUrl: jsonData[0].audio_url,
                        tags: jsonData[0].tags,
                        duration: jsonData[0].duration,
                        running: false,
                        time: 0,
                        interval: null,
                        lyrics: jsonData[0].lyric
                    };

                    songData = song;
    
                    resolve(true);
    
                } catch(e) {
                    console.error(e);
                    resolve(false);
                }
                return;
            });
            return;
        });
    
        reqSuno.on('error', error => {
            resolve(false);
            return;
        });
    
        reqSuno.end();
    });
}

const waitForCompletion = (uid, interval = 5000) => {
    return new Promise((resolve) => {
        const checkLoop = async () => {
            const isCompleted = await getSongStatus(uid);
            if (isCompleted) {
                resolve();
            } else {
                setTimeout(checkLoop, interval);
            }
        };
        checkLoop();
    });
};

app.post('/api/v1/song', function (req, res) {
	req.on('error', () => {
		res.status(400).end();
		return;
	});

	if (req.body === undefined) {
		res.status(400).send('{\"error\":\"no body content\"}');
		return;
	}

	if (req.body.custom === undefined) {
		res.status(400).send('{\"error\":\"wrong content body\"}');
		return;
	}

    let path = '';
    let sunoOptions = {};

    if (req.body.custom) {
        path = '/api/custom_generate';
        sunoOptions.prompt = req.body.lyrics;
        sunoOptions.tags = req.body.genre;
        sunoOptions.make_instrumental = req.body.instrumental;
        sunoOptions.title = req.body.title;
        sunoOptions.wait_audio = false;
        if(sunoOptions.make_instrumental) {
            sunoOptions.prompt = '[Instrumental]';
        }
    } else {
        path = '/api/generate';
        sunoOptions.prompt = req.body.description;
        sunoOptions.make_instrumental = req.body.instrumental;
        sunoOptions.wait_audio = false;
    }

	const options = {
		hostname: hostnameSuno,
		port: 3000,
		path: path,
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
	};
  
	let data = '';

  	const reqSuno = http.request(options, resSuno => {
  
		resSuno.on('data', d => {
	  		data += d;
			return;
		});

		resSuno.on('end', async function () {
            try {
                if (data === '') {
                    res.status(500).send('{\"error\":\"service not available\"}');
                    return;
                }

                let jsonData = JSON.parse(data);
                
                if (jsonData.error) {
                    if(jsonData.error === 'Internal server error: \"Topic too long.\"') {
                        console.log("TRAZA");
                        res.status(400).send('{\"error\":\"topic too long\"}');
                        return;
                    }
                    else if (jsonData.error === 'Insufficient credits.') {
                        res.status(400).send('{\"error\":\"insufficient credits\"}');
                        return;
                    }
                    res.status(400).send('{\"error\":\"there was an error\"}');
                    return;
                }
                
                let uid = jsonData[0].id;
                
                await waitForCompletion(uid);
                
                if (!songData) {
                    res.status(500).send('{\"error\":\"' + error + '\"}');
                    return;
                }

                console.log('FINISH: ', songData, uid);

                res.status(200).send(JSON.stringify(songData));
            } catch(e) {
                console.error(e);
				res.status(500).end();
            }
			return;
		});
		return;
  	});
  
  	reqSuno.on('error', error => {
		res.status(400).send('{\"error\":\"suno api not working\"}');
		return;
  	});

    reqSuno.write(JSON.stringify(sunoOptions));

  	reqSuno.end();

	return;
});

/*
async function getOpenAiTitule(genre, lyrics) {
    let result = await generateTitleOpenAI(genre, lyrics);
}
*/

app.post('/api/v1/text', async function (req, res) {
	req.on('error', () => {
		res.status(400).end();
		return;
	});

	if (req.body === undefined) {
		res.status(400).send('{\"error\":\"no body content\"}');
		return;
	}

	if (req.body.model === undefined) {
		res.status(400).send('{\"error\":\"wrong content body\"}');
		return;
	}

	if (req.body.option === undefined) {
		res.status(400).send('{\"error\":\"wrong content body\"}');
		return;
	}

	if (req.body.language === undefined) {
		res.status(400).send('{\"error\":\"wrong content body\"}');
		return;
	}
    
    /*
    let text = getOpenAiText('Hola').catch((err) => {
        console.error(err);
        res.status(500).send('{\"error\":\"there was an internal error\"}');
        return;
    });
    */

    let language = req.body.language;
    let result = '';

    if (req.body.option === 'title') {
        let genres;
        let lyrics;
    
        if (req.body.genres !== undefined) {
            genres = req.body.genres;
        }
    
        if (req.body.lyrics !== undefined) {
            lyrics = req.body.lyrics;
        }

        if (req.body.model === 'openai') {
            result = await generateTitleOpenAI(null, language, genres, lyrics);
            result = result.replaceAll('"', '');
        } else if (req.body.model === 'gemini') {
            result = await generateTitleGemini(null, language, genres, lyrics);
            if (result.indexOf('*') > -1) {
                result = result.substring(result.indexOf('*') + 2, result.lastIndexOf('*') - 1);
            }
            console.log(result);
        } else if (req.body.model === 'llama') {
            result = await generateTitleLlama(null, language, genres, lyrics);
            if (result.indexOf('"') > -1) {
                result = result.substring(result.indexOf('"') + 1, result.lastIndexOf('"'));
            }
            console.log(result);
        } else if (req.body.model === 'claude') {
            result = await generateTitleClaude(null, language, genres, lyrics);
            if (result.indexOf('"') > -1) {
                result = result.substring(result.indexOf('"') + 1, result.lastIndexOf('"'));
            }
            console.log(result);
        }
    }
    else if (req.body.option === 'lyrics') {
        let title;
        let genres;
    
        if (req.body.genres !== undefined) {
            genres = req.body.genres;
        }
    
        if (req.body.title !== undefined) {
            title = req.body.title;
        }

        if (req.body.model === 'openai') {
            result = await generateLyricsOpenAI(null, language, title, genres);
        } else if (req.body.model === 'gemini') {
            result = await generateLyricsGemini(null, language, title, genres);
        } else if (req.body.model === 'llama') {
            result = await generateLyricsLlama(null, language, title, genres);
            result = result.substring(result.indexOf('\n') + 1);
            console.log(result);
        } else if (req.body.model === 'claude') {
            result = await generateLyricsClaude(null, language, title, genres);
            console.log(result);
        }
    }
    else if (req.body.option === 'description') {
        if (req.body.model === 'openai') {
            result = await generateDescriptionOpenAI(null, language);
        } else if (req.body.model === 'gemini') {
            result = await generateDescriptionGemini(null, language);
            console.log(result);
        } else if (req.body.model === 'llama') {
            result = await generateDescriptionLlama(null, language);
            console.log("TRAZA_1", result);
            if (language === 'es') {
                if (result.indexOf('"') > -1) {
                    result = result.substring(result.indexOf('"') + 1, result.lastIndexOf('"'));
                }
            }
            console.log("TRAZA_2", result);
        } else if (req.body.model === 'claude') {
            result = await generateDescriptionClaude(null, language);
            console.log(result);
        }
    }

    res.status(200).send(JSON.stringify(result));

	return;
});

app.get( '**', function (req, res) {
	req.on('error', () => {
		res.status(400).end();
		return;
	});
	res.sendFile(path.join(__dirname, '../front/dist/song-generator/browser/index.html'));
	return;
});

server.listen(80);
secureServer.listen(443);
