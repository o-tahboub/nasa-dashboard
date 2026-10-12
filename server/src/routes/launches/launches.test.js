const app = require('../../app');
const {
    connectMongo,
    disconnectMongo
} = require('../../services/mongo')

const request = require('supertest');

describe('/v1/launches API endpoints', () => {
    beforeAll(() => {
        connectMongo();
    });
    afterAll(() => {
        disconnectMongo();
    });

    describe('GET /v1/launches', () => {
        test('returns 200 status and array of launches', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect(200)
                .expect('Content-Type', /json/);
        })
    })

    describe('POST /v1/launches', () => {
        const launch = {
            launchDate: "08/01/2026",
            mission: "Horizon300",
            rocket: "Explorer IS1",
            target: "Kepler-1652 b"
        }

        const launchWithoutDate = {
            mission: "Horizon300",
            rocket: "Explorer IS1",
            target: "Kepler-1652 b"
        }

        const launchWithInvalidDate = {
            mission: "Horizon300",
            rocket: "Explorer IS1",
            target: "Kepler-1652 b",
            launchDate: "hello"
        }

        test('returns 201 status and created launch', async () => {
            const createdResponse = await request(app)
                .post('/v1/launches')
                .send(launch)
                .expect(201)
                .expect('Content-Type', /json/);

            expect(createdResponse.body).toHaveProperty('ok', 1);
            expect(createdResponse.body).toHaveProperty('flightNumber');
        })

        test('returns 400 status and response containing missing property error message', async () => {
            const missingPropertyResponse = await request(app)
                .post('/v1/launches')
                .send(launchWithoutDate)
                .expect(400)
                .expect('Content-Type', /json/);

            expect(missingPropertyResponse.body).toMatchObject(
                {
                    error: "required property missing"
                }
            );
        })

        test('returns 400 status and response containing invalid data error message', async () => {
            const invalidDateResponse = await request(app)
                .post('/v1/launches')
                .send(launchWithInvalidDate)
                .expect(400)
                .expect('Content-Type', /json/);

            expect(invalidDateResponse.body).toMatchObject(
                {
                    error: "invalid date"
                }
            );
        })
    })
})

