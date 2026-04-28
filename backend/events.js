const eventsByGender = {
  men: [
    {
      group: "Freestyle",
      events: [
        { id: "men-50-free", name: "50 Free", price: 500, status: "available", reservedUntil: null },
        { id: "men-100-free", name: "100 Free", price: 500, status: "available", reservedUntil: null },
        { id: "men-200-free", name: "200 Free", price: 500, status: "available", reservedUntil: null },
        { id: "men-400-free", name: "400 Free", price: 500, status: "available", reservedUntil: null },
        { id: "men-1500-free", name: "1500 Free", price: 500, status: "available", reservedUntil: null }
      ]
    },
    {
      group: "Backstroke",
      events: [
        { id: "men-50-back", name: "50 Back", price: 500, status: "available", reservedUntil: null },
        { id: "men-100-back", name: "100 Back", price: 500, status: "available", reservedUntil: null },
        { id: "men-200-back", name: "200 Back", price: 500, status: "available", reservedUntil: null }
      ]
    },
    {
      group: "Breaststroke",
      events: [
        { id: "men-50-breast", name: "50 Breast", price: 500, status: "available", reservedUntil: null },
        { id: "men-100-breast", name: "100 Breast", price: 500, status: "available", reservedUntil: null },
        { id: "men-200-breast", name: "200 Breast", price: 500, status: "available", reservedUntil: null }
      ]
    },
    {
      group: "Butterfly",
      events: [
        { id: "men-50-fly", name: "50 Fly", price: 500, status: "available", reservedUntil: null },
        { id: "men-100-fly", name: "100 Fly", price: 500, status: "available", reservedUntil: null },
        { id: "men-200-fly", name: "200 Fly", price: 500, status: "available", reservedUntil: null }
      ]
    },
    {
      group: "Individual Medley",
      events: [
        { id: "men-200-im", name: "200 I.M.", price: 500, status: "available", reservedUntil: null },
        { id: "men-400-im", name: "400 I.M.", price: 500, status: "available", reservedUntil: null }
      ]
    },
    {
      group: "Relays",
      events: [
        { id: "men-4x100-free-relay", name: "4x100 Freestyle Relay", price: 1000, status: "available", reservedUntil: null },
        { id: "men-4x100-medley-relay", name: "4x100 Medley Relay", price: 1000, status: "available", reservedUntil: null },
        { id: "men-4x200-free-relay", name: "4x200 Freestyle Relay", price: 1000, status: "available", reservedUntil: null }
      ]
    }
  ],
  women: [
    {
      group: "Freestyle",
      events: [
        { id: "women-50-free", name: "50 Free", price: 500, status: "available", reservedUntil: null },
        { id: "women-100-free", name: "100 Free", price: 500, status: "available", reservedUntil: null },
        { id: "women-200-free", name: "200 Free", price: 500, status: "available", reservedUntil: null },
        { id: "women-400-free", name: "400 Free", price: 500, status: "available", reservedUntil: null },
        { id: "women-800-free", name: "800 Free", price: 500, status: "available", reservedUntil: null }
      ]
    },
    {
      group: "Backstroke",
      events: [
        { id: "women-50-back", name: "50 Back", price: 500, status: "available", reservedUntil: null },
        { id: "women-100-back", name: "100 Back", price: 500, status: "available", reservedUntil: null },
        { id: "women-200-back", name: "200 Back", price: 500, status: "available", reservedUntil: null }
      ]
    },
    {
      group: "Breaststroke",
      events: [
        { id: "women-50-breast", name: "50 Breast", price: 500, status: "available", reservedUntil: null },
        { id: "women-100-breast", name: "100 Breast", price: 500, status: "available", reservedUntil: null },
        { id: "women-200-breast", name: "200 Breast", price: 500, status: "available", reservedUntil: null }
      ]
    },
    {
      group: "Butterfly",
      events: [
        { id: "women-50-fly", name: "50 Fly", price: 500, status: "available", reservedUntil: null },
        { id: "women-100-fly", name: "100 Fly", price: 500, status: "available", reservedUntil: null },
        { id: "women-200-fly", name: "200 Fly", price: 500, status: "available", reservedUntil: null }
      ]
    },
    {
      group: "Individual Medley",
      events: [
        { id: "women-200-im", name: "200 I.M.", price: 500, status: "available", reservedUntil: null },
        { id: "women-400-im", name: "400 I.M.", price: 500, status: "available", reservedUntil: null }
      ]
    },
    {
      group: "Relays",
      events: [
        { id: "women-4x100-free-relay", name: "4x100 Freestyle Relay", price: 1000, status: "available", reservedUntil: null },
        { id: "women-4x100-medley-relay", name: "4x100 Medley Relay", price: 1000, status: "available", reservedUntil: null },
        { id: "women-4x200-free-relay", name: "4x200 Freestyle Relay", price: 1000, status: "available", reservedUntil: null }
      ]
    }
  ]
};

module.exports = eventsByGender;