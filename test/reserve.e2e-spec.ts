import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { ReserveDto } from '../src/reserve/dto/reserve.dto';
import { disconnect, Types } from 'mongoose';
import { roomTestDto } from './rooms.e2e-spec';
import { GetIdReserveDto } from '../src/reserve/dto/reserve-id.dto';
import { ADMIN, USER } from './user/constants';

describe('ReserveController (e2e)', () => {
  let app: INestApplication;
  let roomId: Types.ObjectId;
  let reserveId: string;
  let token_user: string;
  let token_admin: string;
  const errorId = '65f369b4bbf22dc63233144dd';
  const ObjectId = '6608318f3380f1e9db120dc9';
  const reserveTestDto: ReserveDto = {
    checkInDate: Math.floor(Math.random() * 31) + 1,
    room_id: roomId,
  };
  const patchDto: GetIdReserveDto = {
    id: new Types.ObjectId(reserveId),
    ...reserveTestDto,
    checkInDate: Math.floor(Math.random() * 5) + 1, // допустимые дни
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: USER.email,
        password: USER.password,
      });
    token_user = body.access_token;

    const { body: body2 } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: ADMIN.email,
        password: ADMIN.password,
      });
    token_admin = body2.access_token;
  });

  describe('Default tests', () => {
    it('/rooms/create (POST) - success 201', async () => {
      return request(app.getHttpServer())
        .post('/rooms/create')
        .set('Authorization', 'Bearer ' + token_admin)
        .send({
          ...roomTestDto,
          room_number: Math.floor(Math.random() * 31) + 1,
        })
        .expect(201)
        .then(({ body }: request.Response) => {
          roomId = body.newRoom?._id;
          reserveTestDto.room_id = roomId;
          expect(roomId).toBeDefined();
          return;
        });
    });

    it('/reserve/create (POST) - success 201', async () => {
      return request(app.getHttpServer())
        .post('/reserve/create')
        .set('Authorization', 'Bearer ' + token_user)
        .send(reserveTestDto)
        .expect(201)
        .then(({ body }: request.Response) => {
          reserveId = body.newReserve._id;
          expect(reserveId).toBeDefined();
          return;
        });
    });
    describe('Вывод информации о резерве', () => {
      it('/reserve/:id (GET) - success 200', async () => {
        return request(app.getHttpServer())
          .get('/reserve/' + reserveId)
          .set('Authorization', 'Bearer ' + token_user)
          .send(reserveTestDto)
          .expect(200)
          .then(({ body }: request.Response) => {
            expect(reserveId === body._id).toBe(true);
            return;
          });
      });
      it('/reserve/:id (GET) - fail 404', () => {
        return request(app.getHttpServer())
          .get(`/reserve/${ObjectId}`)
          .set('Authorization', 'Bearer ' + token_user)
          .send(roomTestDto)
          .expect(404);
      });
    });
    describe('Обновление дынных резерва по id', () => {
      it('/reserve/:id (PATCH) - success 200', async () => {
        await request(app.getHttpServer())
          .patch('/reserve/' + reserveId)
          .set('Authorization', 'Bearer ' + token_user)
          .send({ ...patchDto, room_id: roomId })
          .expect(200);
      });

      it('/reserve/:id (PATCH) - fail 404', async () => {
        await request(app.getHttpServer())
          .patch('/reserve/' + ObjectId)
          .set('Authorization', 'Bearer ' + token_user)
          .send({ ...patchDto, room_id: roomId })
          .expect(404);
      });
    });
    describe('Удаление резерва по id', () => {
      it('/reserve/:id (DELETE) - success 200', () => {
        return request(app.getHttpServer())
          .delete('/reserve/' + reserveId)
          .set('Authorization', 'Bearer ' + token_user)
          .expect(200);
      });
      it('/reserve/:id (DELETE) - fail 404', () => {
        return request(app.getHttpServer())
          .delete('/reserve/' + ObjectId)
          .set('Authorization', 'Bearer ' + token_user)
          .expect(404);
      });
    });
    // -----------------Вывод всех комнат
    it('/reserve/all (GET)  - success 200', async () => {
      await request(app.getHttpServer())
        .get('/reserve/all')
        .set('Authorization', 'Bearer ' + token_user)
        .expect(200)
        .then(({ body }: request.Response) => {
          expect(body.length > 0).toBe(true);
          return;
        });
    });

    describe('Ошибки валидации', () => {
      it('reserve/create (POST) 400 validation error (checkInDate)', () => {
        return request(app.getHttpServer())
          .post('/reserve/create')
          .set('Authorization', 'Bearer ' + token_user)
          .send({
            ...reserveTestDto,
            checkInDate: 32,
          })
          .expect(400);
      });
      it('reserve/create (POST) 400 validation error (room_id)', () => {
        return request(app.getHttpServer())
          .post('/reserve/create')
          .set('Authorization', 'Bearer ' + token_user)
          .send({
            ...patchDto,
            room_id: 400,
          })
          .expect(400);
      });
      it('reserve/:id (PATCH) 400 validation error (checkInDate)', () => {
        return request(app.getHttpServer())
          .patch('/reserve/' + reserveId)
          .set('Authorization', 'Bearer ' + token_user)
          .send({
            ...patchDto,
            checkInDate: 0,
          })
          .expect(400);
      });
      it('/reserve (GET) 400 id must be a mongodb id', () => {
        return request(app.getHttpServer())
          .get('/reserve/0')
          .set('Authorization', 'Bearer ' + token_user)
          .expect(400);
      });
      it('/reserve (GET) 400 validation error (errorId)', () => {
        return request(app.getHttpServer())
          .get('/reserve/' + errorId)
          .set('Authorization', 'Bearer ' + token_user)
          .expect(400);
      });
    });
  });
  afterAll(() => disconnect());
});
