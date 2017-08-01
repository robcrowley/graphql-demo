const base64 = text => new Buffer(text, 'utf8').toString('base64');

const unbase64 = text => new Buffer(text, 'base64').toString('utf8');

export const toGlobalId = (model, idFn) => base64([model.constructor.name, idFn(model)].join(':'));

export const fromGlobalId = globalId => {
  const [ id, type ] = unbase64(globalId).split(':', 2);
  return { id, type };
}

export const extractId = (args, idName) => {
    if (args[idName]) {
        return args[idName];
    }

    if (args.id) {
        const { id } = fromGlobalId(args.id);
        if (!id || id === '') {
            throw new Error(`No valid identifier extracted from ${args.id}`);
        }
        return id;
    }
    throw new Error(`An id or ${idName} argument is required`);
}