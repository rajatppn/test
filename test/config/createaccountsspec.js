TEST_USERS = [{'fn' : 'Test', 'ln' : 'User1',
               'email' : 'testuser1@example.com'},
              {'fn' : 'Test', 'ln' : 'User2',
               'email' : 'testuser2@example.com'},
              {'fn' : 'Test', 'ln' : 'User3',
               'email' : 'testuser3@example.com'}]

var frisby = require('frisby');
var tc = require('./config/test_config');

TEST_USERS.forEach(function createUser(user, index, array) {
    frisby.create('POST enroll user ' + user.email)
        .post(tc.url + '/user/enroll',
              { 'firstName' : user.fn,
                'lastName' : user.ln,
                'email' : user.email})
        .expectStatus(201)
        .expectHeader('Content-Type', 'application/json; charset=utf-8')
        .expectJSON({ 'firstName' : user.fn,
                      'lastName' : user.ln})
        .toss()
});

frisby.create('POST enroll duplicate user ')
    .post(tc.url + '/user/enroll',
          { 'firstName' : TEST_USERS[0].fn,
            'lastName' : TEST_USERS[0].ln,
            'email' : TEST_USERS[0].email})
    .expectStatus(400)
    .expectHeader('Content-Type', 'application/json; charset=utf-8')
    .expectJSON({'error' : 'Account with that email already exists.  Please choose another email.'})
    .toss()
