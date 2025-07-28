export default async function routes(fastify, opts){
    fastify.post('/create', { preHandler: [fastify.authenticate]}, async (requestAnimationFrame,reply) => {
        //handle lobby creation
    });

    fastify.post('/join', { preHandler: [fastify.authenticate]}, async (requestAnimationFrame,reply) => {
        //handle join lobby
    });
}
