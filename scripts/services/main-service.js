const mainService = (() => {
  function postOffer(car) {
    return kinvey.post("appdata", "offers", "kinvey", car);
  }
  function getAllCars() {
    return kinvey.get("appdata", "offers", "kinvey");
  }
  function getACar(id) {
    return kinvey.get("appdata", `offers/${id}`, "kinvey");
  }
  function updateOffer(id, car) {
    return kinvey.update("appdata", `offers/${id}`, "kinvey", car);
  }
  function deleteCar(id){
      return kinvey.remove("appdata", `offers/${id}`, "kinvey");
  }
  return {
    postOffer,
    getAllCars,
    getACar,
    updateOffer,
    deleteCar
  };
})();
