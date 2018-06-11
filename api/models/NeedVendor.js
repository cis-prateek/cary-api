module.exports = {

  attributes: {
    need: {
      model: 'ProductNeed',
      required: true
    },
    quatation: {
      model: 'Quatations'
    },
    provider: {
      model: 'User',
      required: true
    }
  }

};
