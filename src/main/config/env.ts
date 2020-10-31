export default {
  app: {
    basePath: process.env.PWD,
    tempDir: '.tmp',
    port: process.env.APP_PORT || 3000
  },
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/12min-challenge',
    collections: {
      users: process.env.MONGO_COLLECTIONS_USERS || 'users',
      audiobookStatuses: process.env.MONGO_COLLECTIONS_AUDIOBOOK_STATUSES || 'audiobookStatuses',
      audiobooks: process.env.MONGO_COLLECTIONS_AUDIOBOOKS || 'audiobooks'
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
  route: {
    base: '/api',
    addUser: process.env.ROUTE_ADD_USER || '/user',
    authenticateUser: process.env.ROUTE_AUTHENTICATE_USER || '/auth',
    addAudiobook: process.env.ROUTE_ADD_AUDIOBOOK || '/audiobook'
  }
}
