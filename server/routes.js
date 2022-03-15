import config from "./config.js";
import { Controller } from "./controller.js";
import { logger } from "./util.js";

const controller = new Controller();

async function routes(req, res) {
    const { constants, location, pages } = config;
    const { method, url } = req;
    const { homeHTML, controllerHTML } = pages;

    if (method === "GET" && url === "/") {
        // se rota /, redirecionar para /home
        res.writeHead(302, {
            'Location': location.home
        });

        return res.end();
    }

    if (method === "GET" && url === "/home") {

        //Q: por que esta sendo usado stream aqui para processar o html?
        const { stream, type } = await controller.getFileStream(homeHTML);

        //padrao de reponse e text/html
        // response.writeHead(200, {
        //     'Content-Type': 'text/html'
        // });

        // Q: o que faz stream.pipe ?
        return stream.pipe(res);
    }

    if (method === "GET" && url === "/controller") {

        //Q: por que esta sendo usado stream aqui para processar o html?
        const { stream, type } = await controller.getFileStream(controllerHTML);

        //padrao de reponse e text/html
        // response.writeHead(200, {
        //     'Content-Type': 'text/html'
        // });

        // Q: o que faz stream.pipe ?
        return stream.pipe(res);
    }


    //files
    if (method === 'GET') {
        // saber content type
        // saber arquivo que chamou
        const { stream, type } = await controller.getFileStream(url);
        const contentType = constants?.CONTENT_TYPE[type];

        if (contentType) {
            res.writeHead(200, {
                'Content-Type': contentType
            })
        }


        return stream.pipe(res);
    }

    return res.end('hello');
}

function handlerError(error, response) {
    if (error.message.includes('ENOENT')) {
        logger.warn('asset not found' + error.stack)
        response.writeHead(404);
        return response.end();
    }

    logger.error('caught error on API' + error.stack)
}

export function handler(request, response) {
    return routes(request, response)
        .catch(error => handlerError(error, response))
}