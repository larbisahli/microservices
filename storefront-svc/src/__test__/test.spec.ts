// import request from 'supertest';
// import server from '../server';

// describe('Graph API', () => {
//   afterEach((done) => {
//     // server.close();
//     done();
//   });

//   it('Login in user', (done) => {
//     request(server)
//       .post('/graphql')
//       .send({
//         query: `
//         mutation { staffLogin(email: "larbi@gmail.com"  password: "1905" remember_me: false){success} }
//       `,
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//         expect(JSON.parse(res.text)).toMatchObject({
//           data: { staffLogin: { success: true } },
//         });
//         done();
//       });
//   });
// });
