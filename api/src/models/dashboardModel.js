const prisma = require('../config/prisma');

class DashboardModel {
  /**
   * Obtém estatísticas gerais para o dashboard administrativo.
   * @returns {Promise<{total_events: number, total_volunteers: number, total_capacity: number, upcoming: Array<{id: number, title: string, event_date: Date, location: string}>}>} Resumo das métricas principais.
   */
  static async getSummary() {
    const [totalEvents, totalVolunteers, capacityResult, upcomingEvents] = await Promise.all([
      prisma.event.count(),
      prisma.volunteer.count(),
      prisma.event.aggregate({ _sum: { capacity: true } }),
      prisma.event.findMany({
        where: { eventDate: { gte: new Date() } },
        orderBy: { eventDate: 'asc' },
        take: 5,
        select: {
          id: true,
          title: true,
          eventDate: true,
          location: true,
        },
      }),
    ]);

    return {
      total_events: totalEvents,
      total_volunteers: totalVolunteers,
      total_capacity: capacityResult._sum.capacity ?? 0,
      upcoming: upcomingEvents.map(({ id, title, eventDate, location }) => ({
        id,
        title,
        event_date: eventDate,
        location,
      })),
    };
  }
}

module.exports = DashboardModel;
