const RegistrationModel = require('../models/registrationModel');
const EventModel = require('../models/eventModel');

class RegistrationService {

  static async register(eventId, volunteerId) {
    // Verifica se evento existe
    const event = await EventModel.findById(eventId);
    if (!event) {
      throw new Error('Evento não encontrado');
    }

    const alreadyRegistered = await RegistrationModel.isRegistered(eventId, volunteerId);
    if (alreadyRegistered) {
      throw new Error('Você já está inscrito neste evento');
    }

    if (event.capacity > 0) {
      const currentRegistrations = await RegistrationModel.countRegistrations(eventId);
      if (currentRegistrations >= event.capacity) {
        throw new Error('Não há mais vagas disponíveis para este evento');
      }
    }

    await RegistrationModel.register(eventId, volunteerId);
    return { message: 'Inscrição realizada com sucesso' };
  }

  static async unregister(eventId, volunteerId) {
    const isRegistered = await RegistrationModel.isRegistered(eventId, volunteerId);
    if (!isRegistered) {
      throw new Error('Você não está inscrito neste evento');
    }

    await RegistrationModel.unregister(eventId, volunteerId);
    return { message: 'Inscrição cancelada com sucesso' };
  }

  static async getMyRegistrations(volunteerId) {
    const registrations = await RegistrationModel.getByVolunteer(volunteerId);
    return registrations;
  }

  static async getEventRegistrations(eventId) {
    const registrations = await RegistrationModel.getByEvent(eventId);
    return registrations;
  }
}

module.exports = RegistrationService;
