function generatePairingCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default {
  async beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    if (!event.params.data.pairingCode) {
      event.params.data.pairingCode = generatePairingCode();
    }
  },
};
