const RegistrationModel = require('../models/registrationModel');
const EventModel = require('../models/eventModel');

/**
 * Service responsável pelas regras de negócio de inscrições em eventos
 */
class RegistrationService {
  /**
   * Inscreve um voluntário em um evento com validações
   * @param {number} eventId - ID do evento
   * @param {number} volunteerId - ID do voluntário
   * @returns {Promise<Object>} Mensagem de sucesso
   * @throws {Error} Lança erro se evento não existe, já inscrito ou sem vagas
   */
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

  /**
   * Cancela a inscrição de um voluntário em um evento
   * @param {number} eventId - ID do evento
   * @param {number} volunteerId - ID do voluntário
   * @returns {Promise<Object>} Mensagem de sucesso
   * @throws {Error} Lança erro se não estiver inscrito
   */
  static async unregister(eventId, volunteerId) {
    const isRegistered = await RegistrationModel.isRegistered(eventId, volunteerId);
    if (!isRegistered) {
      throw new Error('Você não está inscrito neste evento');
    }

    await RegistrationModel.unregister(eventId, volunteerId);
    return { message: 'Inscrição cancelada com sucesso' };
  }

  /**
   * Lista todas as inscrições de um voluntário
   * @param {number} volunteerId - ID do voluntário
   * @returns {Promise<Array>} Array de inscrições com dados dos eventos
   */
  static async getMyRegistrations(volunteerId) {
    const registrations = await RegistrationModel.getByVolunteer(volunteerId);
    return registrations;
  }

  /**
   * Lista todos os voluntários inscritos em um evento
   * @param {number} eventId - ID do evento
   * @returns {Promise<Array>} Array de inscrições com dados dos voluntários
   */
  static async getEventRegistrations(eventId) {
    const registrations = await RegistrationModel.getByEvent(eventId);
    return registrations;
  }
}

module.exports = RegistrationService;
