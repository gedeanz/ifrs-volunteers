const prisma = require('../config/prisma');

function mapRegistrationEvent(registration) {
  return {
    id: registration.event.id,
    title: registration.event.title,
    description: registration.event.description ?? null,
    event_date: registration.event.eventDate,
    location: registration.event.location,
    capacity: registration.event.capacity,
    registered_at: registration.registeredAt,
  };
}

function mapRegistrationVolunteer(registration) {
  return {
    id: registration.volunteer.id,
    name: registration.volunteer.name,
    email: registration.volunteer.email,
    phone: registration.volunteer.phone,
    registered_at: registration.registeredAt,
  };
}

/**
 * Model responsável pelo acesso aos dados de inscrições em eventos
 */
class RegistrationModel {
  /**
   * Registra um voluntário em um evento
   * @param {number} eventId - ID do evento
   * @param {number} volunteerId - ID do voluntário
   * @returns {Promise<Object>} Resultado da inserção
   */
  static async register(eventId, volunteerId) {
    return prisma.eventRegistration.create({
      data: {
        eventId: Number(eventId),
        volunteerId: Number(volunteerId),
      },
    });
  }


  /**
   * Remove a inscrição de um voluntário em um evento
   * @param {number} eventId - ID do evento
   * @param {number} volunteerId - ID do voluntário
   * @returns {Promise<Object>} Resultado da remoção
   */
  static async unregister(eventId, volunteerId) {
    return prisma.eventRegistration.deleteMany({
      where: {
        eventId: Number(eventId),
        volunteerId: Number(volunteerId),
      },
    });
  }


  /**
   * Verifica se um voluntário está inscrito em um evento
   * @param {number} eventId - ID do evento
   * @param {number} volunteerId - ID do voluntário
   * @returns {Promise<boolean>} true se inscrito, false caso contrário
   */
  static async isRegistered(eventId, volunteerId) {
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        unique_registration: {
          eventId: Number(eventId),
          volunteerId: Number(volunteerId),
        },
      },
    });

    return Boolean(registration);
  }

  /**
   * Conta o número de inscrições em um evento
   * @param {number} eventId - ID do evento
   * @returns {Promise<number>} Total de inscrições
   */
  static async countRegistrations(eventId) {
    const result = await prisma.eventRegistration.count({
      where: { eventId: Number(eventId) },
    });

    return result;
  }

  /**
   * Busca todas as inscrições de um voluntário com dados dos eventos
   * @param {number} volunteerId - ID do voluntário
   * @returns {Promise<Array>} Array de eventos inscritos ordenados por data
   */
  static async getByVolunteer(volunteerId) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { volunteerId: Number(volunteerId) },
      include: {
        event: true,
      },
      orderBy: {
        event: {
          eventDate: 'asc',
        },
      },
    });

    return registrations.map(mapRegistrationEvent);
  }

  /**
   * Busca todos os voluntários inscritos em um evento
   * @param {number} eventId - ID do evento
   * @returns {Promise<Array>} Array de voluntários inscritos ordenados por data de inscrição
   */
  static async getByEvent(eventId) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: Number(eventId) },
      include: {
        volunteer: true,
      },
      orderBy: {
        registeredAt: 'asc',
      },
    });

    return registrations.map(mapRegistrationVolunteer);
  }
}

module.exports = RegistrationModel;
