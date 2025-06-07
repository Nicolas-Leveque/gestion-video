// This file contains setup code that will be executed before each test file

// Mock the Electron modules since they won't be available in the test environment
jest.mock('electron', () => {
  return {
    app: {
      getPath: jest.fn().mockReturnValue('/tmp/test'),
    },
    ipcMain: {
      handle: jest.fn(),
      on: jest.fn(),
    },
    ipcRenderer: {
      invoke: jest.fn(),
      send: jest.fn(),
      on: jest.fn(),
    },
    contextBridge: {
      exposeInMainWorld: jest.fn(),
    },
    BrowserWindow: jest.fn().mockImplementation(() => ({
      loadURL: jest.fn(),
      on: jest.fn(),
      webContents: {
        openDevTools: jest.fn(),
      },
    })),
  };
});

// Mock the fs module to avoid actual file system operations during tests
jest.mock('fs', () => {
  const originalFs = jest.requireActual('fs');
  return {
    ...originalFs,
    promises: {
      ...originalFs.promises,
      readFile: jest.fn().mockResolvedValue(Buffer.from('test')),
      writeFile: jest.fn().mockResolvedValue(undefined),
      unlink: jest.fn().mockResolvedValue(undefined),
      readdir: jest.fn().mockResolvedValue([]),
      mkdir: jest.fn().mockResolvedValue(undefined),
    },
    existsSync: jest.fn().mockReturnValue(true),
    mkdirSync: jest.fn(),
    accessSync: jest.fn(),
  };
});

// Mock the sqlite3 and sequelize modules
jest.mock('sqlite3', () => ({
  Database: jest.fn(),
}));

jest.mock('sequelize', () => {
  const mSequelize = {
    authenticate: jest.fn().mockResolvedValue(),
    define: jest.fn().mockReturnValue({
      findAll: jest.fn().mockResolvedValue([]),
      findByPk: jest.fn().mockResolvedValue(null),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((data) => Promise.resolve({ ...data, id: 1 })),
      destroy: jest.fn().mockResolvedValue(1),
      update: jest.fn().mockResolvedValue([1]),
      belongsToMany: jest.fn(),
      hasMany: jest.fn(),
      belongsTo: jest.fn(),
    }),
    query: jest.fn().mockResolvedValue([[], []]),
    transaction: jest.fn().mockImplementation((fn) => fn({ commit: jest.fn(), rollback: jest.fn() })),
    literal: jest.fn().mockReturnValue('LITERAL'),
    Op: {
      like: Symbol('like'),
      in: Symbol('in'),
      gte: Symbol('gte'),
      lte: Symbol('lte'),
    },
  };
  
  return {
    Sequelize: jest.fn(() => mSequelize),
    DataTypes: {
      INTEGER: 'INTEGER',
      STRING: 'STRING',
      TEXT: 'TEXT',
      DATE: 'DATE',
      NOW: 'NOW',
    },
    Op: {
      like: Symbol('like'),
      in: Symbol('in'),
      gte: Symbol('gte'),
      lte: Symbol('lte'),
    },
  };
});

// Mock the sharp module
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue({}),
  }));
});

// Set up global variables that might be needed in tests
global.console = {
  ...console,
  // Silence console logs during tests
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};