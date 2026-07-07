import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

import * as ApplicationModel from '../../src/models/application.js'
import * as AdopterModel from '../../src/models/adopter.js'
import * as AdminModel from '../../src/models/shelterAdmin.js'

import { fakeAdmin, fakeApplicationSubmitted, fakeApplicationUnderReview, fakeApplicationApproved, withDetails, fakeApplicationUnderReviewWrongShelter, fakeBookingsAllCompletedWithPets, fakeAdopterNoPets, fakeBookingsAllCompletedNoPets,  fakeApplicationUnderReviewWithPetsAdopter, fakeAdopterWithPets, fakeBookingsBookedNotCompleted, fakeBookingsMissingPetIntroduction, fakeApplicationRejected } from '../utils/fakeProfiles.js'

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('GET /admin/applications', () => {
    it('gets the applications belonging to shelter and returns 200', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppsByShelter').mockResolvedValue([withDetails(fakeApplicationSubmitted)])

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get('/admin/applications')

        expect(res.status).toBe(200)
        expect(ApplicationModel.getAppsByShelter).toHaveBeenCalledTimes(1)
        expect(ApplicationModel.getAppsByShelter).toHaveBeenCalledWith(fakeAdmin.shelter_id)
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppsByShelter').mockRejectedValue(new Error('Database error'))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get('/admin/applications')

        expect(res.status).toBe(500)
        expect(ApplicationModel.getAppsByShelter).toHaveBeenCalledTimes(1)
    })
})

describe('GET /admin/applications/:id', () => {
    it('gets the application belonging to shelter and returns 200', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationSubmitted))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/applications/${fakeApplicationSubmitted.application_id}`)

        expect(res.status).toBe(200)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledWith(fakeApplicationSubmitted.application_id, fakeAdmin.shelter_id)
    })

    it('should return 400 if application id is invalid', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationSubmitted))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/applications/abc`)

        expect(res.status).toBe(400)
        expect(ApplicationModel.getAppByIdAndShelter).not.toHaveBeenCalled()
    })

    it('should return 404 if application is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(null)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/applications/${fakeApplicationSubmitted.application_id}`)

        expect(res.status).toBe(404)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledTimes(1)
    })

    it('should return 404 if application belongs to a different shelter', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(null)

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/applications/${fakeApplicationUnderReviewWrongShelter.application_id}`)

        expect(res.status).toBe(404)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledWith(fakeApplicationUnderReviewWrongShelter.application_id, fakeAdmin.shelter_id)
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockRejectedValue(new Error('Database error'))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .get(`/admin/applications/${fakeApplicationSubmitted.application_id}`)

        expect(res.status).toBe(500)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledTimes(1)
    })
})

describe('POST /admin/applications/:id/review', () => {
    it('should update status to under review and redirects to application', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationSubmitted))

        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(withDetails(fakeApplicationUnderReview))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationSubmitted.application_id}/review`)

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe(`/admin/applications/${fakeApplicationSubmitted.application_id}`)

        expect(ApplicationModel.updateApplicationStatus).toHaveBeenCalledTimes(1)
    })

    it('should return 400 if application is in invalid status to be put under review', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationApproved))

        jest.spyOn(ApplicationModel, 'updateApplicationStatus')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationApproved.application_id}/review`)

        expect(res.status).toBe(400)
        expect(ApplicationModel.updateApplicationStatus).not.toHaveBeenCalled()
    })

    it('should return 400 if application id is invalid', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/abc/review`)

        expect(res.status).toBe(400)
        expect(ApplicationModel.getAppByIdAndShelter).not.toHaveBeenCalled()
    })

    it('should return 404 if application is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(null)

        jest.spyOn(ApplicationModel, 'updateApplicationStatus')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationSubmitted.application_id}/review`)

        expect(res.status).toBe(404)
        expect(ApplicationModel.updateApplicationStatus).not.toHaveBeenCalled()
    })

    it('should return 404 if application belongs to a different shelter', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(null)

        jest.spyOn(ApplicationModel, 'updateApplicationStatus')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReviewWrongShelter.application_id}/review`)

        expect(res.status).toBe(404)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledWith(fakeApplicationUnderReviewWrongShelter.application_id, fakeAdmin.shelter_id)
        expect(ApplicationModel.updateApplicationStatus).not.toHaveBeenCalled()
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationSubmitted))

        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockRejectedValue(new Error('Database error'))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationSubmitted.application_id}/review`)

        expect(res.status).toBe(500)
        expect(ApplicationModel.updateApplicationStatus).toHaveBeenCalledTimes(1)
    })
})

describe('POST /admin/applications/:id/approve', () => {
    it('approves application when status is under review and visits are complete', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationUnderReview))
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterNoPets)
        jest.spyOn(ApplicationModel, 'getBookingsByApp').mockResolvedValue(fakeBookingsAllCompletedNoPets)

        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(withDetails(fakeApplicationApproved))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReview.application_id}/approve`)

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe(`/admin/applications/${fakeApplicationUnderReview.application_id}`)

        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledWith(
            fakeApplicationUnderReview.application_id, fakeAdmin.shelter_id
        )
        expect(AdopterModel.getAdopterById).toHaveBeenCalledWith(fakeApplicationUnderReview.adopter_id)
        expect(ApplicationModel.getBookingsByApp).toHaveBeenCalledWith(fakeApplicationUnderReview.application_id)
        expect(ApplicationModel.updateApplicationStatus).toHaveBeenCalledTimes(1)
        expect(ApplicationModel.updateApplicationStatus).toHaveBeenCalledWith(fakeApplicationUnderReview.application_id, 'approved')
    })

    it('should redirect with missing param when a required visit type is not booked at all', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationUnderReviewWithPetsAdopter))
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterWithPets)
        jest.spyOn(ApplicationModel, 'getBookingsByApp').mockResolvedValue(fakeBookingsMissingPetIntroduction)

        jest.spyOn(ApplicationModel, 'updateApplicationStatus')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReviewWithPetsAdopter.application_id}/approve`)

        expect(res.status).toBe(302)
        expect(res.headers.location).toContain('missing=pet_introduction')
        expect(ApplicationModel.updateApplicationStatus).not.toHaveBeenCalled()
    })

    it('should redirect with missing param when a required visit is booked but not completed', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationUnderReview))
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterNoPets)
        jest.spyOn(ApplicationModel, 'getBookingsByApp').mockResolvedValue(fakeBookingsBookedNotCompleted)

        jest.spyOn(ApplicationModel, 'updateApplicationStatus')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReview.application_id}/approve`)

        expect(res.status).toBe(302)
        expect(res.headers.location).toContain('missing=')
        expect(ApplicationModel.updateApplicationStatus).not.toHaveBeenCalled()
    })

    it('should approve when adopter has current pets and all three visit types are completed', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationUnderReviewWithPetsAdopter))
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterWithPets)
        jest.spyOn(ApplicationModel, 'getBookingsByApp').mockResolvedValue(fakeBookingsAllCompletedWithPets)

        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(withDetails(fakeApplicationApproved))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReviewWithPetsAdopter.application_id}/approve`)

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe(`/admin/applications/${fakeApplicationUnderReviewWithPetsAdopter.application_id}`)
        expect(ApplicationModel.updateApplicationStatus).toHaveBeenCalledWith(fakeApplicationUnderReviewWithPetsAdopter.application_id, 'approved')
    })

    it('should return 404 if adopter is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationUnderReview))
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(null)

        jest.spyOn(ApplicationModel, 'updateApplicationStatus')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReview.application_id}/approve`)

        expect(res.status).toBe(404)
        expect(ApplicationModel.updateApplicationStatus).not.toHaveBeenCalled()
    })

    it('should return 400 if status is not under review', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationSubmitted))

        jest.spyOn(ApplicationModel, 'updateApplicationStatus')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationSubmitted.application_id}/approve`)

        expect(res.status).toBe(400)
        expect(ApplicationModel.updateApplicationStatus).not.toHaveBeenCalled()
    })

    it('should return 404 if application is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(null)

        jest.spyOn(ApplicationModel, 'updateApplicationStatus')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReview.application_id}/approve`)

        expect(res.status).toBe(404)
        expect(ApplicationModel.updateApplicationStatus).not.toHaveBeenCalled()
    })

    it('should return 404 if application belongs to a different shelter', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(null)

        jest.spyOn(ApplicationModel, 'updateApplicationStatus')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReviewWrongShelter.application_id}/approve`)

        expect(res.status).toBe(404)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledWith(fakeApplicationUnderReviewWrongShelter.application_id, fakeAdmin.shelter_id)
        expect(ApplicationModel.updateApplicationStatus).not.toHaveBeenCalled()
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationUnderReview))
        jest.spyOn(AdopterModel, 'getAdopterById').mockResolvedValue(fakeAdopterNoPets)
        jest.spyOn(ApplicationModel, 'getBookingsByApp').mockResolvedValue(fakeBookingsAllCompletedNoPets)

        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockRejectedValue(new Error('Database error'))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReview.application_id}/approve`)

        expect(res.status).toBe(500)
        expect(ApplicationModel.updateApplicationStatus).toHaveBeenCalledTimes(1)
    })
})

describe('POST /admin/applications/:id/reject', () => {
    it('should update status to rejected and redirects to application', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationUnderReview))

        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockResolvedValue(withDetails(fakeApplicationRejected))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReview.application_id}/reject`)

        expect(res.status).toBe(302)
        expect(res.headers.location).toBe(`/admin/applications/${fakeApplicationUnderReview.application_id}`)

        expect(ApplicationModel.updateApplicationStatus).toHaveBeenCalledTimes(1)
    })

    it('should return 400 if application is in invalid status to be rejected', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationApproved))

        jest.spyOn(ApplicationModel, 'updateApplicationStatus')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationApproved.application_id}/reject`)

        expect(res.status).toBe(400)
        expect(ApplicationModel.updateApplicationStatus).not.toHaveBeenCalled()
    })

    it('should return 400 if application id is invalid', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/abc/reject`)

        expect(res.status).toBe(400)
        expect(ApplicationModel.getAppByIdAndShelter).not.toHaveBeenCalled()
    })

    it('should return 404 if application is not found', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(null)

        jest.spyOn(ApplicationModel, 'updateApplicationStatus')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReview.application_id}/reject`)

        expect(res.status).toBe(404)
        expect(ApplicationModel.updateApplicationStatus).not.toHaveBeenCalled()
    })

    it('should return 404 if application belongs to a different shelter', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(null)

        jest.spyOn(ApplicationModel, 'updateApplicationStatus')

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReviewWrongShelter.application_id}/reject`)

        expect(res.status).toBe(404)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledTimes(1)
        expect(ApplicationModel.getAppByIdAndShelter).toHaveBeenCalledWith(fakeApplicationUnderReviewWrongShelter.application_id, fakeAdmin.shelter_id)
        expect(ApplicationModel.updateApplicationStatus).not.toHaveBeenCalled()
    })

    it('should return 500 if a database error occurs', async () => {
        jest.spyOn(AdminModel, 'getAdminByEmail').mockResolvedValue(fakeAdmin)
        jest.spyOn(AdminModel, 'getAdminById').mockResolvedValue(fakeAdmin)
        jest.spyOn(ApplicationModel, 'getAppByIdAndShelter').mockResolvedValue(withDetails(fakeApplicationUnderReview))

        jest.spyOn(ApplicationModel, 'updateApplicationStatus').mockRejectedValue(new Error('Database error'))

        const agent = request.agent(app)

        await agent
            .post('/admin/login')
            .send({ email: fakeAdmin.email, password: 'TestPassword123!'})

        const res = await agent
            .post(`/admin/applications/${fakeApplicationUnderReview.application_id}/reject`)

        expect(res.status).toBe(500)
        expect(ApplicationModel.updateApplicationStatus).toHaveBeenCalledTimes(1)
    })
})