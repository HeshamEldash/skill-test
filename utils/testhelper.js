function createData() {
    return {
        id: "8cbdd2b0-7055-40d3-8f2d-ba9b38gb3d1e",
        type: "ON_DEMAND",
        priceInPence: "10000",
        contactEmail: "test@test.com",
        status: "ASSIGNED",
        createdAt: new Date("2020-06-01").toISOString(),
        updatedAt: null,
      }
}

module.exports = { createData };