import request from 'supertest'
import app from '../../src/app.js' // adjust path/import to match your app export

export async function loginAsShelterAdmin(agent: ReturnType<typeof request.agent>, email: string, password: string) {
  const res = await agent
    .post('/admin/login') 
    .send({ email, password })

  return res
}