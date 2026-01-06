const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

const sessionStorage = {
    run: (req, callback) => {
        asyncLocalStorage.run(new Map(), () => {
            asyncLocalStorage.getStore().set('session', req.session);
            callback();
        });
    },
    getSession: () => {
        const store = asyncLocalStorage.getStore();
        return store ? store.get('session') : null;
    }
};

module.exports = sessionStorage;