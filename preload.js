const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // Send messages to main process
    send: (channel, data) => {
      // Whitelist channels
      const validChannels = ['film:create', 'film:read', 'film:update', 'film:delete', 
                            'category:create', 'category:read', 'category:update', 'category:delete',
                            'format:create', 'format:read', 'format:update', 'format:delete',
                            'exemplaire:create', 'exemplaire:read', 'exemplaire:update', 'exemplaire:delete'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    // Receive messages from main process
    receive: (channel, func) => {
      const validChannels = ['film:created', 'film:read', 'film:updated', 'film:deleted',
                            'category:created', 'category:read', 'category:updated', 'category:deleted',
                            'format:created', 'format:read', 'format:updated', 'format:deleted',
                            'exemplaire:created', 'exemplaire:read', 'exemplaire:updated', 'exemplaire:deleted'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    // Invoke methods and get responses (synchronous)
    invoke: async (channel, ...args) => {
      const validChannels = [
        // Film channels
        'film:get', 'film:getAll', 'film:search', 'film:create', 'film:update', 'film:delete',
        // Category channels
        'category:get', 'category:getAll', 'category:getWithFilmCount', 'category:create', 'category:update', 'category:delete',
        // Format channels
        'format:get', 'format:getAll', 'format:getWithExemplaireCount', 'format:create', 'format:update', 'format:delete',
        // Exemplaire channels
        'exemplaire:get', 'exemplaire:getAll', 'exemplaire:getByFilm', 'exemplaire:getByFormat', 
        'exemplaire:create', 'exemplaire:update', 'exemplaire:delete',
        // Poster channels
        'poster:download', 'poster:store', 'poster:get', 'poster:resize', 'poster:delete', 'poster:clearCache'
      ];
      if (validChannels.includes(channel)) {
        return await ipcRenderer.invoke(channel, ...args);
      }
    }
  }
);
