const EventService = require('../../src/services/eventService');
const EventModel = require('../../src/models/eventModel');

jest.mock('../../src/models/eventModel');

describe('EventService.createEvent', () => {
  test('deve lançar erro 400 quando campos obrigatórios estão ausentes', async () => {
    await expect(EventService.createEvent({})).rejects.toMatchObject({
      message: 'title, event_date e location são obrigatórios',
      status: 400,
    });
  });

  test('deve lançar erro 400 quando data do evento está no passado', async () => {
    const payload = {
      title: 'Evento no passado',
      event_date: '2000-01-01 10:00:00',
      location: 'Auditório',
    };

    await expect(EventService.createEvent(payload)).rejects.toMatchObject({
      message: 'Não é possível criar eventos com data/horário que já passaram',
      status: 400,
    });
  });

  test('deve criar evento quando dados são válidos', async () => {
    const future = new Date();
    future.setDate(future.getDate() + 7);

    const payload = {
      title: 'Evento futuro',
      event_date: future.toISOString(),
      location: 'Campus IFRS',
      description: 'Criado em teste unitário',
      capacity: 50,
    };

    const createdEvent = { id: 123, ...payload };
    EventModel.create.mockResolvedValue(createdEvent);

    const result = await EventService.createEvent(payload);

    expect(EventModel.create).toHaveBeenCalledWith(payload);
    expect(result).toEqual(createdEvent);
  });
});
