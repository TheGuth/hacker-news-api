exports.DATABASE_URL = process.env.DATABASE_URL ||
                     global.DATABASE_URL ||
                     'mongodb://me:pass@ds163679.mlab.com:63679/hackerapi';

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                            global.TEST_DATABASE_URL ||
                            'mongodb://localhost/test-hn-api';

exports.PORT = process.env.PORT || 8080;
