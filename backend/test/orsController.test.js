require('dotenv').config();
const request = require('supertest');
const {app, disconnect} = require('../src/app');
const {toMatchImageSnapshot} = require('jest-image-snapshot');
expect.extend({toMatchImageSnapshot});

afterAll(disconnect);

describe('Conditional test using the ors endpoint', () => {
  const testIfORSAPIKeyAvailable =
      process.env.ORS_API_KEY === undefined ? test.skip : test;
  testIfORSAPIKeyAvailable(
      'it should respond to the GET method on the directions endpoint',
      (done) => {
        request(app)
            .get(
                '/api/ors/directions?coordinates=-87.631019,%2041.886248%7C-87.623788,%2041.883051&profile=foot-walking')
            .then((response) => {
              expect(response.statusCode).toBe(200);
              expect(typeof response.body).toBe('object');
              expect(Array.isArray(response.body['routes'])).toBe(true);
              expect(
                  response.body['routes'][0]['segments'][0]['steps'][4]['name'])
                  .toBe('Pedway');
              done();
            });
      });

  testIfORSAPIKeyAvailable(
      'a tile PNG should be returned from the GET method on the mapsurfer endpoint',
      (done) => {
        request(app)
            // Get a Mapsurfer tile for Millennium Park
            .get('/api/ors/mapsurfer/15/8407/12178.png')
            .then((response) => {
              expect(response.statusCode).toBe(200);
              expect(response.body).toMatchImageSnapshot({
                customSnapshotIdentifier: 'orsController_millenniumParkTile',
              });
              done();
            });
      });

  testIfORSAPIKeyAvailable(
      'a tile PNG should be returned from the GET method on the mapsurfer endpoint',
      (done) => {
        request(app)
            // Get a Mapsurfer tile for Millennium Park
            .get('/api/ors/mapsurfer/15/8407/12178.png')
            .then((response) => {
              expect(response.statusCode).toBe(200);
              expect(response.body).toMatchImageSnapshot({
                customSnapshotIdentifier: 'orsController_millenniumParkTile',
              });
              done();
            });
      });
});
