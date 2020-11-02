export default {
  app: {
    basePath: process.env.PWD,
    port: process.env.APP_PORT || 3000,
    tempDir: process.env.APP_TEMP_DIR || '.tmp',
    queryLimit: parseInt(process.env.APP_QUERY_LIMIT || '50'),
    queryListSeparator: process.env.APP_QUERY_LIST_SEPARATOR || ','
  },
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/12min-challenge',
    collections: {
      users: process.env.MONGO_COLLECTIONS_USERS || 'users',
      audiobooks: process.env.MONGO_COLLECTIONS_AUDIOBOOKS || 'audiobooks',
      audiobookStatuses: process.env.MONGO_COLLECTIONS_AUDIOBOOK_STATUSES || 'audiobookStatuses'
    }
  },
  converters: {
    fileExtensionMatchers: (process.env.CONVERTERS_FILE_EXTENSION_MATCHERS || '.mp3,.wav').split(',')
  },
  cryptography: {
    salt: parseInt(process.env.CRYPTOGRAPHY_SALT || '12')
  },
  authentication: {
    secret: process.env.AUTHENTICATION_SECRET || '12min-challenge',
    expiresIn: parseInt(process.env.AUTHENTICATION_EXPIRES_IN || 60 * 60 * 6 + '') // 6 hours
  },
  routes: {
    base: '/api',
    addUser: process.env.ROUTES_ADD_USER || '/user',
    authenticateUser: process.env.ROUTES_AUTHENTICATE_USER || '/auth',
    addAudiobook: process.env.ROUTES_ADD_AUDIOBOOK || '/audiobook',
    getAudiobook: (process.env.ROUTES_GET_AUDIOBOOK || '/audiobook') + '/:audiobookId',
    removeAudiobook: (process.env.ROUTES_REMOVE_AUDIOBOOK || '/audiobook') + '/:audiobookId',
    searchAudiobooks: process.env.ROUTES_ADD_AUDIOBOOKS || '/audiobook'
  },
  workers: {
    intervalTime: parseInt(process.env.WORKERS_INTERVAL_TIME || '3')
  }
}
