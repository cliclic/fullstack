interface LocalStore {
    authenticated: boolean
}

class LocalState {
    store: LocalStore;

    constructor() {
        this.store = {
            authenticated: false
        }
    }
}

export const localState = new LocalState();
