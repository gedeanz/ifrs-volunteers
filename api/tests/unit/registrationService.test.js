const RegistrationService = require('../../src/services/registrationService');
const RegistrationModel = require('../../src/models/registrationModel');
const EventModel = require('../../src/models/eventModel');

jest.mock('../../src/models/registrationModel');
jest.mock('../../src/models/eventModel');

describe('RegistrationService.register', () => {
  test('deve lançar erro quando evento não existe', async () => {
    EventModel.findById.mockResolvedValue(null);

    await expect(RegistrationService.register(1, 2)).rejects.toThrow('Evento não encontrado');
  });

  test('deve lançar erro quando voluntário já está inscrito', async () => {
    EventModel.findById.mockResolvedValue({ id: 1, capacity: 10 });
    RegistrationModel.isRegistered.mockResolvedValue(true);

    await expect(RegistrationService.register(1, 2)).rejects.toThrow(
      'Você já está inscrito neste evento',
    );
  });

  test('deve lançar erro quando não há mais vagas disponíveis', async () => {
    EventModel.findById.mockResolvedValue({ id: 1, capacity: 1 });
    RegistrationModel.isRegistered.mockResolvedValue(false);
    RegistrationModel.countRegistrations.mockResolvedValue(1);

    await expect(RegistrationService.register(1, 2)).rejects.toThrow(
      'Não há mais vagas disponíveis para este evento',
    );
  });

  test('deve registrar inscrição quando há vagas e não está inscrito', async () => {
    EventModel.findById.mockResolvedValue({ id: 1, capacity: 10 });
    RegistrationModel.isRegistered.mockResolvedValue(false);
    RegistrationModel.countRegistrations.mockResolvedValue(0);
    RegistrationModel.register.mockResolvedValue();

    const result = await RegistrationService.register(1, 2);

    expect(RegistrationModel.register).toHaveBeenCalledWith(1, 2);
    expect(result).toEqual({ message: 'Inscrição realizada com sucesso' });
  });
});

describe('RegistrationService.unregister', () => {
  test('deve lançar erro quando voluntário não está inscrito', async () => {
    RegistrationModel.isRegistered.mockResolvedValue(false);

    await expect(RegistrationService.unregister(1, 2)).rejects.toThrow(
      'Você não está inscrito neste evento',
    );
  });

  test('deve cancelar inscrição quando voluntário está inscrito', async () => {
    RegistrationModel.isRegistered.mockResolvedValue(true);
    RegistrationModel.unregister.mockResolvedValue();

    const result = await RegistrationService.unregister(1, 2);

    expect(RegistrationModel.unregister).toHaveBeenCalledWith(1, 2);
    expect(result).toEqual({ message: 'Inscrição cancelada com sucesso' });
  });
});
