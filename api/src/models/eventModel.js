const prisma = require("../config/prisma");

function mapEvent(event, registeredCount) {
  if (!event) {
    return undefined;
  }

  return {
    id: event.id,
    title: event.title,
    description: event.description ?? null,
    event_date: event.eventDate,
    location: event.location,
    capacity: event.capacity,
    created_at: event.createdAt,
    ...(typeof registeredCount === "number"
      ? { registered_count: registeredCount }
      : {}),
  };
}

/**
 * Model responsável pelo acesso aos dados de eventos no banco
 */
class EventModel {
  /**
   * Busca todos os eventos com contagem de inscritos
   * @returns {Promise<Array>} Array de eventos ordenados por data
   */
  static async findAll() {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: "asc" },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    return events.map((event) =>
      mapEvent(event, event._count.registrations)
    );
  }
  /**
   * Cria um novo evento no banco de dados
   * @param {Object} params - Parâmetros do evento
   * @param {string} params.title - Título do evento
   * @param {string} params.description - Descrição do evento
   * @param {string} params.event_date - Data/hora do evento
   * @param {string} params.location - Local do evento
   * @param {number} params.capacity - Capacidade máxima
   * @returns {Promise<Object>} Evento criado com ID
   */
  static async create({ title, description, event_date, location, capacity }) {
    const event = await prisma.event.create({
      data: {
        title,
        description: description ?? null,
        eventDate: new Date(event_date),
        location,
        capacity: capacity ?? 0,
      },
    });

    return mapEvent(event);
  }
  /**
   * Busca um evento específico por ID
   * @param {number|string} id - ID do evento
   * @returns {Promise<Object|undefined>} Dados do evento ou undefined se não encontrado
   */
  static async findById(id) {
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
    });

    return mapEvent(event);
  }

  /**
   * Atualiza um evento existente
   * @param {number|string} id - ID do evento
   * @param {Object} params - Dados atualizados
   * @param {string} params.title - Título do evento
   * @param {string} params.description - Descrição do evento
   * @param {string} params.event_date - Data/hora do evento
   * @param {string} params.location - Local do evento
   * @param {number} params.capacity - Capacidade máxima
   * @returns {Promise<boolean>} true se atualizado com sucesso
   */
  static async update(
    id,
    { title, description, event_date, location, capacity }
  ) {
    await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description: description ?? null,
        eventDate: new Date(event_date),
        location,
        capacity: capacity ?? 0,
      },
    });

    return true;
  }

  /**
   * Remove um evento do banco de dados
   * @param {number|string} id - ID do evento
   * @returns {Promise<boolean>} true se removido com sucesso
   */
  static async remove(id) {
    await prisma.event.delete({
      where: { id: Number(id) },
    });

    return true;
  }
}

module.exports = EventModel;
