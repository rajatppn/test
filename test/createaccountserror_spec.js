TU1_FN = "Test";
TU1_LN = "User1";
TU1_EMAIL = "testuser1@example.com";
TU_EMAIL_REGEX = 'testuser*';

var frisby = require('frisby');
var tc = require('./config/test_config');

frisby.create('POST missing firstName')
    .post(tc.url + '/user/enroll',
          { 'lastName' : TU1_LN,
            'email' : TU1_EMAIL})
    .expectStatus(400)
    .expectHeader('Content-Type', 'application/json; charset=utf-8')
    .expectJSON({'error' : 'Undefined First Name'})
    .toss()

frisby.create('POST invalid email address')
    .post(tc.url + '/user/enroll',
          { 'firstName' : TU1_FN,
            'lastName' : TU1_LN,
            'email' : "invalid.email"})
    .expectStatus(400)
    .expectHeader('Content-Type', 'application/json; charset=utf-8')
    .expectJSONTypes({'error' : String})
    .toss()
